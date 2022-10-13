import { useSearchParams } from "@remix-run/react";
import { useCallback, useMemo } from "react";

export type VisibleOptions<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends string ? Partial<Record<T[K], string>> : T[K];
};

const filterParams = <T extends Record<string, any>>(
  defaults: T,
  options: VisibleOptions<T>,
  entries: IterableIterator<[any, any]>
): Partial<T> => {
  const input = entries as IterableIterator<[keyof T, string]>;
  let result = {} as Record<keyof T, unknown>;
  for (const [key, value] of input) {
    const _default = defaults[key];
    const option = options[key];
    if (_default && option) {
      if (typeof option === "number") {
        result[key] = parseInt(value);
        result[key] = isNaN(result[key] as number) ? undefined : result[key];
      } else {
        result[key] = Object.keys(option).includes(value) ? value : undefined;
      }
    }
  }
  return result as Partial<T>;
};

/**
 * Returns searchParams that are safe at build-time and run-time.
 * @param defaults - Default values for each searchParams.
 * @param options - Allowed options visible to the end user.
 */
export const useSafeParams = <T extends Record<string, unknown>>(
  defaults: T,
  options: VisibleOptions<T>
): [T, (entries: IterableIterator<[any, any]>) => void] => {
  const [params, setParams] = useSearchParams();

  const safeParams = useMemo(
    () =>
      Object.assign(
        defaults,
        filterParams(defaults, options, params.entries())
      ),
    [params, defaults, options]
  );

  const setSafeParams = useCallback(
    (entries: IterableIterator<[any, any]>) => {
      setParams(Object.entries(filterParams(defaults, options, entries)), {
        replace: true,
      });
    },
    [defaults, options, setParams]
  );

  return [safeParams, setSafeParams];
};
