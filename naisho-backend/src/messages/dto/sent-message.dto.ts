import { Exclude, Expose } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@Exclude()
export class SentMessageDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  username: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  body: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  createdAt: string;
}
