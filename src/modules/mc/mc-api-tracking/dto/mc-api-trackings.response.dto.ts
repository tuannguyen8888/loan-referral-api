import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { McApiTrackingResponseDto } from "./mc-api-tracking.response.dto";

export class McApiTrackingsResponseDto {
  rows: McApiTrackingResponseDto[];
  count: number;
}
