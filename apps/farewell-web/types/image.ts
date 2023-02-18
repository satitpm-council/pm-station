import { drive_v3 } from "@googleapis/drive";

type ObjectNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

export type DriveImageFile = ObjectNonNullable<
  Pick<drive_v3.Schema$File, "id" | "name" | "createdTime" | "thumbnailLink">
> & {
  blurDataUrl: string;
};

export interface ImageFile {
  id: number;
  height: string;
  width: string;
  public_id: string;
  format: string;
  blurDataUrl?: string;
  driveId?: string;
}

export type ImageApiFile = Omit<ImageFile, "id">;
