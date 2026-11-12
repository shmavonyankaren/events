const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Load the project's TypeScript with isolated service mocks; no live database writes.
function load(file, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(
    name => name in mocks ? mocks[name] : require(name), module, module.exports,
  );
  return module.exports;
}

const { eventFormSchema } = load('lib/validator.ts');
const event = {
  title: 'Workshop', description: 'Learn web development', location: 'Berlin',
  imageUrl: 'https://example.com/image.png', categoryId: 'category',
  startDateTime: new Date(), endDateTime: new Date(), price: '0', isFree: true,
};

function setup({ signedIn = true, profile = true, owner = 'organizer' } = {}) {
  const calls = { writes: [], lookups: [], connections: 0 };
  const userModel = {
    findOne: async query => {
      calls.lookups.push(query);
      return profile ? { _id: 'organizer' } : null;
    },
  };
  const actions = load('lib/actions/event.actions.ts', {
    '@clerk/nextjs': { auth: () => ({ userId: signedIn ? 'clerk-account' : null }) },
    'next/cache': { revalidatePath() {} },
    '@/lib/validator': { eventFormSchema },
    '@/lib/database': { connectToDatabase: async () => { calls.connections++; } },
    '@/lib/database/models/user.model': userModel,
    '@/lib/database/models/event.model': {
      create: async data => { calls.writes.push(data); return { _id: 'event' }; },
      findById: async () => ({ organizer: owner }),
      findByIdAndUpdate: async (id, data) => {
        calls.writes.push(data);
        return { _id: id };
      },
    },
    '@/lib/database/models/category.model': {},
    '@/lib/utils': { handleError: error => { throw error; } },
  });
  return { ...actions, calls };
}

test('description accepts 1000 characters and rejects 1001', () => {
  assert.equal(eventFormSchema.safeParse({ ...event, description: 'a'.repeat(1000) }).success, true);
  assert.equal(eventFormSchema.safeParse({ ...event, description: 'a'.repeat(1001) }).success, false);
});

test('URL may be omitted or blank, but a supplied URL must be valid', () => {
  for (const url of [undefined, '', '   ', 'https://example.com']) {
    assert.equal(eventFormSchema.safeParse({ ...event, url }).success, true);
  }
  assert.equal(eventFormSchema.safeParse({ ...event, url: 'not a URL' }).success, false);
});

test('creation uses the authenticated account even without a custom claim or with a forged client ID', async () => {
  for (const userId of [null, 'another-user']) {
    const { createEvent, calls } = setup();
    assert.deepEqual(await createEvent({ event, userId, path: '/profile' }), { data: { _id: 'event' } });
    assert.deepEqual(calls.lookups, [{ clerkId: 'clerk-account' }]);
    assert.equal(calls.writes[0].organizer, 'organizer');
    assert.equal(calls.writes[0].url, '');
  }
});

test('signed-out creation is rejected before accessing the database', async () => {
  const { createEvent, calls } = setup({ signedIn: false });
  assert.match((await createEvent({ event, path: '/profile' })).error, /sign in/);
  assert.equal(calls.connections, 0);
});

test('missing database profile returns the setup error without saving for create and update', async () => {
  const { createEvent, updateEvent, calls } = setup({ profile: false });
  for (const action of [createEvent, updateEvent]) {
    assert.deepEqual(await action({ event: { ...event, _id: 'event' }, path: '/profile' }), {
      error: 'Your account profile has not synced yet. Please contact support to finish account setup.',
    });
  }
  assert.equal(calls.writes.length, 0);
});

test('create and update enforce description and URL rules on the server', async () => {
  const { createEvent, updateEvent, calls } = setup();
  for (const action of [createEvent, updateEvent]) {
    for (const invalid of [{ description: 'a'.repeat(1001) }, { url: 'invalid' }]) {
      assert.ok((await action({ event: { ...event, _id: 'event', ...invalid }, path: '/profile' })).error);
    }
  }
  assert.equal(calls.writes.length, 0);
});

test('update checks ownership and allows clearing the URL', async () => {
  const forbidden = setup({ owner: 'someone-else' });
  assert.match((await forbidden.updateEvent({ event: { ...event, _id: 'event' }, path: '/profile' })).error, /permission/);
  assert.equal(forbidden.calls.writes.length, 0);
  const allowed = setup();
  assert.ok((await allowed.updateEvent({ event: { ...event, _id: 'event', url: '' }, path: '/profile' })).data);
  assert.equal(allowed.calls.writes[0].url, '');
});

