import React, { useState, useEffect, useDebugValue, useReducer, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GetServerSideProps } from "next";
import Head from 'next/head';
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import fetchJson, { FetchError } from "../../lib/fetchJson";
import { User } from "../api/user";

type Props = {
  user?: User;
};

const Login = (props: Props) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>();

  useEffect(() => {
    // ログイン済の場合
    if (props.user?.isLoggedIn === true) {
      // ホーム画面へ遷移
      router.push("/home");
    }
  }, []);

  // ログインフォームの処理
  const loginFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("ユーザー名は必須です。"),
      password: Yup.string().required("パスワードは必須です。"),
    }),
    onSubmit: async (values: any) => {
      //e.preventDefault();　// formik利用で不要
      const body = {
        username: values.username,
        password: values.password,
      };

      try {
        // ログインAPI呼出し
        const user: User = await fetchJson("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (user?.isLoggedIn == true) {
          // ホーム画面へ遷移
          router.push("/home");
        }

      } catch (error) {
        if (error instanceof FetchError) {
          setErrorMessage(error.data.message);
        } else {
          console.error(`Unexpected exception occurred. -> error: ${String(error)}`);
        }
      }
    },
  });

  return (
    <>
      <Head>
        <title>ログイン | Naisho Chat</title>
      </Head>
      {props.user?.isLoggedIn === true && (
        <></>
      )}
      {props.user?.isLoggedIn === false && (
        <>
          <div className="login">
            <div className="login-title">
              <h1>Naisho Chat</h1>
              {errorMessage && (
                <div className="error-top error">{errorMessage}</div>
              )}
            </div>
            <div className="login-container">
              <form onSubmit={loginFormik.handleSubmit}>
                <div className="field">
                  <label>ユーザー名：</label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    value={loginFormik.values.username}
                  />
                  {loginFormik.touched.username && loginFormik.errors.username ? (
                    <span className="error">{loginFormik.errors.username}</span>
                  ) : null}
                </div>
                <div className="field">
                  <label>パスワード：</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    value={loginFormik.values.password}
                  />
                  {loginFormik.touched.password && loginFormik.errors.password ? (
                    <span className="error">{loginFormik.errors.password}</span>
                  ) : null}
                </div>
                <button type="submit" className="btn btn-primary">
                  ログイン
                </button>
              </form>
            </div>
            <style jsx>{`
              .login {
                max-width: 21rem;
                margin: 0 auto;
                padding-top: 32px;
              }
              .login-title h1 {
                font-size: 24px;
                font-weight: 300;
                margin-bottom: 16px;
                text-align: center;
              }
              .login-container {
                padding: 1rem;
                border: 1px solid #d8dee4;
                border-radius: 4px;
                background: #f7f9fb;
              }
              .field {
                margin: 0.3rem 0 1rem;
              }
              label {
                font-weight: 600;
                margin-bottom: 10px;
                display: block;
              }
              label,
              input {
                width: 100%;
              }
              input {
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
              }
              .error {
                color: red;
                margin: 1rem 0 0;
              }
              button {
                width: 100%;
              }
              .error-top {
                font-size: 13px;
                margin-bottom: 20px;
                padding: 16px;
              }
            `}</style>
          </div>
        </>
      )}
    </>
  );
}
export default Login;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
    console.log('Login.getServerSideProps() called.');

    const user = req.session.user;

    console.log(`Session user tried to find. -> user id: ${user?.userId}`);

    // セッション情報がなかった場合
    if (user === undefined) {
      // データ保持状態をリセット
      return {
        props: {
          user: {
            isLoggedIn: false,
            userId: null,
            username: "",
            role: "",
            accessToken: "",
            expires: null,
          } as User,
        },
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  },
  sessionOptions
);
