import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsDefined,
  IsOptional
} from "class-validator";

export class CreateDeferRequestDto {
  @IsDefined()
  @IsOptional()
  id: number = null;

  loanProfileId: number = null;

  @IsOptional()
  deferCode: string = null;

  @IsString()
  @IsNotEmpty()
  deferNote: string = null;

  createdBy: string = null;
}
