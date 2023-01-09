import { redirect } from "next/navigation";
import type { DataFunctionArgs, TypedResponse } from "@remix-run/node";
import type { RequestInit as NodeRequestInit } from "@remix-run/node";
import {
  Request as NodeRequest,
  Headers as NodeHeaders,
} from "@remix-run/node";

function createHeaders(headers: Headers) {
  // Next.js headers keys are all lower case.
  // We need to convert the keys to camel case so that they match the Remix headers.
  const nodeHeaders = new NodeHeaders();
  headers.forEach((value, key) => {
    const camelCaseKey = key
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("-");
    nodeHeaders.set(camelCaseKey, value);
  });
  return nodeHeaders;
}

export function createWebFetchRequest(
  url: string,
  headers: Headers
): NodeRequest {
  let host = headers.get("x-forwarded-host") || headers.get("host");
  // doesn't seem to be available on their req object!
  let protocol = host?.includes("localhost") ? "http" : "https";
  let _url = new URL(url!, `${protocol}://${host}`);

  let init: NodeRequestInit = {
    method: "GET",
    headers: createHeaders(headers),
  };

  return new NodeRequest(_url.href, init);
}
