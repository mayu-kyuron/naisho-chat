import React, { useState, useEffect, useDebugValue, useReducer, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GetServerSideProps } from "next";
import Head from 'next/head';
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import fetchJson, { FetchError } from "../../lib/fetchJson";
import useUser from "../../lib/useUser";
import { User } from "../api/user";
import { Room } from "../../entities/room.entity";
import { Message } from "../../entities/message.entity";

type Props = {
  user?: User;
};

const Chat = (props: Props) => {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [room, setRoom] = useState<Room>({ id: 0, name: '-' });
  const [messages, setMessages] = useState<Array<Message>>([]);

  const { roomId } = router.query;

  useEffect(() => {
    const fetchRooms = async () => {
      const body = {
        userId: props.user?.userId,
      };

      try {
        // トークルーム取得API呼出し
        const rooms: Room[] = await fetchJson("/api/userRooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!rooms.some(r => r.id === Number(roomId))) {
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
    }
    fetchRooms();

    const fetchRoom = async () => {
      const body = {
        ids: roomId,
      };

      try {
        // トークルーム取得API呼出し
        const rooms: Room[] = await fetchJson("/api/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        setRoom(rooms[0]);

      } catch (error) {
        if (error instanceof FetchError) {
          setErrorMessage(error.data.message);
        } else {
          console.error(`Unexpected exception occurred. -> error: ${String(error)}`);
        }
      }
    }
    fetchRoom();
  }, [])

  return (
    <>
      <Head>
        <title>{room?.name} | Naisho Chat</title>
      </Head>
      <div className="wrapper">
        {props.user?.isLoggedIn === false && (
          <></>
        )}
        {props.user?.isLoggedIn === true && (
          <>
            <header>
              <div className="main-header">
                <div className="header-inner">
                  <div className="header-item user-icon">
                    <details className="details-overlay">
                      <div className="dropdown-menu dropdown-menu-sw">
                      <div className="user-menu user-id">
                        <span>ユーザー名：</span>
                        <span className="bold">{props.user?.username}</span>
                      </div>
                        <div className="user-menu logout-field">
                          <Link legacyBehavior href="/api/logout">
                            <a
                              onClick={async (e) => {
                                e.preventDefault();
                                mutateUser(
                                  await fetchJson("/api/logout", {
                                    method: "POST",
                                  }),
                                  false
                                );
                                router.push("/login");
                              }}
                            >
                              ログアウト
                            </a>
                          </Link>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </header>
          </>
        )}
        <div>
          <button type="button" className="previous" onClick={() => router.back()}>
            ＜
          </button>
          <label className="room-title">{room?.name}</label>
        </div>
        <div>
          <ul>
            <li>Room ID: {roomId}</li>
          </ul>
        </div>
        <style jsx>{`
          .user-id {
            color: #FFFFFF;
          }
          .logout-field {
            background-color: #d0d7de;
          }
          .previous {
            border: none;
            background-color: transparent;
            width: 4em;
            height: 4em;
            font-size: 100%;
            font-weight: bold;
          }
          .room-title {
            font-size: x-large;
            font-weight: bold;
            color: #364e96;
            vertical-align: middle;
          }
          h2 {
            padding-left: 0.5em;
            color: #364e96;
          }
          table {
            table-layout: fixed;
            width: 100%;
          }
          table,th,td {
            border: 1px solid #bbb;
          }
          td {
            padding: 0 8px;
            overflow: hidden;
          }
          ul {
            background: whitesmoke;
            padding: 0 0.5em;
            position: relative;
          }
          ul li {
            line-height: 1.5;
            padding: 0.5em 0 0.5em 1.5em;
            border-bottom: 2px solid white;
            list-style-type: none!important;
          }
          ul li:before {
            content: "〇";/*アイコン種類*/
            position: absolute;
            left : 0.5em; /*左端からのアイコンまで*/
            color: #668ad8; /*アイコン色*/
          }
          ul li:last-of-type {
            border-bottom: none;/*最後の線だけ消す*/
          }
        `}</style>
      </div>
    </>
  );
};
export default Chat;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
    console.log('Chat.getServerSideProps() called.');

    const user = req.session.user;

    console.log(`Session user tried to find. -> user id: ${user?.userId}`);

    // セッション情報がなかった場合
    if (user === undefined) {
      // ログイン画面へ遷移
      res.setHeader("location", "/login");
      res.statusCode = 302;
      res.end();

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

    // 権限チェック
    /*
      if (user?.role !== "admin") {
        return {
          notFound: true,
        };
      }
      */

    return {
      props: {
        user: req.session.user,
      },
    };
  },
  sessionOptions
);
