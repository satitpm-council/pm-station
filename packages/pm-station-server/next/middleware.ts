import { NextApiHandler, NextApiRequest } from "next";
import { writeReadableStreamToWritable } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { createRemixRequest } from "@remix-run/express/dist/server";

type ApiMiddleware = (handler: NextApiHandler) => NextApiHandler;

type HandlerFunction = LoaderFunction | ActionFunction;

const asNextApiInternal = (handlerFn: HandlerFunction): NextApiHandler => {
  return async (req, res) => {
    const customReq = req as NextApiRequest & {
      get: (key: string) => string | string[] | undefined;
    };
    // to provide compatibility with express
    customReq.get = (key: string) => req.headers[key];

    const request = createRemixRequest(req as any, res as any);
    const response = (await handlerFn({
      request,
      params: {},
      context: {},
    })) as Response;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.statusMessage = response.statusText;
    res.status(response.status ?? 200);

    if (response.body) {
      writeReadableStreamToWritable(response.body, res);
    } else {
      res.end();
    }
  };
};

/**
 * Wrapper function that converts the Remix `LoaderFunction` and `ActionFunction`
 * to a `NextApiHandler` function that can be use as an API route.
 */
export const asNextApi = (
  loaderFn: LoaderFunction | null,
  actionFn?: ActionFunction | null
): NextApiHandler => {
  return (req, res) => {
    if (req.method !== "GET" && actionFn) {
      return asNextApiInternal(actionFn);
    } else if (loaderFn) {
      return asNextApiInternal(loaderFn);
    } else {
      return res
        .status(405)
        .json({ success: false, error: "method-not-allowed" });
    }
  };
};
