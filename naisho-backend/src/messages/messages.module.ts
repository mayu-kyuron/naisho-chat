import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';
import { UsersModule } from '../users/users.module';
import { MessagesGateway } from './messages.gateway';
import { Message } from '../entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    AuthModule,
    RedisModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    MessagesGateway,
  ],
})
export class MessagesModule {}
