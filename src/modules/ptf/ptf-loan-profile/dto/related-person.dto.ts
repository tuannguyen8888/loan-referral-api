import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDateString,
    IsDefined
} from "class-validator";

export class RelatedPersonDto {
    id?: number = null;
    @IsDefined()
    loanProfileId: number = null;
    related_person_type: number = null;
    family_name: string = null;
    @IsOptional()
    middle_name: string = null;
    first_name: string = null;
    phone: string = null;
    @IsOptional()
    @IsDateString()
    createdAt: string = null;
    createdBy: string = null;
    @IsOptional()
    @IsDateString()
    updatedAt?: string = null;
    updatedBy?: string = null;
    @IsOptional()
    @IsDateString()
    deletedAt?: string = null;
    deletedBy?: string = null;
}
