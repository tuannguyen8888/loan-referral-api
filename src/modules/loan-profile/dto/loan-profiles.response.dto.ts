import {IsString, IsNotEmpty, IsNumber, IsOptional, IsDefined, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {LoanProfileDto} from "./loan-profile.dto";

export class LoanProfilesResponseDto {

    rows: LoanProfileDto[];

    count: number
}
