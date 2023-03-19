import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export type User = {
  isLoggedIn: boolean;
  userId: number | null;
  username: string;
  role: string;
  accessToken: string | null;
  expires: number | null;
};

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  console.log("/api/user starts.");
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    console.log(`User is logged in. -> user id: ${req.session.user.userId}`);
    const user = {
      ...req.session.user,
      isLoggedIn: true,
    };

    // accessTokenがブラウザから参照できるのを防ぐため, nullにする
    // session.save()　しているため、ServerSideからは、accessTokenを取得できる
    user.accessToken = null;

    res.json(user);
  } else {
    console.log(`User is not logged in. -> request body: ${String(req.body)}`);
    res.json({
      isLoggedIn: false,
      userId: null,
      username: "",
      role: "",
      accessToken: "",
      expires: null,
    });
  }
  console.log("/api/user ends.");
}
