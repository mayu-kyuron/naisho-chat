import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtWsStrategy extends PassportStrategy(Strategy, 'jwtWs') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('bearerToken'),
      secretOrKey: process.env.JWT_SECRET_KEY ?? 'secretKey123',
    });
  }

  async validate(payload: { id: number; username: string }): Promise<User> {
    const { id, username } = payload;
    const user = await this.userRepository.findOneBy({ id, username });

    if (user) {
      return user;
    }
    throw new WsException('Unauthorized access');
  }
}
