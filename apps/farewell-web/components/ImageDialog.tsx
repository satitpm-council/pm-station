import useKeypress from "@/utils/useKeyPress";
import { ImageApiFile, ImageFile } from "@/types/image";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import SharedModal from "./SharedModal";

export default function ImageDialog({
  images,
  onClose,
  backgroundImage,
}: {
  images?: ImageFile[];
  backgroundImage?: ImageApiFile;
  onClose?: () => void;
}) {
  let overlayRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { photoId, id } = router.query;
  let index = Number(photoId ?? 0);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(index);

  function handleClose() {
    router.replace(
      {
        query: id ? { id } : undefined,
      },
      undefined,
      { shallow: true }
    );
    onClose && onClose();
  }

  function changePhotoId(newVal: number) {
    if (newVal > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurIndex(newVal);
    router.push(
      {
        query: { photoId: newVal, ...(id ? { id } : {}) },
      },
      undefined,
      { shallow: true }
    );
  }

  useKeypress("ArrowRight", () => {
    if (images && index + 1 < images.length) {
      changePhotoId(index + 1);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (images && index > 0) {
      changePhotoId(index - 1);
    }
  });

  return (
    <Dialog
      static
      open={true}
      onClose={onClose ? onClose : () => {}}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
        backgroundImage={backgroundImage}
      />
    </Dialog>
  );
}
