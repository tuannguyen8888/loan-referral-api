import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {McCicresultUpdateDto} from "./mc-cicresult.update.dto";

export class McCicresultsResponseDto {
  rows: McCicresultUpdateDto[];
  count: number;
}
