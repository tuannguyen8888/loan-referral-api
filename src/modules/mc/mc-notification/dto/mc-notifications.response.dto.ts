import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { McNotificationResponseDto } from "./mc-notification.response.dto";

export class McNotificationsResponseDto {
  rows: McNotificationResponseDto[];
  count: number;
}
