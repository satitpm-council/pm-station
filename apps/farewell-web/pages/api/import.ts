import admin from "@/utils/firebase-admin";
import {
  getAuth,
  UserImportRecord,
  UserImportResult,
} from "firebase-admin/auth";
import { customAlphabet } from "nanoid";
import { NextApiHandler } from "next";

const studentIds = ["17411"];

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_-", 6);

const importHandler: NextApiHandler = async (req, res) => {
  const auth = getAuth(admin);
  const data: UserImportRecord[] = studentIds.map((user) => ({
    uid: nanoid(),
    email: `${user}@wpm.pnru.ac.th`,
    customClaims: {
      level: "",
      room: "",
    },
  }));
  await auth.importUsers(data);
  return res.status(200).json({ data });
};
export default importHandler;
