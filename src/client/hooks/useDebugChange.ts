import { useRef } from "react";
import { isTruthy } from "@client/service/utils";

type Values = Record<string, unknown>;

// logs debug info about prop or state changes
export const useDebugChange = (values: Values, title = "useDebugChange") => {
  const prevValuesRef = useRef<Values>({});

  const keys = Object.keys({ ...values, ...prevValuesRef.current });

  const changes: unknown[][] = keys
    .map((key) => {
      const prevValue = prevValuesRef.current[key];
      const currentValue = values[key];
      if (prevValue !== currentValue) {
        return [key, prevValue, "->", currentValue];
      }
      return undefined;
    })
    .filter(isTruthy);

  if (changes.length) {
    console.group(title);
    changes.forEach((change) => console.log(...change));
    console.groupEnd();
  }

  prevValuesRef.current = values;
};
