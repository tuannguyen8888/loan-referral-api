import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined
} from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class ReferenceDto {
  id?: number;
  title: string;
  referee_name: string;
  referee_relation: string;
  phone_1: string;

  @IsOptional()
  @IsDateString()
  created_at: string;
  created_by: number;
  @IsOptional()
  @IsDateString()
  updated_at?: string;
  updated_by?: number;
  @IsOptional()
  @IsDateString()
  deleted_at?: string;
  deleted_by?: number;
}
