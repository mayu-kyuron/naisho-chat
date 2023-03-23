import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class DisplayMessagesDto {
  @IsInt()
  @IsNotEmpty()
  roomId: number;
}
