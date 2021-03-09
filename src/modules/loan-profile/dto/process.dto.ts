import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined
} from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class ProcessDto {
  id: number;
  loan_profile_id: number;
  process_status: string;
  description: string;
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
