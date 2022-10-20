import { Dialog } from "@headlessui/react";
import { isDocumentValid } from "@lemasc/swr-firestore";
import { useNavigate } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import shallow from "zustand/shallow";
import axios from "~/utils/axios";
import type { SetPlaylistAction } from "~/schema/pm-station/playlists/types";
import type { ActionResponse } from "~/utils/pm-station/api-types";
import { usePrograms } from "~/utils/pm-station/programs";

import Modal from "../Modal";
import { SubmitButton } from "../SubmitButton";
import { playlistEditorStore } from "./store";

type FormValues = Pick<SetPlaylistAction, "target" | "queuedDate">;
export default function ConfirmPlaylistModal() {
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
      try {
        setSubmitting(true);
        const { data, reset } = playlistEditorStore.getState();
        await axios.post<ActionResponse, any, SetPlaylistAction>(
          "/pm-station/app/songrequests/playlists/set",
          {
            ...form,
            tracks: data.map(({ id }) => id),
            playlistId: playlistEditorStore.getState().targetPlaylist?.id,
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
    [navigate]
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
              pattern="\d{4}-\d{2}-\d{2}"
              {...register("queuedDate", {
                valueAsDate: true,
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
