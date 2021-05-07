import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDateString,
    IsDefined
} from "class-validator";
import {Column, PrimaryGeneratedColumn} from "typeorm";

export class EmploymentInformationDto {
    @IsOptional()
    id?: number = null;
    @IsOptional()
    loanProfileId?: number = null;
    @IsOptional()
    houseNumberAndStreet?: string = null;
    @IsOptional()
    cityId?: number = null;
    @IsOptional()
    districtId?: number = null;
    @IsOptional()
    wardId?: number = null;
    @IsOptional()
    economicalStatus?: number = null;
    @IsOptional()
    companyUniversityName?: string = null;
    @IsOptional()
    profession?: number = null;
    @IsOptional()
    employedAtLastWork?: string = null;
    @IsOptional()
    income?: number = null;
    @IsOptional()
    monthlyPaymentsOtherLoans?: number = null;
    @IsOptional()
    @IsDateString()
    createdAt: string = null;
    createdBy: string = null;
    @IsOptional()
    @IsDateString()
    updatedAt?: string = null;
    @IsOptional()
    updatedBy?: string = null;
    @IsOptional()
    @IsDateString()
    deletedAt?: string = null;
    @IsOptional()
    deletedBy?: string = null;
}
