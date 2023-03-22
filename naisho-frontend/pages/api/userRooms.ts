import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import axios, { AxiosResponse, AxiosError } from "axios";
import { sessionOptions } from "../../lib/session";
import { Room } from "../../entities/room.entity";
import responseDto from "./userRooms.json";

type ResponseDto = typeof responseDto;

export default withIronSessionApiRoute(userRoomsRoute, sessionOptions);

async function userRoomsRoute(req: NextApiRequest, res: NextApiResponse) {
  console.log("/api/userRooms starts.");

  const { userId } = await req.body;

  try {
    const backRes: AxiosResponse<ResponseDto> = await axios.get(
      `${process.env.BACKEND_BASE_URI}/rooms/user?id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${req.session.user?.accessToken}`,
        },
        withCredentials: true,
      }
    );

    if (backRes.data.status == 1) {
      console.log(`User's rooms successfully recieved. -> user id: ${userId}`);

      let rooms: Room[] = [];
      for (let i = 0; i < backRes.data.rooms.length; i++) {
        rooms.push({
          id: backRes.data.rooms[i].id,
          name: backRes.data.rooms[i].name,
        } as Room);
      }

      res.json(rooms);

    } else {
      console.log(`User's rooms failed to recieve. -> user id: ${userId}`);

      res
        .status(401)
        .json({ message: "トークルームの取得に失敗しました。" });
    }

  } catch (error) {
    console.log(`User's rooms exception occurred. -> user id: ${userId}, error: ${(error as Error).message}`);

    res.status(500).json({ message: (error as Error).message });
  }

  console.log("/api/userRooms ends.");
}
