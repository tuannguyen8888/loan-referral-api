import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsDefined,
  IsOptional
} from "class-validator";

export class DeferResponseDto {
  @IsDefined()
  id: number = null;

  @IsDefined()
  loanProfileId: number = null;

  @IsOptional()
  deferCode: string = null;

  @IsString()
  @IsNotEmpty()
  deferNote: string = null;

  @IsString()
  @IsNotEmpty()
  deferReply: string = null;

  @IsDateString()
  createdAt: string = null;
  createdBy: string = null;

  @IsDateString()
  updatedAt: string = null;
  updatedBy: string = null;
}
