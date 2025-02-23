/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { Period, TimePickerType } from "./time-picker-utils";
import {
  getArrowByType,
  getDateByType,
  setDateByType,
} from "./time-picker-utils";

export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  period?: Period;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  TimePickerInputProps
>(
  (
    {
      className,
      type = "tel",
      value,
      id,
      name,
      date = new Date(new Date().setHours(0, 0, 0, 0)),
      setDate,
      onChange,
      onKeyDown,
      picker,
      period,
      onLeftFocus,
      onRightFocus,
      ...props
    },
    ref,
  ) => {
    const [flag, setFlag] = React.useState<boolean>(false);
    const [previousIntKey, setPreviousIntKey] = React.useState<string>("0");

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    React.useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false);
        }, 2000);

        return () => {
          clearTimeout(timer);
        };
      }
    }, [flag]);

    const calculatedValue = React.useMemo(() => {
      return getDateByType(date, picker);
    }, [date, picker]);

    const calculateNewValue = (key: string) => {
      /*
       * If picker is '12hours' and the first digit is 0, then the second digit is automatically set to 1.
       * The second entered digit will break the condition and the value will be set to 10-12.
       */
      if (
        picker === "12hours" &&
        flag &&
        calculatedValue.slice(1, 2) === "1" &&
        previousIntKey === "0"
      ) {
        return `0${key}`;
      }

      return flag ? calculatedValue.slice(1, 2) + key : `0${key}`;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Tab") {
        return;
      }
      event.preventDefault();
      if (event.key === "ArrowRight") {
        onRightFocus?.();
      }
      if (event.key === "ArrowLeft") {
        onLeftFocus?.();
      }
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        const step = event.key === "ArrowUp" ? 1 : -1;
        const newValue = getArrowByType(calculatedValue, step, picker);
        if (flag) {
          setFlag(false);
        }
        const temporaryDate = new Date(date);
        setDate(setDateByType(temporaryDate, newValue, picker, period));
      }
      if (event.key >= "0" && event.key <= "9") {
        if (picker === "12hours") {
          setPreviousIntKey(event.key);
        }

        const newValue = calculateNewValue(event.key);
        if (flag) {
          onRightFocus?.();
        }
        setFlag((previous) => !previous);
        const temporaryDate = new Date(date);
        setDate(setDateByType(temporaryDate, newValue, picker, period));
      }
    };

    return (
      <Input
        ref={ref}
        id={id || picker}
        name={name || picker}
        className={cn(
          "w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
        value={value || calculatedValue}
        onChange={(event) => {
          event.preventDefault();
          onChange?.(event);
        }}
        type={type}
        inputMode="decimal"
        onKeyDown={(event) => {
          onKeyDown?.(event);
          handleKeyDown(event);
        }}
        {...props}
      />
    );
  },
);

TimePickerInput.displayName = "TimePickerInput";

export { TimePickerInput };
