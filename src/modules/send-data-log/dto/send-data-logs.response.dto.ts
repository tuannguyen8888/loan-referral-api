import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SendDataLogDto } from ".";

export class SendDataLogsResponseDto {
  rows: SendDataLogDto[];

  count: number;
}
