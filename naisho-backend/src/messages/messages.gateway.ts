import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';
import RedisKeys from '../consts/redis-keys.json';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { Message } from '../entities/redis/message.redis-entity';
import { DisplayMessagesDto } from './dto/display-messages.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SentMessageDto } from './dto/sent-message.dto';

@WebSocketGateway({namespace: 'messages', cors: { origin: '*' }})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  private className: string = MessagesGateway.name;
  private logger: Logger = new Logger(this.className);

  constructor(
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * クラス初期化後の処理を実行する。
   * @param server
   */
  afterInit(server: Server) {
    this.logger.log(`${this.className}() Initialized.`);
  }

  /**
   * クライアント接続時の処理を実行する。
   * @param client
   * @param args
   */
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(`Client (id: ${client.id}) connected.`);
  }

  /**
   * メッセージ表示時の処理を実行する。
   * @param data
   * @param client
   */
  @SubscribeMessage('messagesDisplayed')
  async onMessagesDisplayed(@MessageBody() data: DisplayMessagesDto, @ConnectedSocket() client: Socket) {
    this.logger.debug(`${this.onMessagesDisplayed.name} called.`);
    this.logger.debug(data);

    // DB・Redisからチャットルームの全ユーザ情報を取得する
    const roomUsersKey: string = RedisKeys.roomUsers.prefix + data.roomId + RedisKeys.roomUsers.suffix;
    const roomUserIds: string[] = await this.redisService.getMembers(roomUsersKey);
    const roomUsers: User[] = await this.usersService.findByIds(roomUserIds.map(i => Number(i)));

    // Redisから全チャットメッセージを取得する
    const roomMessagesKey: string = RedisKeys.roomMessages.prefix + data.roomId + RedisKeys.roomMessages.suffix;
    const roomMessages: string[] = await this.redisService.getList(roomMessagesKey);

    let responseDtos: SentMessageDto[] = [];
    for (let i = 0; i < roomMessages.length; i++) {
      let roomMessage = JSON.parse(roomMessages[i]) as Message;
      let username = roomUsers.find(u => u.id === roomMessage.userId).username;

      let responseDto: SentMessageDto = {
        id: roomMessage.id,
        username: username,
        body: roomMessage.body,
        createdAt: roomMessage.createdAt.replace(/-/g, '/'),
      };

      responseDtos.push(responseDto);
    }

    // allMessagesReceived イベントを受け付けているクライアントにデータを送信する
    client.join(client.id);
    this.server.to(client.id).emit('allMessagesReceived', responseDtos);

    // チャットルームに参加させる
    client.join(String(data.roomId));
  }

  /**
   * メッセージ送信時の処理を実行する。
   * @param data
   * @param client
   */
  @SubscribeMessage('messageSent')
  async onMessageSent(@MessageBody() data: SendMessageDto, @ConnectedSocket() client: Socket): Promise<void> {
    this.logger.debug(`${this.onMessageSent.name} called.`);
    this.logger.debug(data);

    const currentDate = new Date();
    const currentYYYY: string = String(currentDate.getFullYear());
    const currentMM: string = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentDD: string = String(currentDate.getDate()).padStart(2, '0');
    const currenthh: string = String(currentDate.getHours()).padStart(2, '0');
    const currentmm: string = String(currentDate.getMinutes()).padStart(2, '0');
    const currentss: string = String(currentDate.getSeconds()).padStart(2, '0');

    const currentDateStr: string = `${currentYYYY}-${currentMM}-${currentDD} ${currenthh}:${currentmm}:${currentss}`;
    const currentDateId: string = `${currentYYYY}${currentMM}${currentDD}${currenthh}${currentmm}${currentss}`;

    const messageId = `${data.roomId},${currentDateId},${client.id}`;

    const message: Message = {
      id: messageId,
      userId: data.userId,
      body: data.body,
      createdAt: currentDateStr,
    };

    // チャットメッセージを保存する
    const roomMessagesKey: string = RedisKeys.roomMessages.prefix + data.roomId + RedisKeys.roomMessages.suffix;
    await this.redisService.setList(roomMessagesKey, [JSON.stringify(message)]);

    // messageReceived イベントを受け付けているクライアントにデータを送信する
    this.server.to(String(data.roomId)).emit('messageReceived', {
      id: message.id,
      username: data.username,
      body: message.body,
      createdAt: message.createdAt.replace(/-/g, '/'),
    } as SentMessageDto);
  }

  /**
   * クライアント切断時の処理を実行する。
   * @param client
   */
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Client (id: ${client.id}) disconnected.`);
  }
}
