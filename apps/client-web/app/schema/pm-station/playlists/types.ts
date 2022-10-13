import type { z } from "zod";
import type * as Schema from "./schema";

type PlaylistRecord = z.infer<typeof Schema["PlaylistRecord"]>;

export type { PlaylistRecord };
