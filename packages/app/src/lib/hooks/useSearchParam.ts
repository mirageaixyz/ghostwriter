import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

export function useSearchParam(
  key: string
): [string | undefined, (state: string | undefined) => void];
export function useSearchParam<T extends z.ZodTypeAny>(
  key: string,
  coerce: T
): [z.infer<T>, (state: z.infer<T>) => void];
export function useSearchParam(key: string, coerce?: z.ZodTypeAny) {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    const value = searchParams.get(key);
    if (coerce) {
      return coerce.parse(value);
    }
    return value ?? undefined;
  }, [searchParams, key]);

  const setState = useCallback(
    (newValue: any) => {
      setSearchParams((searchParams) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (newValue === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, newValue);
        }
        return newSearchParams;
      });
    },
    [setSearchParams, key]
  );

  return [state, setState];
}
