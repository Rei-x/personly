import Link from "next/link";

import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth();
  const people = await db.person.findMany();

  return (
    <HydrateClient>
      <main>
        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
          {session ? "Sign out" : "Sign in"}
        </Link>
        <Button>New</Button>
        {people.map((person) => (
          <div key={person.id}>{person.name}</div>
        ))}
      </main>
    </HydrateClient>
  );
}
