import type { ListParams } from "./types";

export const defaults: ListParams = {
  order: "asc",
  sortBy: "lastUpdatedAt",
  filter: "idle",
};

export const filterParams = (
  entries: IterableIterator<[any, any]>
): Partial<ListParams> => {
  const input = entries as IterableIterator<[keyof ListParams, string]>;
  let result = {} as Record<keyof ListParams, unknown>;
  for (const [key, value] of input) {
    const _default = defaults[key];
    const option = options[key];
    if (_default && option) {
      if (typeof option === "number") {
        result[key] = parseInt(value);
        result[key] = isNaN(result[key] as number) ? undefined : result[key];
      } else {
        result[key] = Object.keys(option).includes(value) ? value : undefined;
      }
    }
  }
  return result as Partial<ListParams>;
};

type Options = {
  [K in keyof ListParams]: ListParams[K] extends string
    ? Partial<Record<ListParams[K], string>>
    : ListParams[K];
};

export const options: Options = {
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
