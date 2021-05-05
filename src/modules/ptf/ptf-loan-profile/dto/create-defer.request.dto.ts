import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsDefined,
    IsOptional
} from "class-validator";

export class CreateDeferRequestDto {
    @IsDefined()
    id: number;

    loanProfileId

    @IsOptional()
    deferCode: string;

    @IsString()
    @IsNotEmpty()
    deferNote: string;

}
