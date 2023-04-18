import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VibIntroduceResponseDto } from "./vib-introduce.response.dto";

export class VibIntroducesResponseDto {
  rows: VibIntroduceResponseDto[];
  count: number;
}
