import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashPassword,
      role,
    });
    await this.userRepository.save(user);

    return user;
  }

  async signIn(credentialsDto: CredentialsDto): Promise<{
    status: number;
    accessToken: string;
    user: { id: number; username: string; role: string };
  }> {
    const { username, password } = credentialsDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, username: user.username };
      const accessToken = await this.jwtService.sign(payload);
      return {
        status: 1,
        accessToken,
        user: { id: user.id, username: user.username, role: user.role },
      };
    }
    throw new UnauthorizedException('username or password is invalid.');
  }
}
