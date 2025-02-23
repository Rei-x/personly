"use client";

// eslint-disable-next-line import/named
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { FileEditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";

interface SwipeableEventProps {
  event: {
    id: string;
    name: string;
    updatedAt: Date;
  };
  personId: string;
}

export function SwipeableEvent({ event, personId }: SwipeableEventProps) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const deleteEvent = api.person.deleteEvent.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const [{ x }, springApi] = useSpring(() => ({
    x: 0,
    config: { tension: 50, friction: 10 },
  }));

  const [isDragging, setIsDragging] = useState(false);

  const bind = useDrag(
    ({ down, movement: [mx], first, last }) => {
      if (first) {
        setIsDragging(true);
      }
      if (last) {
        setTimeout(() => {
          setIsDragging(false);
        }, 50);
      }

      const isSwipingLeft = mx < 0;

      if (!isSwipingLeft) {
        void springApi.start({ x: 0 });
        return;
      }

      // Match delete button width
      const newX = Math.max(-80, mx);
      void springApi.start({ x: down ? newX : newX < -40 ? -80 : 0 });
    },
    { axis: "x", filterTaps: true },
  );

  const handleDelete = () => {
    setLeaving(true);
    deleteEvent.mutate({ id: event.id });
  };

  return (
    <motion.div
      initial={false}
      animate={{ height: leaving ? 0 : "auto", opacity: leaving ? 0 : 1 }}
      transition={{ type: "spring" }}
    >
      <div className="relative overflow-hidden rounded-md">
        {/* Delete button */}
        <div className="absolute inset-y-0 right-0 flex">
          <button
            onClick={handleDelete}
            className="w-20 bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2Icon size={20} className="mx-auto" />
          </button>
        </div>

        {/* Main content */}
        <animated.div
          {...bind()}
          style={{ x }}
          className="relative touch-pan-y"
        >
          <Link
            href={`/person/${personId}/note/${event.id}`}
            className={`block ${isDragging ? "pointer-events-none" : ""}`}
          >
            <div className="flex w-full items-center justify-between rounded-md border bg-background p-4">
              <div className="flex items-center gap-2">
                <FileEditIcon size={16} />
                {event.name}
              </div>
              <time className="text-sm text-muted-foreground">
                {formatDistanceToNow(event.updatedAt, { addSuffix: true })}
              </time>
            </div>
          </Link>
        </animated.div>
      </div>
    </motion.div>
  );
}
