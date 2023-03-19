import type { User } from "./user";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse, AxiosError } from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import qs from "qs";

import loginInfo from "./login.json";

type LoginInfo = typeof loginInfo;

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  console.log("/api/login starts.");
  const { username, password } = await req.body;

  try {
    /*
    const {
      data: { login, avatar_url },
    } = await octokit.rest.users.getByUsername({ username });
    */

    const params = qs.stringify({
      username: username,
      password: password,
    });

    /*
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    */

    const ret: AxiosResponse<LoginInfo> = await axios.post(
      `${process.env.BACKEND_BASE_URI}/auth/signin`,
      params,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      }
    );

    if (ret.data.status == 1) {
      console.log(`User successfully authenticated. -> username: ${username}`);

      const decoded = jwtDecode<JwtPayload>(ret.data.accessToken);
      console.log(decoded);

      let exp_millis = 0;
      if (decoded.exp !== undefined) {
        exp_millis = decoded.exp * 1000;
      } else {
        exp_millis = 0;
      }

      console.log(exp_millis);

      const user = {
        isLoggedIn: true,
        userId: ret.data.user.id,
        username: ret.data.user.username,
        role: ret.data.user.role,
        accessToken: ret.data.accessToken,
        expires: exp_millis,
      } as User;
      req.session.user = user;
      await req.session.save();
      console.log(`User's session saved. -> user id: ${ret.data.user.id}`);

      // accessTokenがブラウザから参照できるのを防ぐため, nullにする
      // session.save()　しているため、ServerSideからは、accessTokenを取得できる
      user.accessToken = null;
      res.json(user);
    } else {
      console.log(`User auth failed. -> username: ${username}`);
      res
        .status(401)
        .json({ message: "ユーザ名 または パスワードに誤りがあります" });
    }
  } catch (error) {
    console.log(`User auth exception occurred. -> username: ${username}, error: ${(error as Error).message}`);
    if ((error as Error).message == "Request failed with status code 401") {
      res
        .status(401)
        .json({ message: "ユーザ名 または パスワードに誤りがあります" });
    } else {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  console.log("/api/login ends.");
}
