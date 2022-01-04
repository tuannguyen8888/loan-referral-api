import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { McProductResponseDto } from "./mc-product.response.dto";

export class McProductsResponseDto {
  rows: McProductResponseDto[];
  count: number;
}
