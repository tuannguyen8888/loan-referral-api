import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { McScoringTrackingResponseDto } from "./mc-scoring-tracking.response.dto";

export class McScoringTrackingsResponseDto {
  rows: McScoringTrackingResponseDto[];
  count: number;
}
