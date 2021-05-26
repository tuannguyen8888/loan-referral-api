import { IsString, IsNotEmpty, IsDateString } from "class-validator";
import { UploadDeferRequestDto } from "./index";

export class UploadDeferReponseDto {
  data: UploadDeferRequestDto;

  status: string; // SUCCESS | ERROR

  message?: string;
}
