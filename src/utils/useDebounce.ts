import { useState, useEffect } from 'react';

type debounceProps = {
  value: string,
  delay: number
}

export function useDebounce({value, delay}:debounceProps) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}