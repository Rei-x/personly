import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { requireAuth } from "@/server/auth";
import { db } from "@/server/db";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  await requireAuth();
  const people = await db.person.findMany();

  return (
    <HydrateClient>
      <main className="mx-2 mt-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            className="text-sm text-muted-foreground hover:underline"
            href={"/api/auth/signout"}
          >
            Sign out
          </Link>
          <Button asChild>
            <Link href="/new">New Person</Link>
          </Button>
        </div>

        {people.length > 0 ? (
          <div className="flex flex-col space-y-2">
            {people.map((person) => (
              <Link
                className="flex w-full items-center gap-2 rounded-md border p-4"
                href={`/person/${person.id.toString()}`}
                key={person.id}
              >
                <PersonIcon /> {person.name}
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No people yet. Click the &quot;New Person&quot; button to add
            someone.
          </div>
        )}
      </main>
    </HydrateClient>
  );
}
