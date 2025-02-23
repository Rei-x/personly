"use client";

import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import React from "react";
import type { ReactNode } from "react";

import { InstallPrompt } from "@/components/install-prompt";
import { TRPCReactProvider } from "@/trpc/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider>
      <TRPCReactProvider>
        {children}
        <InstallPrompt />
      </TRPCReactProvider>
    </ProgressProvider>
  );
}
