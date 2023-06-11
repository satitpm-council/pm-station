import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

export type ModalProps = {
  children: React.ReactNode | React.ReactNode[];
  /** Function that will be called when the modal is fully closed. */
  onClose?: () => void;
  canClose?: boolean;
} & ModalState;

export type ModalState = {
  isOpen: boolean;
  /** Function that sets the modal state to be close. */
  closeModal: () => void;
};

export function Modal({
  isOpen,
  closeModal,
  onClose,
  children,
  canClose = true,
}: ModalProps) {
  const afterLeave = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  return (
    <Transition appear show={isOpen} as={Fragment} afterLeave={afterLeave}>
      <Dialog
        as="div"
        className="relative z-[999]"
        onClose={() => canClose && closeModal()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex flex-col md:flex-row items-center gap-8 w-full max-w-sm mr-5 sm:max-w-md md:max-w-2xl transform overflow-hidden rounded-xl bg-stone-800 px-6 py-10 shadow-xl transition-all text-white">
                {canClose && (
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 items-center justify-center md:items-start text-center md:text-left focus:outline-none opacity-80 hover:opacity-50 transition-opacity"
                  >
                    <XMarkIcon className="md:h-8 md:w-8 h-6 w-6" />
                  </button>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
