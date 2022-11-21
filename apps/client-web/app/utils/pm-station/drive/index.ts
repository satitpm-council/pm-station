import type { drive_v3 } from "@googleapis/drive";
import drive from "./gdrive.server";
import { and, inFolder, query } from "./query";

type RequiredNotNull<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type DriveFile = RequiredNotNull<
  Pick<
    drive_v3.Schema$File,
    "id" | "name" | "mimeType" | "createdTime" | "modifiedTime" | "ownedByMe"
  >
> & {
  appProperties?: {
    trackId?: string;
    youtubeId?: string;
  };
};
const fileFields: Array<keyof drive_v3.Schema$File> = [
  "id",
  "name",
  "mimeType",
  "createdTime",
  "modifiedTime",
  "appProperties",
  "ownedByMe",
];

type DriveFolder = Required<Pick<drive_v3.Schema$File, "id">>;
const folderFields: Array<keyof drive_v3.Schema$File> = ["id"];

export class DriveSync {
  // @ts-ignore
  _drive: drive_v3.Drive;
  /**
   * Initialize Drive Sync instance to sync between Firestore playlists tracks
   * and Google Drive media tracks.
   *
   * You must call `DriveSync.initialize()` after this constructor.
   * Otherwise requests will failed with an error.
   */
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {}

  async initialize() {
    if (!this._drive) {
      this._drive = await drive();
    }
  }
  private async createDateFolder(rootFolderId: string, date: string) {
    return (
      await this._drive.files.create({
        requestBody: {
          name: date,
          parents: [rootFolderId],
        },
        fields: folderFields.join(","),
      })
    ).data as DriveFolder;
  }
  private async getDateFolder(rootFolderId: string, date: string) {
    return (
      await this._drive.files.list({
        q: and(query("name", "=", `'${date}'`), inFolder(rootFolderId)),
        fields: `files(${folderFields.join(",")})`,
        pageSize: 1,
      })
    ).data.files?.[0] as DriveFolder | undefined;
  }
  private async listFilesFromFolder(folderId: string) {
    return (
      await this._drive.files.list({
        q: inFolder(folderId),
        fields: `files(${fileFields.join(",")})`,
      })
    ).data.files as DriveFile[];
  }

  async listFiles(rootFolderId: string, date: string) {
    const folder =
      (await this.getDateFolder(rootFolderId, date)) ??
      (await this.createDateFolder(rootFolderId, date));
    return this.listFilesFromFolder(folder.id as string);
  }
}
