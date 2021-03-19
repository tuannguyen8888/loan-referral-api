import {IsString, IsNotEmpty, IsDateString, IsDefined} from "class-validator";

export class UploadStatusF1RequestDto {
  @IsDefined()
  id_f1: number;

  @IsString()
  @IsNotEmpty()
  f1_no: string;

  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsString()
  @IsNotEmpty()
  status_f1: string;

  @IsDateString()
  @IsNotEmpty()
  f1_time: string;

  @IsString()
  @IsNotEmpty()
  rejected_code?: string;

  @IsString()
  @IsNotEmpty()
  reason?: string;
}
