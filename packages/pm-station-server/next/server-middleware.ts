import { redirect } from "next/navigation";
import type { DataFunctionArgs, TypedResponse } from "@remix-run/node";
import type { RequestInit as NodeRequestInit } from "@remix-run/node";
import { Request as NodeRequest } from "@remix-run/node";

function createWebFetchRequest(url: string, headers: Headers): NodeRequest {
  let host = headers.get("x-forwarded-host") || headers.get("host");
  // doesn't seem to be available on their req object!
  let protocol = headers.get("x-forwarded-host") || "https";
  let _url = new URL(url!, `${protocol}://${host}`);

  let init: NodeRequestInit = {
    method: "GET",
    headers: headers,
  };

  return new NodeRequest(_url.href, init);
}

const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);
function isRedirectResponse(response: Response) {
  return redirectStatusCodes.has(response.status);
}

/**
 * Wrapper function that converts the Remix `LoaderFunction`
 * to a function that is compatible with Next.js Server environment.
 *
 * @param url The URL of the request
 * @param headers The headers returned from Next.js `headers` function. Must imported manually or Next.js will throw an error.
 * @param handlerFn The Remix `LoaderFunction` to be called
 */
export const asServerMiddleware = async <T>(
  url: string,
  headers: Headers,
  handlerFn: (args: DataFunctionArgs) => Promise<TypedResponse<T>>
): Promise<T> => {
  const request = createWebFetchRequest(url, headers);
  const response = (await handlerFn({
    request,
    params: {},
    context: {},
  })) as Response;

  let body;

  if (response.headers.get("content-type")?.startsWith("application/json")) {
    body = response.json();
  } else {
    body = response.text();
  }
  const location = response.headers.get("location");
  if (location && isRedirectResponse(response)) {
    // get all other headers that the handler may set
    const hasOtherHeaders = Array.from(response.headers.entries()).some(
      ([key]) => !["location", "content-type"].includes(key)
    );
    if (hasOtherHeaders) {
      console.warn(
        "warning: Next Server API does not support setting extra headers on redirects."
      );
    }
    redirect(location);
  }
  return body;
};
