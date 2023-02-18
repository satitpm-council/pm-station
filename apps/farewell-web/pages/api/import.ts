import admin from "@/utils/firebase-admin";
import {
  getAuth,
  UserImportRecord,
  UserImportResult,
} from "firebase-admin/auth";
import { customAlphabet } from "nanoid";
import { NextApiHandler } from "next";

const studentIds = [
  "17209",
  "17505",
  "17509",
  "17644",
  "17653",
  "17709",
  "17989",
  "17992",
  "17997",
  "18019",
  "18047",
  "18048",
  "18070",
  "18071",
  "18086",
  "18104",
  "18414",
  "18432",
];

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
