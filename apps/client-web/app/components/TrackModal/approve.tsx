import type { TrackModalProps } from "./base";
import TrackModal, { useStableTrack } from "./base";
import dayjs from "~/utils/dayjs";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ListParams } from "~/utils/pm-station/songrequests";
import { defaults, options } from "~/utils/pm-station/songrequests";
import { useMatch } from "react-router";
import { updateDoc } from "@lemasc/swr-firestore";
import { useSafeParams } from "~/utils/params";
import { useSongRequestMutate } from "~/utils/pm-station/songrequests/hook";
import type { AddTrackMessage } from "~/utils/pm-station/playlists/channel";
import { ChannelName } from "~/utils/pm-station/playlists/channel";

export type ApproveTrackModalProps = Omit<TrackModalProps, "track"> & {
  track?: SongRequestRecord;
};

const RejectButton = ({ track }: { track?: SongRequestRecord }) => {
  const [params] = useSafeParams(defaults, options);
  const mutate = useSongRequestMutate(params);
  const [trackStatus, setTrackStatus] = useState<ListParams["filter"]>("idle");
  const toggleReject = useCallback(
    async (wasRejected: boolean) => {
      try {
        await updateDoc<SongRequestRecord>(
          `/songrequests/${track?.id}`,
          {
            lastPlayedAt: wasRejected ? null : new Date(0),
          },
          {
            ignoreLocalMutation: true,
          }
        );
        // mutate manually.
        mutate();
        setTrackStatus(wasRejected ? "idle" : "rejected");
      } catch (err) {
        console.error(err);
      }
    },
    [track?.id, mutate]
  );

  useEffect(
    () =>
      setTrackStatus(
        track?.lastPlayedAt
          ? track.lastPlayedAt.valueOf() === 0
            ? "rejected"
            : "played"
          : "idle"
      ),
    [track?.lastPlayedAt]
  );

  return (
    <button
      title={`${
        trackStatus === "rejected" ? "ยกเลิกการ" : ""
      }ปฎิเสธคำขอเพลงนี้`}
      className="bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 focus:outline-none"
      onClick={() => toggleReject(trackStatus === "rejected")}
    >
      {trackStatus === "rejected" ? "ยกเลิกการ" : ""}ปฏิเสธเพลงนี้
    </button>
  );
};

const AddTrackToPlaylist = ({ track }: { track?: SongRequestRecord }) => {
  const channel = useRef<BroadcastChannel>();

  useEffect(() => {
    channel.current = new BroadcastChannel(ChannelName);
    return () => channel.current?.close();
  }, []);

  const select = useCallback(() => {
    if (!track) return;
    const message: AddTrackMessage = {
      method: "add",
      track: { ...track, __snapshot: undefined } as SongRequestRecord,
    };
    channel.current?.postMessage(message);
  }, [track]);
  return (
    <button
      title="เลือกคำขอเพลงนี้"
      className="bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 focus:outline-none"
      onClick={() => select()}
    >
      เลือกเพลงนี้
    </button>
  );
};
const Commands = ({ track }: { track?: SongRequestRecord }) => {
  const matches = useMatch(
    "/pm-station/app/songrequests/editor/playlists/selectSong"
  );

  return (
    <div className="flex flex-row gap-4 justify-center pt-4 text-sm">
      {matches && <AddTrackToPlaylist track={track} />}
      <RejectButton />
    </div>
  );
};
export const ApproveTrackModal = (props: ApproveTrackModalProps) => {
  const stableTrack = useStableTrack(props.track);
  const [params] = useSafeParams(defaults, options);

  const { track, closeModal } = stableTrack;
  const copyId = useCallback(() => {
    navigator.clipboard.writeText(`/songrequests/${track?.id}`);
  }, [track]);

  useEffect(() => {
    closeModal();
  }, [params.filter, closeModal]);

  return (
    <TrackModal
      className="text-sm flex flex-col gap-1"
      {...props}
      {...stableTrack}
    >
      <span onClick={copyId}>ID: {track?.id}</span>
      <span>คนส่งคำขอทั้งหมด {track?.submissionCount} คน</span>
      <span>
        เปลี่ยนแปลงล่าสุดเมื่อ {dayjs(track?.lastUpdatedAt).format("LLL น.")}
      </span>
      {track?.lastPlayedAt && track.lastPlayedAt.valueOf() > 0 ? (
        <span>เปิดล่าสุดเมื่อ {dayjs(track?.lastPlayedAt).format("LL")}</span>
      ) : (
        <Commands track={track} />
      )}
    </TrackModal>
  );
};
