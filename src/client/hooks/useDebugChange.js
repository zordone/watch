import { useRef } from "react";

// hook to help debugging prop or state changes
export const useDebugChange = (values, title = "useDebugChange") => {
  const prevValuesRef = useRef({});

  const keys = Object.keys({ ...values, ...prevValuesRef.current });

  const changes = keys
    .map((key) => {
      const prevValue = prevValuesRef.current[key];
      const currentValue = values[key];
      if (prevValue !== currentValue) {
        return [key, prevValue, "->", currentValue];
      }
    })
    .filter(Boolean);

  if (changes.length) {
    console.group(title);
    changes.forEach((change) => console.log(...change));
    console.groupEnd();
  }

  prevValuesRef.current = values;
};
