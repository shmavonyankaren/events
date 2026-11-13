import CheckoutButton from "@/components/shared/CheckoutButton";
import Collection from "@/components/shared/Collection";
import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/actions/event.actions";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

const EventDetails = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const event = await getEventById(id);

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  });

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-6 px-5 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-2 lg:px-8 lg:py-10 xl:gap-10">
          <div className="relative aspect-[4/3] max-h-96 w-full min-w-0 overflow-hidden rounded-lg sm:aspect-video lg:aspect-[4/3]">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              sizes="(min-width: 1280px) 588px, (min-width: 1024px) calc((100vw - 96px) / 2), (min-width: 640px) calc(100vw - 48px), calc(100vw - 40px)"
              className="object-cover object-center"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
            <div className="flex min-w-0 flex-col gap-4">
              <h1 className="break-words text-2xl font-bold leading-tight sm:text-3xl xl:text-4xl">{event.title}</h1>

              <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3">
                <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
                  <p className="max-w-full break-words rounded-full bg-green-500/10 px-4 py-2 text-sm font-bold leading-5 text-green-700 sm:text-base sm:leading-6">
                    {event.isFree ? "FREE" : `$${event.price}`}
                  </p>
                  <p className="min-w-0 max-w-full break-words rounded-full bg-grey-500/10 px-4 py-2 text-sm font-medium leading-5 text-grey-500 sm:text-base sm:leading-6">
                    {event.category.name}
                  </p>
                </div>

                <p className="flex min-w-0 max-w-full items-center gap-2 text-sm font-medium leading-6 sm:text-base">
                  <span className="shrink-0">by</span>
                  <Image
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                    src={event.organizer.photo}
                    alt="event creator"
                    width={32}
                    height={32}
                  />
                  <span className="min-w-0 break-words text-primary-500">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>

            <CheckoutButton event={event} />

            <div className="flex min-w-0 flex-col gap-4 text-sm leading-6 sm:text-base">
              <div className="flex min-w-0 items-start gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={24}
                  height={24}
                  className="h-6 w-6 shrink-0"
                />
                <div className="flex min-w-0 flex-col gap-1 break-words">
                  <p>
                    <span className="font-medium">Starts: </span>
                    {formatDateTime(event.startDateTime).dateOnly} -{" "}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    <span className="font-medium">Ends: </span>
                    {formatDateTime(event.endDateTime).dateOnly} -{" "}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-start gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={24}
                  height={24}
                  className="h-6 w-6 shrink-0"
                />
                <p className="min-w-0 break-words">{event.location}</p>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-base font-bold leading-6 text-grey-600 sm:text-lg">What You'll Learn:</p>
              <p className="whitespace-pre-line break-words text-sm leading-6 sm:text-base sm:leading-7">{event.description}</p>
              {event.url && (
                <Link href={event.url}>
                  <p className="break-words text-sm leading-6 text-primary-500 underline sm:text-base">
                    {event.url}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS with the same category */}
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
        <h2 className="text-2xl font-bold leading-tight sm:text-3xl">Related Events</h2>

        <Collection
          data={relatedEvents?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={3}
          page={searchParams.page as string}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default EventDetails;
