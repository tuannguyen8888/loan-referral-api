import {IsDateString, IsOptional} from "class-validator";

export class BankBranchDto {
    id: number = null;
    code: string = null;
    name: string = null;
}
