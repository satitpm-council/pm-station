import Image from "next/image";

export const Thumbnail = ({
  src,
  alt,
  blurDataURL,
}: {
  alt: string;
  blurDataURL: string;
  src?: string;
}) => {
  return (
    <Image
      src={src ?? blurDataURL}
      alt={alt}
      placeholder="blur"
      blurDataURL={blurDataURL}
      width={720}
      height={480}
      className={`rounded ${
        src
          ? "transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
          : "blur-sm"
      }`}
      sizes="(max-width: 640px) 100vw,
        (max-width: 1280px) 50vw,
        (max-width: 1536px) 33vw,
        25vw"
    />
  );
};
