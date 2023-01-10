import { useCallback, useState } from "react";
import { SubmitButton } from "@station/client/SubmitButton";
import axios from "shared/axios";
import type { MusicInfo } from "~/utils/pm-station/ytmusic/types";

const YOUTUBE_REGEX =
  /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;

export const EditMusic = ({
  setCustomResult,
}: {
  setCustomResult: (result: MusicInfo) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(e.currentTarget);
      const form = new FormData(e.currentTarget);
      const url = form.get("url") as string;
      const match = url.match(YOUTUBE_REGEX);
      if (match?.[1]) {
        setLoading(true);
        // Fetch music info on the '/pm-station/app/songrequests/stream/getInfo' endpoint
        try {
          const { data } = await axios.get<{ data: MusicInfo }>(
            "/pm-station/app/songrequests/stream/getInfo",
            {
              params: {
                v: match[1],
              },
            }
          );
          if (data?.data) setCustomResult(data.data);
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      }
    },
    [setCustomResult]
  );

  return (
    <>
      <b>แก้ไข Youtube URL</b>
      <form onSubmit={onSubmit} className="flex gap-2 text-sm py-2">
        <input
          name="url"
          type="text"
          required
          className="pm-station-input"
          pattern={YOUTUBE_REGEX.source}
        />
        <SubmitButton loading={loading}>บันทึก</SubmitButton>
      </form>
    </>
  );
};
