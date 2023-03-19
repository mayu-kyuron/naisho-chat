import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import type { User } from "./user";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  console.log("/api/logout starts.");
  req.session.destroy();
  res.json({
    isLoggedIn: false,
    userId: null,
    username: "",
    role: "",
    accessToken: "",
    expires: null,
  });
  console.log("/api/logout ends.");
}
