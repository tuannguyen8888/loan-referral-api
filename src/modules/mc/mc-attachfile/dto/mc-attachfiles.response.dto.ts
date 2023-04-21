import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { McAttachfileResponseDto } from "./mc-attachfile.response.dto";

export class McAttachfilesResponseDto {
  rows: McAttachfileResponseDto[];
  count: number;
}
