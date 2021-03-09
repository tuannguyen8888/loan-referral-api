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
  id: number = null;
  loan_profile_id: number = null;
  process_status: string = null;
  description: string = null;
  @IsOptional()
  @IsDateString()
  created_at: string = null;
  created_by: number = null;
  @IsOptional()
  @IsDateString()
  updated_at?: string = null;
  updated_by?: number = null;
  @IsOptional()
  @IsDateString()
  deleted_at?: string = null;
  deleted_by?: number = null;
}
