import React, { useState, useEffect, useDebugValue, useReducer, useCallback } from "react";
import { GetServerSideProps } from "next";
import Head from 'next/head';
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import { User } from "./api/user";

type Props = {
  user?: User;
};

const Index = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    // ログイン済の場合
    if (props.user?.isLoggedIn === true) {
      // ホーム画面へ遷移
      router.push("/home");
    }
  }, []);

  return (
    <>
      <Head>
        <title>TOP | Naisho Chat</title>
      </Head>
      {props.user?.isLoggedIn === true && (
        <></>
      )}
      {props.user?.isLoggedIn === false && (
        <>
          <div className="index-page">
            <div className="dashboard-field">
              <div className="dashboard">
                <p>
                  Naisho Chat<br/>
                  <br/>
                  ～誤爆を内緒にしちゃうチャットアプリ～
                  <span
                    className="signup-continue-prompt mr-2"
                    aria-hidden="true"
                  ></span>
                </p>
                <div className="btn-field">
                  <Link legacyBehavior href="/login">
                    <a className="btn-signin">ログイン</a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="footer-field">
              <p>
                ※こちらは個人製作の無料サービスです。機密情報などの重要な情報のやりとりは想定しておらず、<br/>
                　データ保持についても保証しかねますので、ご了承ください。
              </p>
            </div>
          </div>
        </>
      )}
      <style jsx>{`
        .index-page {
          display: flex;
          flex-direction: column;
          flex: 1;
          background-color: #141f2e !important;
        }
        .dashboard-field {
          flex: 1;
        }
        .dashboard {
          margin: 128px auto 0;
          max-width: 654px;
          color: #627597;
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
            Liberation Mono, monospace !important;
          background-color: #0d1622;
          border: 1px solid #202637;
          border-radius: 8px;
          width: 100%;
          padding: 24px;
        }
        .dashboard p {
          font-size: 15px;
        }
        .dashboard .btn-field {
          text-align: right;
        }
        .dashboard .btn-signin {
          color: #2da44e;
          border: 1px solid #2da44e;
          border-radius: 5px;
          padding: 8px 16px;
        }
        .dashboard .btn-signin:hover {
          text-decoration: none;
        }
        .footer-field {
          padding: 16px;
          margin-bottom: 40px;
        }
        .footer-field p {
          color: #627597;
          font-size: 12px;
          width: 100%;
          max-width: 654px;
          margin-left: auto;
          margin-right: auto;
        }
        .main-header {
          background-color: unset;
        }
      `}</style>
    </>
  );
}
export default Index;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
    console.log('Index.getServerSideProps() called.');

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
