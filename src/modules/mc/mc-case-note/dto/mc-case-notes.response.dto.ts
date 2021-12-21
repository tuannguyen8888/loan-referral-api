import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { McCaseNoteResponseDto } from "./mc-case-note.response.dto";

export class McCaseNotesResponseDto {
  rows: McCaseNoteResponseDto[];
  count: number;
}
