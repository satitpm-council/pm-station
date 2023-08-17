import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // NextAuth
    NEXTAUTH_URL: z.string().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    // Vercel KV
    KV_REST_API_URL: z.string().url(),
    KV_REST_API_TOKEN: z.string().min(1),
    /// Google (Login)
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    // Xata
    XATA_API_KEY: z.string().min(1),
    XATA_BRANCH: z.string().min(1),
    // Spotify
    SPOTIFY_CLIENT_ID: z.string().min(1),
    SPOTIFY_CLIENT_SECRET: z.string().min(1),
  },
  experimental__runtimeEnv: {},
});
