"use client";

import { Wand2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PolishButtonProps {
  onPolish: () => Promise<void>;
}

export function PolishButton({ onPolish }: PolishButtonProps) {
  const [isPolishing, setIsPolishing] = useState(false);

  return (
    <Button
      onClick={async () => {
        setIsPolishing(true);
        try {
          await onPolish();
        } finally {
          setIsPolishing(false);
        }
      }}
      style={{
        top: `calc(var(--visual-viewport-height) - 3rem)`,
      }}
      className="fixed right-2 z-[9999] transform gap-2"
      disabled={isPolishing}
    >
      <Wand2 size={16} className={cn({ "animate-spin": isPolishing })} />
      AI
    </Button>
  );
}
