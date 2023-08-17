import { env } from "@/env.mjs";
import KindeProvider from "./kinde/provider";

export const providers = [
  KindeProvider({
    clientId: env.KINDE_CLIENT_ID,
    clientSecret: env.KINDE_CLIENT_SECRET,
    issuer: env.KINDE_ISSUER_URL,
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
