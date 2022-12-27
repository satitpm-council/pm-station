// In Remix, FormData is a main type of transmitting data on HTTP requests.
// useSubmit is prefered over normal HTTP fetch, so utility functions are created
// to preserve JSON-like DX.

type ObjectAsString<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
};

export const getFormData = async <T extends Record<any, any>>(
  request: Request
) =>
  Object.fromEntries(await request.clone().formData()) as Partial<
    ObjectAsString<T>
  >;

type Falsy = false | 0 | "" | null | undefined;

type AllowFalsyValue<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] | Falsy;
};

export const toFormData = <T extends Record<string, any>>(
  data: AllowFalsyValue<T>
): FormData => {
  const form = new FormData();
  for (let key in data) {
    if (data[key]) {
      form.set(key, String(data[key]));
    }
  }
  return form;
};
