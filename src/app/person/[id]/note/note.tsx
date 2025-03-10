"use client";

import { Sparkle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

import { PolishButton } from "./polish-button";

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
  const generateTitle = api.ai.generateTitle.useMutation();
  const saveNote = api.person.saveEvent.useMutation();
  const polishNote = api.ai.polishNote.useMutation();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedNote, personId, id]);

  return (
    <>
      <form className="mt-8 flex min-h-0 flex-grow flex-col gap-2">
        <div className="flex w-full justify-between">
          <textarea
            placeholder="Title"
            disabled={generateTitle.isPending}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            className={cn(
              "w-full bg-transparent text-lg font-medium outline-none",
              {
                "opacity-50": generateTitle.isPending,
              },
            )}
          />
          <Button
            type="button"
            onClick={async () => {
              const result = await generateTitle.mutateAsync({
                note,
              });

              setTitle(result);
            }}
            variant="link"
            size="icon"
          >
            <Sparkle
              className={cn({
                "animate-spin": generateTitle.isPending,
              })}
              size={24}
            />
          </Button>
        </div>
        <textarea
          placeholder="Note"
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
          }}
          className="min-h-0 flex-grow resize-none bg-transparent pb-10 outline-none"
        />
      </form>
      <PolishButton
        onPolish={async () => {
          const result = await polishNote.mutateAsync({
            text: note,
          });
          setNote(result);
        }}
      />
    </>
  );
}
