import type { VisibleOptions } from "~/utils/params";
import type { ListParams } from "./sort";

export const defaults: ListParams = {
  order: "asc",
  sortBy: "lastUpdatedAt",
  filter: "idle",
};

export const options: VisibleOptions<ListParams> = {
  sortBy: {
    lastUpdatedAt: "วันเวลาที่ส่ง",
    name: "ชื่อเพลง",
    submissionCount: "จำนวนผู้ส่งคำขอ",
  },
  order: {
    asc: "ก่อน-หลัง",
    desc: "หลัง-ก่อน",
  },
  filter: {
    all: "ทั้งหมด",
    idle: "ยังไม่ถูกเล่น",
    played: "เล่นไปแล้ว",
    rejected: "ถูกปฏิเสธ",
  },
};
