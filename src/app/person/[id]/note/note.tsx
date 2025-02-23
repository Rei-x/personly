"use client";

import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/trpc/react";

interface NoteProps {
  personId: string;
  id: string;
  initialTitle: string;
  initialDescription: string;
}

export function Note({
  personId,
  id,
  initialTitle,
  initialDescription,
}: NoteProps) {
  const [title, setTitle] = useState(initialTitle);
  const [note, setNote] = useState(initialDescription);

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedNote = useDebounce(note, 1000);

  const saveNote = api.person.saveEvent.useMutation();

  useEffect(() => {
    if (debouncedTitle || debouncedNote) {
      history.replaceState({}, "", `/person/${personId}/note/${id}`);

      saveNote.mutate({
        id,
        personId,
        title: debouncedTitle,
        description: debouncedNote,
      });
    }
  }, [debouncedTitle, debouncedNote, personId, id]);

  return (
    <form className="mt-4 flex flex-grow flex-col gap-2">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        className="bg-transparent text-lg font-medium outline-none"
      />
      <textarea
        placeholder="Note"
        value={note}
        onChange={(event) => {
          setNote(event.target.value);
        }}
        className="flex-grow resize-none bg-transparent outline-none"
      />
    </form>
  );
}
