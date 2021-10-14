import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {McCaseResponseDto} from "./mc-case.response.dto";

export class McCasesResponseDto {
  rows: McCaseResponseDto[];
  count: number;
}
