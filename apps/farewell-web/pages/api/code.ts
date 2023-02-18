import admin from "@/utils/firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { NextApiHandler } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/utils/session";

const checkAndSetSessionFromCode: NextApiHandler = async (req, res) => {
  const { code, uid } = req.query;
  // Validates the code and uid
  if (!code || typeof code !== "string") {
    return res.redirect("/farewell");
  }
  // The code is actually the uid of the user in firebase auth.
  const auth = getAuth(admin);
  try {
    const {
      displayName,
      customClaims,
      email,
      uid: authUid,
    } = await auth.getUser(code);
    const studentId = email?.split("@")[0] as string;
    if (uid && uid !== studentId) {
      return res.redirect("/farewell");
    }
    req.session.user = {
      level: customClaims?.level as string,
      room: customClaims?.room as string,
      displayName,
      studentId,
      uid: authUid,
    };
    await req.session.save();
    return res.redirect("/farewell/photos?code=" + code);
  } catch (err) {}
  return res.redirect("/farewell");
};

export default withIronSessionApiRoute(
  checkAndSetSessionFromCode,
  sessionOptions
);
