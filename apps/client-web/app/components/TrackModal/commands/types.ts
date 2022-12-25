import type { SongRequestRecord } from "@station/shared/schema/types";

export type CommandAction = "addToPlaylist" | "removeFromPlaylist";

export type CommandActionHandler = (track: SongRequestRecord) => void;

export type CommandActionProps<T extends CommandAction | undefined> =
  T extends "removeFromPlaylist" ? { onAction: CommandActionHandler } : {};
