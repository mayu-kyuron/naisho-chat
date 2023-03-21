import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
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

  async findByIds(ids: number[]): Promise<Room[]> {
    const rooms = await this.roomRepository.findBy({ id: In(ids) });

    return rooms;
  }
}
