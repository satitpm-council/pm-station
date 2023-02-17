import { withAuth } from "@/utils/api";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {};

export default withAuth(handler);
