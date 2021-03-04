import {
    IsString,
    IsNotEmpty,
    IsDateString
} from "class-validator";

export class UploadDeferRequestDto {
    @IsString()
    @IsNotEmpty()
    id_f1: string;

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
