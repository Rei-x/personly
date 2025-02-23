import { ChevronLeft, PenBoxIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { SwipeableEvent } from "@/components/swipeable-event";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/server/auth";
import { db } from "@/server/db";

async function Person({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAuth();

  const person = await db.person.findUniqueOrThrow({
    where: {
      id,
      createdById: session.user.id,
    },
  });

  const events = await db.event.findMany({
    where: {
      personId: id,
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="mx-2 mt-8">
      <div className="flex justify-between">
        <Button asChild variant="link" size="icon">
          <Link href="/">
            <ChevronLeft />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{person.name}</h1>
        <Button asChild variant="link" size="icon">
          <Link href={`/person/${id}/note`}>
            <PenBoxIcon />
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        <div className="flex flex-col gap-2">
          {events.length > 0 ? (
            events.map((event) => (
              <SwipeableEvent key={event.id} event={event} personId={id} />
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No events yet. Click the pen icon to add one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Person;
