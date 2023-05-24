import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Room } from 'src/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    forwardRef(() => AuthModule),
    RedisModule,
  ],
  controllers: [RoomsController],
  providers: [
    RoomsService,
  ],
  exports: [
    RoomsService,
  ],
})
export class RoomsModule {}
