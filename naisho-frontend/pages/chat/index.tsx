import React, { useState, useEffect, useDebugValue, useReducer, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GetServerSideProps } from "next";
import Head from 'next/head';
import Link from "next/link";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import io from 'socket.io-client';
import { sessionOptions } from "../../lib/session";
import fetchJson, { FetchError } from "../../lib/fetchJson";
import useUser from "../../lib/useUser";
import { User } from "../api/user";
import { Room } from "../../entities/room.entity";
import { Message } from "../../entities/message.entity";
import { WebsocketOption } from "../websocket/dto/websocket-option.dto";
import { DisplayMessagesDto } from "../api/dto/display-messages.dto";
import { SendMessageDto } from "../api/dto/send-message.dto";
import { SentMessageDto } from "../api/dto/sent-message.dto";

type Props = {
  user?: User;
};

type SendMessageForm = {
  body: string;
};

const Chat = (props: Props) => {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [room, setRoom] = useState<Room>({ id: 0, name: '-' });
  const [messages, setMessages] = useState<Array<Message>>([]);

  const websocketOption: WebsocketOption = {
    query: {
      bearerToken: (props.user?.accessToken != null) ? props.user?.accessToken : '',
    },
  };
  const [socket, _] = useState(() => io(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URI}/messages`, websocketOption));

  const { roomId } = router.query;

  const sendMessageFormik = useFormik<SendMessageForm>({
    initialValues: {
      body: '',
    },
    validationSchema: Yup.object<SendMessageForm>({
      body: Yup.string(),
    }),
    onSubmit: async (values: any, helpers) => {
      // データ送信
      sendMessage(values.body);

      values.body = '';
    },
  });

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

    socket.on('connect', () => { // Socket通信の接続開始
      console.log('Socket connected. -> socket id: ', socket.id);

      socket.emit('messagesDisplayed', {
        roomId: Number(roomId),
      } as DisplayMessagesDto);
    }),
    socket.on('allMessagesReceived', (data: SentMessageDto[]) => { // サーバから allMessagesReceived イベントを受け付ける
      console.log(`allMessagesReceived called. -> messages: ${JSON.stringify(data)}`);

      const newMessages = [];
      for (let i = 0; i < data.length; i++) {
        newMessages.push({
          id: data[i].id,
          username: data[i].username,
          body: data[i].body,
          createdAt: data[i].createdAt,
        } as Message);
      }

      // 受信した全チャットメッセージを反映する
      setMessages(newMessages);
    });
    socket.on('messageReceived', (data: SentMessageDto) => { // サーバから messageReceived イベントを受け付ける
        console.log(`messageReceived called. -> name: ${data.username}, body: ${data.body}`);

        const newMessages = [...messages];
        newMessages.push({
          id: data.id,
          username: data.username,
          body: data.body,
          createdAt: data.createdAt,
        } as Message);

        // 受信したチャットメッセージを反映する
        setMessages(newMessages);
    });
  }, [messages])

  // messageSent イベントを受け付けているサーバにデータを送信する
  const sendMessage = useCallback((body: string): void => {
    console.log(`Message sent. -> socket id: ${socket.id}, body: ${body}`);

    socket.emit('messageSent', {
      roomId: Number(roomId),
      userId: props.user?.userId,
      username: props.user?.username,
      body: body,
    } as SendMessageDto);
  }, []);

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
        <div className="message-area">
          <section className="message-scroll-area">
            <ul>
              {
                messages.map((message, index) => {
                  return (
                    <li key={index} className={(message.username == props.user?.username) ? "message-left" : "message-right"}>
                      <div>{message.username}</div>
                      <div className="balloon">{message.body}</div>
                      <div><label className="message-created-at"><small>{message.createdAt}</small></label></div>
                    </li>
                  )
                })
              }
            </ul>
          </section>
        </div>
        <form onSubmit={sendMessageFormik.handleSubmit}>
          <div className="send-message-area">
            <input
              id="body"
              type="text"
              name="body"
              onChange={sendMessageFormik.handleChange}
              onBlur={sendMessageFormik.handleBlur}
              value={sendMessageFormik.values.body}
            />
            <button type="submit" disabled={sendMessageFormik.values.body === ''}>
              送信
            </button>
          </div>
        </form>
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
          .message-area {
            margin: 2% 2% 0;
            background-color: rgba(30,130,80,0.3);
          }
          .message-scroll-area {
            height: 66vh;
            overflow: scroll;
          }
          .message-scroll-area ul {
            list-style: none;
            display: flex;
            flex-direction: column;
          }
          .message-scroll-area ul .message-left {
            margin: 0 auto 0px 0px;
          }
          .message-scroll-area ul .message-right {
            margin: 0 4% 0px auto;
          }
          .message-scroll-area ul li .message-created-at {
            float: right;
          }
          /* 吹き出し本体 */
          .balloon{
            position: relative;
            margin: 8px 0 0;
            padding: 4px;
            background-color: #ffffff;
            border: 2px solid #f7f9fb;
          }
          /* beforeで枠線の三角を表現 */
          .balloon::before{
            content: '';
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            left: 16px;
            top: -10px;
            border-right: 10px solid transparent;
            border-bottom: 10px solid #f7f9fb;
            border-left: 10px solid transparent;
          }
          /* beforeで本体の三角を表現 */
          .balloon::after{
            content: '';
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            left: 16px;
            top: -8px;
            border-right: 10px solid transparent;
            border-bottom: 10px solid #ffffff;
            border-left: 10px solid transparent;
          }
          .send-message-area {
            margin: 1% 2% 0;
          }
          .send-message-area input {
            width: 96.5%;
          }
          .send-message-area button {
            margin: 0 0 0 0.5%;
            border-color: #167BE2;
            background-color: #167BE2;
            color: #ffffff;
          }
          .send-message-area button:disabled {
            border-color: #cccccc;
            background-color: #cccccc;
            color: #666666;
          }
          h2 {
            padding-left: 0.5em;
            color: #364e96;
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
