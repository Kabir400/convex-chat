import { useState, useEffect } from "react";

/**
 * Delays updating the returned value until `delay` ms have passed
 * without `value` changing — great for search inputs.
 *
 * @param value  The value to debounce.
 * @param delay  Milliseconds to wait (default 300).
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
