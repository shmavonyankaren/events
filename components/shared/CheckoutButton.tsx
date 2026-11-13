"use client"

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Checkout from './Checkout'

const CheckoutButton = ({ event }: { event: IEvent }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className="flex min-w-0 items-center gap-3">
      {hasEventFinished ? (
        <p className="text-sm leading-6 text-red-400 sm:text-base">Sorry, tickets are no longer available.</p>
      ): (
        <>
          <SignedOut>
            <Button asChild className="h-12 w-full rounded-full px-6 py-3 text-sm sm:w-auto sm:px-8 sm:text-base" size="lg">
              <Link href="/sign-in">
                Get Tickets
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Checkout event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  )
}

export default CheckoutButton