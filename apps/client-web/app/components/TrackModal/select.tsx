import { useSubmit, useTransition } from "@remix-run/react";
import { useCallback } from "react";
import { useAuthenticityToken } from "remix-utils";
import { toFormData } from "~/utils/api";
import type { SelectTrackAction } from "~/utils/pm-station/api-types";
import { SubmitButton } from "../SubmitButton";
import type { TrackModalProps } from "./base";
import TrackModal, { useStableTrack } from "./base";

export const SelectTrackModal = (props: TrackModalProps) => {
  const token = useAuthenticityToken();
  const submit = useSubmit();
  const transition = useTransition();

  const stableTrack = useStableTrack(props.track);
  const { track } = stableTrack;
  const selectTrack = useCallback(async () => {
    if (!token || !track) return;
    try {
      submit(
        toFormData<SelectTrackAction>({
          sessionToken: token,
          trackId: track.id,
        }),
        {
          action: "/pm-station/app/songrequests/select",
          method: "post",
        }
      );
    } catch (err) {
      console.error(err);
    }
  }, [token, submit, track]);

  return (
    <TrackModal {...props} {...stableTrack}>
      <SubmitButton
        onClick={selectTrack}
        loading={transition.state === "submitting"}
      >
        เลือกเพลงนี้
      </SubmitButton>
    </TrackModal>
  );
};
