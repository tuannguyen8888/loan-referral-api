import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  Matches
} from "class-validator";

export class VibIntroduceLogDto {
  @IsOptional()
  id?: number = null;
  introduceid: number = null;
  statuslead: string = null;
  statusapproval: string = null;
  intidate: number = null;
  carddeliverydate: number = null;
  cardactivedate: number = null;
  commission: number = null;
  paid: number = null;
  status: string = null;

  @IsOptional()
  @IsDateString()
  createdAt: string = null;
  createdBy: string = null;
  @IsOptional()
  @IsDateString()
  updatedAt: string = null;
  updatedBy: string = null;
  @IsOptional()
  @IsDateString()
  deletedAt: string = null;
  deletedBy: string = null;

  // process: ProcessDto[];
  // defers: LoanProfileDeferDto[];
}
