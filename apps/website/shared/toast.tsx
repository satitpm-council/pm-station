import { toast, ToastOptions } from "react-toastify";

export const errorToast = (
  error: any,
  { title }: { title: string } & Omit<ToastOptions, "type">
) => {
  return toast(
    <>
      <b>{title}</b>
      <span>
        เนื่องจาก{" "}
        {error instanceof Error ? error.message : (error as any).toString()}
      </span>
    </>,
    {
      type: "error",
    }
  );
};
