import { IsString, IsNotEmpty, IsDateString } from "class-validator";
import { UploadDeferRequestDto } from ".";

export class UploadDeferReponseDto {
  data: UploadDeferRequestDto;

  status: string; // SUCCESS | ERROR

  message?: string;
}
