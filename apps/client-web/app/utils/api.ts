export const getFormData = async <T extends Record<string, string>>(
  request: Request
) => Object.fromEntries(await request.formData()) as Partial<T>;

type Falsy = false | 0 | "" | null | undefined;

type AllowFalsyValue<T extends Record<string, string>> = {
  [K in keyof T]: string | Falsy;
};

export const toFormData = <T extends Record<string, string>>(
  data: AllowFalsyValue<T>
): FormData => {
  const form = new FormData();
  for (let key in data) {
    if (data[key]) {
      form.set(key, data[key] as string);
    }
  }
  return form;
};
