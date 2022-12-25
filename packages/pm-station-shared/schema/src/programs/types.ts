import type { TypeOf } from "zod";
import type * as Schema from "./schema";

type Program = TypeOf<typeof Schema["Program"]>;

export type { Program };
