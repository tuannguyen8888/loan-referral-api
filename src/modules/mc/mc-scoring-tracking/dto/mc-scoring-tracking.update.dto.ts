import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined,
  Matches
} from "class-validator";

export class McScoringTrackingUpdateDto {
  @IsDefined()
  id: number = null;
  typeScore: string = null;
  primaryPhone: string = null;
  //fullname: string = null;
  nationalId: string = null;
  verificationCode: string = null;
  requestSendOtp3P: string = null;
  requestScoring3P: string = null;

  @IsOptional()
  @IsDateString()
  updatedAt: string = null;
  updatedBy: string = null;

  @IsOptional()
  @IsDateString()
  deletedAt: string = null;
  deletedBy: string = null;
}
