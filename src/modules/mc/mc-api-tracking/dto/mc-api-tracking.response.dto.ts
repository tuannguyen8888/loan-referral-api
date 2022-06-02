import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString
} from "class-validator";
import { ProcessDto } from "src/modules/mafc/loan-profile/dto";

export class McApiTrackingResponseDto {
  id: number = null;
  typeScore: string = null;
  primaryPhone: string = null;
  fullname: string = null;
  nationalId: string = null;
  verificationCode: string = null;
  requestSendOtp3P: string = null;
  requestScoring3P: string = null;

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
