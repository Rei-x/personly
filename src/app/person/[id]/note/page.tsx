import { createId } from "@paralleldrive/cuid2";
import { ChevronLeft, PenBoxIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { requireAuth } from "@/server/auth";
import { db } from "@/server/db";

import { Note } from "./note";

async function EditPerson({
  params,
}: {
  params: Promise<{ id: string; noteId?: string }>;
}) {
  const { id, noteId } = await params;
  const session = await requireAuth();

  const person = await db.person.findUniqueOrThrow({
    where: {
      id,
      createdById: session.user.id,
    },
  });

  const note = noteId
    ? await db.event.findUnique({
        where: {
          id: noteId,
          personId: id,
        },
      })
    : null;

  return (
    <div className="mx-2 mt-8 flex h-[calc(100vh-2rem)] flex-col">
      <div className="flex justify-between">
        <Button asChild variant="link" size="icon">
          <Link href={`/person/${id}`}>
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
      <Note
        personId={id}
        id={note?.id ?? createId()}
        initialDescription={note?.description ?? ""}
        initialTitle={note?.name ?? ""}
      />
    </div>
  );
}

export default EditPerson;
