import type { MetaFunction } from "@remix-run/node";

export const withTitle: (title: string) => MetaFunction =
  (title: string) => () => ({
    title: `${title} - PM Station`,
  });
