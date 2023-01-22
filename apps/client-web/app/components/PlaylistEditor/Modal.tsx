import { Dialog } from "@headlessui/react";
import { isDocumentValid } from "@lemasc/swr-firestore";
import { useNavigate } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import shallow from "zustand/shallow";
import axios from "shared/axios";
import type { SetPlaylistAction } from "@station/shared/schema/types";
import type { ActionResponse } from "@station/shared/api";
import { usePrograms } from "~/utils/pm-station/programs";

import Modal from "../Modal";
import { SubmitButton } from "@station/client/SubmitButton";
import { playlistEditorStore } from "./store";
import { useFirebaseUser } from "@station/client/firebase";
import dayjs from "dayjs";

type FormValues = Pick<SetPlaylistAction, "target" | "queuedDate">;
export default function ConfirmPlaylistModal() {
  const user = useFirebaseUser();
  const { data: programs } = usePrograms();
  const { count, duration } = playlistEditorStore(
    ({ count, duration }) => ({ count, duration }),
    shallow
  );
  const isOpen = playlistEditorStore((s) => s.showModal);

  const closeModal = useCallback(() => {
    playlistEditorStore.setState({ showModal: false });
  }, []);

  const [isSubmitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const navigate = useNavigate();

  const submit = useCallback(
    async (form: FormValues) => {
      if (!user) return;
      try {
        setSubmitting(true);
        const { data, reset } = playlistEditorStore.getState();
        await axios.post<ActionResponse, any, SetPlaylistAction>(
          "/pm-station/app/songrequests/playlists/set",
          {
            ...form,
            tracks: data.map(({ id }) => id),
            playlistId: playlistEditorStore.getState().targetPlaylist?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          }
        );
        reset();
        navigate("/pm-station/app/songrequests/playlists");
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
    [navigate, user]
  );

  useEffect(() => {
    return playlistEditorStore.subscribe(
      ({ targetPlaylist, showModal }) => ({ targetPlaylist, showModal }),
      ({ showModal, targetPlaylist }) => {
        if (!showModal) return;
        if (targetPlaylist) {
          const { target, queuedDate } = targetPlaylist;
          reset({
            target,
            queuedDate: queuedDate.toISOString().split("T")[0],
          });
        } else {
          reset({
            target: undefined,
            queuedDate: undefined,
          });
        }
      }
    );
  }, [reset]);

  const minDate = useMemo(() => {
    let date = dayjs();
    if (date.hour() >= 7) date = date.add(1, "day");
    return date.format("YYYY-MM-DD");
  }, []);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className="flex flex-col gap-6 w-full justify-center">
        <div className="flex flex-col gap-2">
          <Dialog.Title as="h3" className="text-2xl font-bold">
            ยืนยันรายการเพลง
          </Dialog.Title>
          <Dialog.Description className="text-sm">
            รายการเพลงทั้งหมด {count} เพลง ระยะเวลา {duration}
          </Dialog.Description>
        </div>
        <form
          onSubmit={handleSubmit(submit)}
          autoComplete="off"
          method="post"
          className="space-y-6 text-sm"
        >
          <div className="grid sm:grid-cols-[max-content_1fr] text-left items-center gap-4">
            <label htmlFor="target" className="font-bold">
              รายการ:
            </label>
            <select
              className="pm-station-input"
              required
              {...register("target")}
            >
              <option>กรุณาเลือก</option>
              {programs?.filter(isDocumentValid).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            <label htmlFor="queuedDate" className="font-bold">
              วันที่เปิดรายการเพลง:
            </label>
            <input
              type="date"
              disabled={isSubmitting}
              className="pm-station-input"
              autoComplete="off"
              title="วันที่เปิดรายการเพลง"
              required
              min={minDate}
              pattern="\d{4}-\d{2}-\d{2}"
              {...register("queuedDate", {
                valueAsDate: true,
                min: minDate,
              })}
            />
          </div>
          <SubmitButton className="sm:my-2" loading={isSubmitting}>
            บันทึกข้อมูล
          </SubmitButton>
        </form>
      </div>
    </Modal>
  );
}
