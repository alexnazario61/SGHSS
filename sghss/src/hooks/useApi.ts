import { useState, useCallback } from 'react';

/**
 * Hook para facilitar o tratamento de loading states e erros em requisições API
 */
function useApi<T, P extends any[]>(
  apiCall: (...args: P) => Promise<T>,
  initialData?: T
) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: P) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Ocorreu um erro desconhecido');
        setError(errorObj);
        throw errorObj;
      } finally {
        setLoading(false);
      }
    },
    [apiCall]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData
  };
}

export default useApi;