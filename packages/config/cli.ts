// Importing the config directly will make the compiler
// check if the file exists and if the types are correct
import config from "../../app.config";
import { writeFile } from "fs/promises";
import { join } from "path";
import { rootDir } from "build-config";

type EnvValue = string | number | undefined;

const shouldPrefixPublic = (key: string): boolean => {
  return key.startsWith("FIREBASE") && !key.startsWith("FIREBASE_ADMIN");
};

const formatEnvKey = (...key: string[]) => {
  return key
    .map((k) => {
      const nextCaptial = k.match(/[A-Z]/)?.index;
      let value = k;
      if (shouldPrefixPublic(k)) {
        value = `NEXT_PUBLIC_${k}`;
      }
      if (nextCaptial && nextCaptial !== -1) {
        value = `${k.slice(0, nextCaptial)}_${k.slice(nextCaptial)}`;
      }
      return value.toUpperCase();
    })
    .join("_");
};

const flattenObject = (
  key: string,
  value?: EnvValue | Record<string, EnvValue>
): [string, string][] => {
  if (!value) return [];
  if (typeof value === "string") {
    return [[formatEnvKey(key), value.replace(/\n/g, "\\n")]];
  }
  return Object.entries(value).reduce(
    (acc, [nestedKey, nestedValue]) => [
      ...acc,
      ...flattenObject(formatEnvKey(key, nestedKey), nestedValue),
    ],
    [] as [string, string][]
  );
};

async function generate() {
  const entries = Object.entries(config)
    .map(([key, value]) => flattenObject(key, value))
    .flat(1);
  console.log(entries);
  let dotenvFile: string[] = [];
  let envDeclaration: string[] = [];
  for (const [key, value] of entries) {
    dotenvFile.push(`${key}=${value}`);
    envDeclaration.push(`    ${key}: string;`);
  }
  await writeFile(join(rootDir, ".env"), dotenvFile.join("\n"));
  await writeFile(
    join(rootDir, "env.d.ts"),
    [
      "declare namespace NodeJS {",
      "  interface ProcessEnv {",
      ...envDeclaration,
      "  }",
      "}",
      "",
    ].join("\n")
  );
}

generate().catch(console.error);
