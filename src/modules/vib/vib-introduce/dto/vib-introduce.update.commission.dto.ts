import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined,
  Matches
} from "class-validator";

export class VibIntroduceUpdateCommissionDto {
  @IsDefined()
  id: number = null;
  commission: number = null;
  paid: number = null;

  @IsOptional()
  @IsDateString()
  updatedAt: string = null;
  updatedBy: string = null;

  @IsOptional()
  @IsDateString()
  deletedAt: string = null;
  deletedBy: string = null;
}
