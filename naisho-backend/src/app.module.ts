import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } from './config/app.config';
import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DB_HOST ?? '',
      port: Number(DB_PORT) ?? 0,
      username: DB_USERNAME ?? '',
      password: DB_PASSWORD ?? '',
      synchronize: false,
      database: DB_NAME ?? '',
      //logging: true,
      entities: [
        User,
        Room,
      ],
    }),
    AuthModule,
    RoomsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
