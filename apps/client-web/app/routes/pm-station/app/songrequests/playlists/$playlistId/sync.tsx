import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "@remix-run/react";
import { useCallback, useState } from "react";
import { PageHeader } from "~/components/Header";
import { ViewTrackModal } from "~/components/TrackModal";
import axios from "~/utils/axios";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import { withTitle } from "~/utils/pm-station/client";
import type { DeletePlaylistAction } from "~/utils/pm-station/api-types";
import { usePlaylistWithDriveSync } from "~/utils/pm-station/drive/sync";
import { TrackMeta } from "~/components/SongRequest/base";

export const meta = withTitle("ดูรายการเพลง");

export default function ViewPlaylist() {
  const { playlist, tracks, uncategorized } = usePlaylistWithDriveSync();
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState<SongRequestRecord>();
  return (
    <>
      <ViewTrackModal
        track={selectedTrack}
        onClose={() => setSelectedTrack(undefined)}
      />
      <PageHeader title={`ดูข้อมูลรายการเพลง`}></PageHeader>
      <h1>Sync</h1>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="border-b border-gray-500">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium px-6 py-4 text-left"
                    >
                      เพลง
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium px-6 py-4 text-left"
                    >
                      เชื่อมต่อกับไฟล์
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tracks?.map((v, i) => (
                    <tr className="border-b" key={v.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-row gap-4">
                          <div className="flex-shrink-0 hidden sm:block">
                            <img
                              src={v.albumImage.url}
                              width={60}
                              height={60}
                              draggable={false}
                              className="rounded"
                              alt={v.name}
                            />
                          </div>
                          <div className="flex flex-col max-w-[250px] lg:max-w-[40vw]">
                            <TrackMeta track={v} />
                          </div>
                        </div>
                      </td>
                      <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                        {uncategorized ? (
                          <div className="flex flex-col gap-2 max-w-[250px] lg:max-w-[40vw]">
                            <b className="truncate font-medium">
                              {uncategorized?.[i].name}
                            </b>
                            <span>
                              {uncategorized?.[i].ownedByMe
                                ? "อัพโหลดโดยระบบ"
                                : "อัพโหลดโดยผู้ใช้"}
                            </span>
                          </div>
                        ) : (
                          "Unsynced"
                        )}
                      </td>
                      <td>แก้ไข</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
