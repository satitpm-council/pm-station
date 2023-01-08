import { NextApiRequest, NextApiResponse } from "next";
import type {
  RequestInit as NodeRequestInit,
  Response as NodeResponse,
} from "@remix-run/node";

import {
  AbortController as NodeAbortController,
  Headers as NodeHeaders,
  Request as NodeRequest,
  writeReadableStreamToWritable,
} from "@remix-run/node";

export function createWebFetchRequest(
  req: NextApiRequest,
  res: NextApiResponse
): NodeRequest {
  let host = req.headers["x-forwarded-host"] || req.headers["host"];
  // doesn't seem to be available on their req object!
  let protocol = req.headers["x-forwarded-proto"] || "https";
  let url = new URL(req.url!, `${protocol}://${host}`);

  // Abort action/loaders once we can no longer write a response
  let controller = new NodeAbortController();
  res.on("close", () => controller.abort());

  let init: NodeRequestInit = {
    method: req.method,
    headers: createHeaders(req.headers),
    // Cast until reason/throwIfAborted added
    // https://github.com/mysticatea/abort-controller/issues/36
    signal: controller.signal as NodeRequestInit["signal"],
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req;
  }

  return new NodeRequest(url.href, init);
}

export function createHeaders(
  requestHeaders: NextApiRequest["headers"]
): NodeHeaders {
  let headers = new NodeHeaders();

  for (let key in requestHeaders) {
    let header = requestHeaders[key]!;
    // set-cookie is an array (maybe others)
    if (Array.isArray(header)) {
      for (let value of header) {
        headers.append(key, value);
      }
    } else {
      headers.append(key, header);
    }
  }

  return headers;
}

const getRawHeaderKeys = (headers: Headers) => {
  return Object.fromEntries(headers.entries());
};

export async function sendWebFetchResponse(
  res: NextApiResponse,
  nodeResponse: NodeResponse
): Promise<void> {
  res.statusMessage = nodeResponse.statusText;
  const headers = nodeResponse.headers;
  let multiValueHeaders = getRawHeaderKeys(headers);
  res.writeHead(
    nodeResponse.status,
    nodeResponse.statusText,
    multiValueHeaders
  );

  if (nodeResponse.body) {
    await writeReadableStreamToWritable(nodeResponse.body, res);
  } else {
    res.end();
  }
}
