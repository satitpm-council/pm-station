"use client";

import { useCallback } from "react";
import { SubmitButton } from "@station/client/SubmitButton";
import { TrackModal } from "@/components/client";

export const SelectTrackModal = () => {
  const selectTrack = useCallback(async () => {
    // TODO: This should be implement as a server action.
  }, []);

  return (
    <TrackModal>
      <SubmitButton testId="select-track" onClick={selectTrack} loading={false}>
        เลือกเพลงนี้
      </SubmitButton>
    </TrackModal>
  );
};
