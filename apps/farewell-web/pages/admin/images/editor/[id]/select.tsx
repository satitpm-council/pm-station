import { useRouter } from "next/router";
import Image from "next/image";
import { useCallback } from "react";

export default function SelectPage() {
  const {
    query: { frame },
  } = useRouter();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      const formData = new FormData(e.currentTarget);
      formData.get("");
    },
    []
  );
  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <Image
        className="-my-10"
        src="/logo/FULLCOLOR.png"
        width={300}
        height={300}
        alt="Logo"
      />
      <h1 className="uppercase -mt-10">Photobooth</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span className="mr-4">รหัสประจำตัวนักเรียน:</span>
          <input
            className="inline-block rounded px-4 py-2 focus:outline-none "
            type="name"
            name="studentId"
          />
        </label>
      </form>
    </div>
  );
}
