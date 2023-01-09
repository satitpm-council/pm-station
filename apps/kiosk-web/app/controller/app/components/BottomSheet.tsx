"use client";

import Sheet from "react-modal-sheet";
import { controllerStore } from "../shared/store";
import SongSelector from "./SongSelector";

export default function BottomSheet() {
  const show = controllerStore((state) => state.showBottomSheet);
  return (
    <Sheet
      isOpen={show}
      onClose={() =>
        controllerStore.setState((s) => ({
          ...s,
          showBottomSheet: !s.showBottomSheet,
        }))
      }
      snapPoints={[0.8]}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <SongSelector />
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        // @ts-ignore
        onClick={() =>
          controllerStore.setState((s) => ({
            ...s,
            showBottomSheet: !s.showBottomSheet,
          }))
        }
      />
    </Sheet>
  );
}
