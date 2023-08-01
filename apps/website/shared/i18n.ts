import { UserRole, UserType } from "@/schema/user";

const thaiUserRoles: Record<UserRole, string> = {
  admin: "ผู้ดูแลระบบ",
  editor: "ผู้แก้ไข",
  user: "ผู้ใช้งาน",
};

const thaiUserType: Record<UserType, string> = {
  student: "นักเรียน",
  teacher: "อาจารย์",
  guest: "บุคคลทั่วไป",
};

export { thaiUserRoles, thaiUserType };
