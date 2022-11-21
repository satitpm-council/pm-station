import { z } from "zod";

const Program = z.object({
  name: z.string(),
  driveId: z.string(),
  playlistsDriveId: z.string(),
});

export { Program };
