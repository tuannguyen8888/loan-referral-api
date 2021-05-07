import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined
} from "class-validator";

export class AttachFileDto {
  id?: number = null;
  @IsDefined()
  loanProfileId: number = null;
  type: string = null;
  url: string = null;
  @IsOptional()
  @IsDateString()
  createdAt: string = null;
  createdBy: string = null;
  @IsOptional()
  @IsDateString()
  updatedAt?: string = null;
  updatedBy?: string = null;
  @IsOptional()
  @IsDateString()
  deletedAt?: string = null;
  deletedBy?: string = null;
}
