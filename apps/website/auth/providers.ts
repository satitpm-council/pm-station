import { env } from "@/env.mjs";
import GoogleProvider from "next-auth/providers/google";

export const providers = [
  GoogleProvider({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  }),
];

type Provider = (typeof providers)[number];

export type RenderedProvider = Pick<Provider, "id" | "name" | "style" | "type">;

export const renderProviders = (
  render: (props: RenderedProvider) => React.ReactNode
): React.ReactNode[] => {
  return providers.map(({ id, name, style, type }) =>
    render({ id, name, style, type })
  );
};
