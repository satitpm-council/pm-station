type ObjectAsString<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
};

export const getFormData = async <T extends Record<string, unknown>>(
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
