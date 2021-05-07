import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsDefined,
  IsOptional
} from "class-validator";

export class UpdateDeferRequestDto {
  @IsDefined()
  id: number;

  @IsString()
  @IsNotEmpty()
  deferReply: string;

  @IsDateString()
  updatedAt: string = null;
  updatedBy: string = null;
}
