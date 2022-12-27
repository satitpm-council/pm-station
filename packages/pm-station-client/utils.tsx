export const classNames = (
  ...className: Array<string | 0 | boolean | null | undefined>
) => className.filter(Boolean).join(" ");
