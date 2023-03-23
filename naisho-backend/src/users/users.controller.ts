import { Body, Controller, Get, ParseArrayPipe, ParseIntPipe, Post, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';
import { FoundUserDto } from './dto/found-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findByIds(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ): Promise<{
    status: number;
    rooms: FoundUserDto[];
  }> {
    const users = await this.usersService.findByIds(ids);
    const resultDtos = plainToInstance(FoundUserDto, users);

    return {
      status: 1,
      rooms: resultDtos,
    };
  }
}
