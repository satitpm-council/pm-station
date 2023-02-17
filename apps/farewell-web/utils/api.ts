import admin from "./firebase-admin";
import type { NextApiHandler } from "next";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";

declare module "next" {
  export interface NextApiRequest {
    token: DecodedIdToken;
  }
}

export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Authorization, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false });
    }
    const auth = getAuth(admin);
    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(token);
      if (!decodedToken || !decodedToken.uid)
        return res.status(401).json({ success: false });
      req.token = decodedToken;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false });
    }
    return handler(req, res);
  };
}
