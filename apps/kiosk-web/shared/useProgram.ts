import { FetchHookOptions, useDocument } from "@lemasc/swr-firestore";
import { TypeOf } from "zod";
import { Program } from "@station/shared/schema";
import { zodValidator } from "shared/utils";
import { SWRConfiguration } from "swr";

export const useProgram = (
  programId?: string,
  config: FetchHookOptions<TypeOf<typeof Program>> & SWRConfiguration = {}
) => {
  return useDocument<TypeOf<typeof Program>>(
    programId ? `programs/${programId}` : null,
    {
      ...config,
      validator: zodValidator(Program),
    }
  );
};
