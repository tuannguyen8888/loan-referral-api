import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString
} from "class-validator";
import { ProcessDto } from "src/modules/mafc/loan-profile/dto";

export class VibIntroduceResponseDto {
  id: number = null;
  regisdate: number = null;
  source: string = null;
  introduceby: string = null;
  cardtype: string = null;
  customername: string = null;
  customerphone: string = null;
  province: string = null;
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

  process: ProcessDto[];
}
