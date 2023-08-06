import { Suspense } from "react";
import { CSRFTokenField } from "@/auth/components";
import { renderProviders, RenderedProvider } from "@/auth/providers";
import Image from "next/image";
import styles from "./styles.module.css";

export type LoginProps = {
  callbackUrl?: string;
};

type LoginButtonProps = RenderedProvider & LoginProps;

const OAuthLoginButton = ({
  name,
  style,
  id,
  callbackUrl,
}: LoginButtonProps) => {
  const signinUrl = `/api/auth/signin/${id}`;
  const logos = "https://authjs.dev/img/providers";
  const imageSize = id === "line" ? 30 : 20;
  return (
    <form action={signinUrl} method="POST" className="w-full text-center">
      <Suspense fallback={null}>
        <CSRFTokenField />
      </Suspense>
      {callbackUrl && (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      )}
      <button
        type="submit"
        className={`${styles.button} w-full justify-center text-base font-medium`}
        style={
          {
            "--provider-bg": style?.bg ?? "",
            "--provider-dark-bg": style?.bgDark ?? "",
            "--provider-color": style?.text ?? "",
            "--provider-dark-color": style?.textDark ?? "",
          } as React.CSSProperties
        }
      >
        {style?.logo && (
          <Image
            loading="lazy"
            height={imageSize}
            width={imageSize}
            className={`dark:hidden`}
            src={`${style.logo.startsWith("/") ? logos : ""}${style.logo}`}
            alt={name}
          />
        )}
        {style?.logoDark && (
          <Image
            loading="lazy"
            height={imageSize}
            width={imageSize}
            className={`hidden dark:block`}
            src={`${style.logo.startsWith("/") ? logos : ""}${style.logoDark}`}
            alt={name}
          />
        )}
        <span>Sign In</span>
      </button>
    </form>
  );
};
export default function Providers(props: LoginProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {renderProviders((provider) => {
        if (provider.type === "oauth") {
          return (
            <OAuthLoginButton key={provider.id} {...provider} {...props} />
          );
        }
        return null;
      })}
    </div>
  );
}
