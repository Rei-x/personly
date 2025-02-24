"use client";

import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import React from "react";
import type { ReactNode } from "react";

import { InstallPrompt } from "@/components/install-prompt";
import { useVisualViewport } from "@/hooks/use-visual-viewport";
import { TRPCReactProvider } from "@/trpc/react";

// eslint-disable-next-line @typescript-eslint/promise-function-async
function ViewportProvider({ children }: { children: ReactNode }) {
  useVisualViewport();

  return children;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider>
      <TRPCReactProvider>
        <ViewportProvider>{children}</ViewportProvider>
        <InstallPrompt />
      </TRPCReactProvider>
    </ProgressProvider>
  );
}
