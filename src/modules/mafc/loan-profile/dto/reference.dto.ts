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
  id?: number = null;
  title: string = null;
  referee_name: string = null;
  referee_relation: string = null;
  phone_1: string = null;

  @IsOptional()
  @IsDateString()
  created_at: string = null;
  created_by: string = null;
  @IsOptional()
  @IsDateString()
  updated_at?: string = null;
  updated_by?: string = null;
  @IsOptional()
  @IsDateString()
  deleted_at?: string = null;
  deleted_by?: string = null;
}
