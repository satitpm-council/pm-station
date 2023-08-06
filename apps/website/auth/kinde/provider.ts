import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface KindeProfile extends Record<string, any> {
  sub: string;
  nickname: string;
  email: string;
  picture: string;
}

export default function KindeProvider<P extends KindeProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "kinde",
    name: "kinde",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    type: "oauth",
    authorization: { params: { scope: "openid email profile" } },
    checks: ["pkce", "state"],
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      } as any;
    },
    style: {
      logo: "",
      logoDark: "",
      bgDark: "#fff",
      bg: "#fff",
      text: "#000",
      textDark: "#000",
    },
    options,
  };
}
