import { createColumnHelper } from "@tanstack/react-table";
import { User } from "@/schema/user";
import { WithXataMetadata } from "@/../../packages/db/src";
import Image from "next/image";
import dayjs from "@/shared/dayjs";
import { thaiUserRoles } from "@/shared/i18n";

const columnHelper = createColumnHelper<WithXataMetadata<User>>();

const columns = [
  columnHelper.display({
    id: "image",
    cell: ({ row }) => {
      const image = row.original.image;
      return (
        image && (
          <Image
            src={image}
            width={50}
            height={50}
            alt={row.original.name}
            className="rounded-full max-w-[40px] sm:max-w-[unset]"
          />
        )
      );
    },
  }),
  columnHelper.accessor("name", {
    header: () => "ชื่อ",
    meta: {
      hideOnViewPort: "sm",
    },
  }),
  columnHelper.accessor("email", {
    header: () => "อีเมล",
  }),
  columnHelper.accessor("metadata.createdAt", {
    cell: ({ getValue }) => dayjs(getValue()).format("ll HH:mm น."),
    header: () => "สร้างเมื่อ",
    meta: {
      hideOnViewPort: "lg",
    },
  }),
  columnHelper.accessor("role", {
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? thaiUserRoles[value] : "ยังไม่ได้ลงทะเบียน";
    },
    header: () => "สิทธิ์",
    enableSorting: false,
  }),
];

export { columns };
