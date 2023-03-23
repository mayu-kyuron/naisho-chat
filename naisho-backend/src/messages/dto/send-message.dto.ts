import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendMessageDto {
  @IsInt()
  @IsNotEmpty()
  roomId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  username: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
