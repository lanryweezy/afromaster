import { useState, useCallback } from 'react';

interface AsyncState<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
}

interface AsyncActions<T> {
  execute: (...args: unknown[]) => Promise<T | undefined>;
  reset: () => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (data: T | null) => void;
}

const useAsyncState = <T,>(asyncFunction: (...args: unknown[]) => Promise<T>): AsyncState<T> & AsyncActions<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: unknown[]) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { isLoading, error, data, execute, reset, setIsLoading, setError, setData };
};

export default useAsyncState;
