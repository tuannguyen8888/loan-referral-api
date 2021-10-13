import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString
} from "class-validator";
import { ProcessDto } from "src/modules/mafc/loan-profile/dto";


export class McCicresultResponseDto {
  id: number = null;
  requestId: string = null;
  identifier: string = null;
  customerName: string = null;
  cicResult: number = null;
  cicDescription: string = null;
  cicImageLink: string = null;
  lastUpdateTime: Date = null;
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
