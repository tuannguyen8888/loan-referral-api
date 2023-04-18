import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined
} from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class AddressDto {
  @IsOptional()
  id?: number = null;
  @IsOptional()
  address_type?: string = null;
  @IsOptional()
  property_status?: string = null;
  @IsOptional()
  address_1st_line?: string = null;
  @IsOptional()
  country?: string = null;
  @IsOptional()
  city?: string = null;
  @IsOptional()
  district?: string = null;
  @IsOptional()
  ward?: string = null;
  @IsOptional()
  roomno?: string = null;
  @IsOptional()
  stayduratcuradd_y?: number = null;
  @IsOptional()
  stayduratcuradd_m?: number = null;
  @IsOptional()
  mailing_address?: string = null;
  @IsOptional()
  mobile?: string = null;
  @IsOptional()
  landlord?: string = null;
  @IsOptional()
  landmark?: string = null;
  @IsOptional()
  email?: string = null;
  @IsOptional()
  fixphone: string = null;

  @IsOptional()
  @IsDateString()
  created_at: string = null;
  created_by: string = null;
  @IsOptional()
  @IsDateString()
  updated_at?: string = null;
  @IsOptional()
  updated_by?: string = null;
  @IsOptional()
  @IsDateString()
  deleted_at?: string = null;
  @IsOptional()
  deleted_by?: string = null;
}
