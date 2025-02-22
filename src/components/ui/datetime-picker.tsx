"use client";

import { addDays, addMinutes, format } from "date-fns";
import {
  CalendarCheck,
  CalendarClock,
  CalendarCog,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import * as React from "react";
import type { DayPickerSingleProps } from "react-day-picker";
import { DayPicker, useNavigation } from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { TimePickerInput } from "./time-picker-input";

export type DatetimePickerProps = Omit<
  DayPickerSingleProps,
  "mode" | "onSelect"
> & {
  setDate: (date: Date) => void;
};

function DatetimePicker({
  className,
  classNames,
  showOutsideDays = true,
  setDate: setGlobalDate,
  ...props
}: DatetimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const { selected: selectedDate } = props as { selected?: Date };
  const setDate = (dateInput: Date) => {
    const date = new Date(dateInput);
    if (selectedDate) {
      date.setHours(selectedDate.getHours());
      date.setMinutes(selectedDate.getMinutes());
    }
    setGlobalDate(date);
  };
  const setTime = (dateInput: Date | undefined) => {
    if (!dateInput) {
      return;
    }
    const time = selectedDate ? new Date(selectedDate) : dateInput;
    time.setHours(dateInput.getHours());
    time.setMinutes(dateInput.getMinutes());
    setGlobalDate(time);
  };
  return (
    <>
      <DayPicker
        mode="single"
        selected={selectedDate}
        // @ts-expect-error ??? ?????????
        onSelect={setDate}
        showOutsideDays={showOutsideDays}
        className={cn("py-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          Footer: () => {
            const { goToDate } = useNavigation();
            return (
              <div>
                <hr className="mt-2" />
                <div className="-mx-2 mt-2">
                  <div>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-gray-700"
                      onClick={() => {
                        const chosenDate = new Date();
                        goToDate(chosenDate);
                        setDate(chosenDate);
                      }}
                    >
                      <div className="flex">
                        <CalendarCheck className="mr-2 size-5" />
                        Dzisiaj
                      </div>
                      <p className="text-sm font-normal text-gray-400">
                        {format(new Date(), "PPP")}
                      </p>
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-gray-700"
                      onClick={() => {
                        const chosenDate = addDays(new Date(), 1);

                        goToDate(chosenDate);
                        setDate(chosenDate);
                      }}
                    >
                      <div className="flex">
                        <CalendarCog className="mr-2 size-5" />
                        Jutro
                      </div>
                      <p className="text-sm font-normal text-gray-400">
                        {format(
                          new Date(Date.now() + 24 * 60 * 60 * 1000),
                          "PPP",
                        )}
                      </p>
                    </Button>
                  </div>
                  <div>
                    <div>
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-gray-700"
                        onClick={() => {
                          const chosenDate = addDays(new Date(), 7);

                          goToDate(chosenDate);
                          setDate(chosenDate);
                        }}
                      >
                        <div className="flex">
                          <CalendarClock className="mr-2 size-5" />
                          Za tydzień
                        </div>
                        <p className="text-sm font-normal text-gray-400">
                          {format(
                            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                            "PPP",
                          )}
                        </p>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
          IconLeft: () => <ChevronLeft className="size-4" />,
          IconRight: () => <ChevronRight className="size-4" />,
        }}
        {...props}
      />
      <hr className="my-0" />
      <div className="mt-4 flex justify-between px-2">
        <div className="flex items-center gap-2 text-gray-700">
          <Button
            onClick={() => {
              const chosenDate = new Date();

              setTime(addMinutes(chosenDate, 1));
            }}
            variant="ghost"
            className="gap-2"
          >
            Now
            <Clock className="size-5" />
          </Button>
        </div>
        <div className="font-medium">
          <div className="flex items-center gap-2">
            <TimePickerInput
              picker="hours"
              date={selectedDate}
              setDate={setTime}
              ref={hourRef}
              onRightFocus={() => minuteRef.current?.focus()}
            />
            <span>:</span>
            <TimePickerInput
              picker="minutes"
              date={selectedDate}
              setDate={setTime}
              ref={minuteRef}
              onLeftFocus={() => hourRef.current?.focus()}
            />
          </div>
        </div>
      </div>
    </>
  );
}

DatetimePicker.displayName = "DatetimePicker";

export { DatetimePicker };
