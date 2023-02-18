import { sessionOptions } from "@/utils/session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

const logoutRoute: NextApiHandler = async (req, res) => {
  req.session.destroy();
  res.redirect("/farewell");
};

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
