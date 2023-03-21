import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @IsInt()
  @IsNotEmpty()
  createdBy: number;
}
