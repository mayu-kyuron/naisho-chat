import type { IronSessionOptions } from "iron-session";
import type { User } from "../pages/api/user";

export const sessionOptions: IronSessionOptions = {
  password: process.env.NEXT_PUBLIC_COOKIE_PASSWORD as string,
  cookieName: process.env.NEXT_PUBLIC_COOKIE_NAME as string,
  // https でないと、接続できないため、一旦無効にする
  cookieOptions: {
    maxAge: Number(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE),
    secure: process.env.NODE_ENV === "production",
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
