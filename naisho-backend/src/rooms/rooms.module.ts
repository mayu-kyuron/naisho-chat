import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Room } from 'src/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    AuthModule,
  ],
  controllers: [RoomsController],
  providers: [
    RoomsService,
  ],
})
export class RoomsModule {}
