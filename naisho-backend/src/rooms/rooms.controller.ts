import { Body, Controller, Get, ParseArrayPipe, ParseIntPipe, Post, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { FoundRoomDto } from './dto/found-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post('create')
  async create(@Body() requestDto: CreateRoomDto): Promise<{
    status: number;
    room: FoundRoomDto;
  }> {
    const room = await this.roomsService.create(requestDto);
    const resultDto = plainToInstance(FoundRoomDto, room);

    return {
      status: 1,
      room: resultDto,
    };
  }

  @Get('user')
  async findByUser(
    @Query('id', ParseIntPipe)
    userId: number,
  ): Promise<{
    status: number;
    rooms: FoundRoomDto[];
  }> {
    const rooms = await this.roomsService.findByUserId(userId);
    const resultDtos = plainToInstance(FoundRoomDto, rooms);

    return {
      status: 1,
      rooms: resultDtos,
    };
  }

  @Get()
  async findByIds(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ): Promise<{
    status: number;
    rooms: FoundRoomDto[];
  }> {
    const rooms = await this.roomsService.findByIds(ids);
    const resultDtos = plainToInstance(FoundRoomDto, rooms);

    return {
      status: 1,
      rooms: resultDtos,
    };
  }
}
