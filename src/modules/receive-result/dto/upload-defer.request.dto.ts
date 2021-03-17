import {IsString, IsNotEmpty, IsDateString, IsDefined, IsOptional} from "class-validator";

export class UploadDeferRequestDto {
  @IsDefined()
  id_f1: number;

  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsOptional()
  defer_code: string;

  @IsString()
  @IsNotEmpty()
  defer_note: string;

  @IsNotEmpty()
  defer_time: string;
}
