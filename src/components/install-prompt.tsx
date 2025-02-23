"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PROMPT_STORAGE_KEY = "install-prompt-dismissed";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(PROMPT_STORAGE_KEY);
    if (dismissed) {
      setShowPrompt(false);
      return;
    }

    // @ts-expect-error navigator.standalone is not in the types
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handler = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem(PROMPT_STORAGE_KEY, "true");
  };

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  if (!showPrompt && !isIOS) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Install Personly</h3>
          {isIOS ? (
            <p className="text-sm text-gray-600">
              Tap the share button and select &quot;Add to Home Screen&quot; to
              install
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Install our app for the best experience
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isIOS && <Button onClick={handleInstall}>Install</Button>}
          <Button variant="ghost" size="icon" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
