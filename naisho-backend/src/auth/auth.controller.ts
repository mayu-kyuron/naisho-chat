import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { CredentialsDto } from './dto/credentials.dto';
import { CreateRoomDto } from 'src/rooms/dto/create-room.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private roomsService: RoomsService,
  ) {}

  @Post('signup')
  async singUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authService.signUp(createUserDto);

    const createRoomDto: CreateRoomDto = {
      name: 'マイチャット',
      createdBy: user.id,
    };
    await this.roomsService.create(createRoomDto);

    return user;
  }

  @Post('signin')
  async signIn(
    @Body() credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(credentialsDto);
  }
}
