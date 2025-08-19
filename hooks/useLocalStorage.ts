import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for auto-saving form data
export function useAutoSave<T>(key: string, data: T, debounceMs: number = 1000) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined' && data !== null && data !== undefined) {
        try {
          window.localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
          console.error(`Error auto-saving to localStorage key "${key}":`, error);
        }
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [key, data, debounceMs]);
}

// Hook for session recovery
export function useSessionRecovery<T>(key: string, initialValue: T) {
  const [value, setValue] = useLocalStorage(key, initialValue);
  const [isRecovered, setIsRecovered] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const recovered = window.localStorage.getItem(key);
      if (recovered) {
        setIsRecovered(true);
      }
    }
  }, [key]);

  const clearSession = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
      setValue(initialValue);
      setIsRecovered(false);
    }
  };

  return { value, setValue, isRecovered, clearSession };
}
