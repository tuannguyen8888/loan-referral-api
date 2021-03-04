import {
    IsString,
    IsNotEmpty,
    IsDateString
} from "class-validator";
import {UploadStatusF1RequestDto} from ".";

export class UploadStatusF1ReponseDto {
    data: UploadStatusF1RequestDto;

    status: string; // SUCCESS | ERROR

    message?: string;
}