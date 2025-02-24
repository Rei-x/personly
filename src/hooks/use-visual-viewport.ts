"use client";

import { useEffect, useState } from "react";

interface ViewportState {
  height: number;
  width: number;
  scale: number;
  offsetTop: number;
}

export function useVisualViewport(): ViewportState | null {
  const [viewport, setViewport] = useState<ViewportState | null>(null);

  useEffect(() => {
    const visualViewport = window.visualViewport;

    if (!visualViewport) {
      return;
    }

    const handleResize = () => {
      const newState = {
        height: visualViewport.height,
        width: visualViewport.width,
        scale: visualViewport.scale,
        offsetTop: visualViewport.offsetTop,
      };

      document.documentElement.style.setProperty(
        "--visual-viewport-height",
        `${newState.height}px`,
      );

      setViewport(newState);
    };

    handleResize();
    visualViewport.addEventListener("resize", handleResize);
    visualViewport.addEventListener("scroll", handleResize);

    return () => {
      visualViewport.removeEventListener("resize", handleResize);
      visualViewport.removeEventListener("scroll", handleResize);
    };
  }, []);

  return viewport;
}
