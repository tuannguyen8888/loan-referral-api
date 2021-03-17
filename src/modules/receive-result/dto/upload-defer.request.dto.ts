import {IsString, IsNotEmpty, IsDateString, IsDefined} from "class-validator";

export class UploadDeferRequestDto {
  @IsDefined()
  id_f1: number;

  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsString()
  @IsNotEmpty()
  defer_code: string;

  @IsString()
  @IsNotEmpty()
  defer_note: string;

  @IsDateString()
  @IsNotEmpty()
  defer_time: string;
}
