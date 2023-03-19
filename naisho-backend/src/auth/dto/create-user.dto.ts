import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'general'])
  role: string;
}
