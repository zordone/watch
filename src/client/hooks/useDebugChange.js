import { useRef } from "react";

export const useDebugChange = (values) => {
  const prevValuesRef = useRef({});

  const keys = Object.keys({ ...values, ...prevValuesRef.current });

  const changes = keys
    .map((key) => {
      const prevValue = prevValuesRef.current[key];
      const currentValue = values[key];
      if (prevValue !== currentValue) {
        return `  ${key}`;
      }
    })
    .filter(Boolean);
  if (changes.length) {
    console.log("useDebugChange:", changes.join(", "));
  }
  prevValuesRef.current = values;
};
