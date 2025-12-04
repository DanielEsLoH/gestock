import { useState, useEffect } from "react";

const usePersistentState = <T>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        try {
          return JSON.parse(storedValue) as T;
        } catch (_error) {
          return storedValue as T; // Fallback for non-JSON strings
        }
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState] as const;
};

export default usePersistentState;
