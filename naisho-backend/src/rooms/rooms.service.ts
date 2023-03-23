import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import RedisKeys from '../consts/redis-keys.json';
import { Room } from '../entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private readonly redisService: RedisService,
  ) {}

  async create(requestDto: CreateRoomDto): Promise<Room> {
    const { name, createdBy } = requestDto;

    const room = this.roomRepository.create({
      name,
      createdBy,
    });
    await this.roomRepository.save(room);

    return room;
  }

  async findByUserId(userId: number): Promise<Room[]> {
    const userRoomsKey: string = RedisKeys.userRooms.prefix + userId + RedisKeys.userRooms.suffix;
    const roomIdStrs = await this.redisService.getMembers(userRoomsKey);

    const roomIds: number[] = roomIdStrs.map(x => Number(x));
    const rooms = await this.findByIds(roomIds);

    return rooms;
  }

  async findByIds(ids: number[]): Promise<Room[]> {
    const rooms = await this.roomRepository.findBy({ id: In(ids) });

    return rooms;
  }
}
