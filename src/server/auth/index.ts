import NextAuth from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";

import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

const requireAuth = async () => {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return session;
};

export { auth, handlers, requireAuth, signIn, signOut };
