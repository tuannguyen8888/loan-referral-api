import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDefined,
    Min,
    Max,
    IsNumberString
} from "class-validator";

export class CheckInitContractRequestDto {
    productId: number;
    customerName: string;
    citizenId: string;
    loanAmount: number;
    loanTenor: number;
    customerIncome: number;
    dateOfBirth: string;
    gender: string;
    @IsOptional()
    issuePlace: string = null;
    hasInsurance: number;
}
