import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtWsStrategy } from './jwt-ws.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtWebsocketGuard } from './guards/jwt-websocket.guard';
import { RolesGuard } from './guards/roles.guard';
import { JWT_SECRET_KEY, JWT_EXPIRES_IN } from '../config/app.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_SECRET_KEY ?? '',
      signOptions: {
        expiresIn: JWT_EXPIRES_IN ?? 3600,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard, JwtWsStrategy, JwtWebsocketGuard],
  exports: [JwtStrategy, JwtAuthGuard, RolesGuard, JwtWebsocketGuard],
})
export class AuthModule {}
