import { NextApiHandler } from "next";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { createWebFetchRequest, sendWebFetchResponse } from "./web-fetch";

type HandlerFunction = LoaderFunction | ActionFunction;

/**
 * API config that disables body parsing for Next.js API routes.
 * This is necessary because Remix handles raw body.
 */
export const apiConfig = {
  api: {
    bodyParser: false,
  },
};

const asNextApiInternal = (handlerFn: HandlerFunction): NextApiHandler => {
  return async (req, res) => {
    const request = createWebFetchRequest(req, res);
    const response = await handlerFn({
      request,
      params: {},
      context: {},
    });
    await sendWebFetchResponse(res, response);
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
      return asNextApiInternal(actionFn)(req, res);
    } else if (loaderFn) {
      return asNextApiInternal(loaderFn)(req, res);
    } else {
      return res
        .status(405)
        .json({ success: false, error: "method-not-allowed" });
    }
  };
};
