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
  id?: number;
  address_type: string;
  property_status: string;
  address_1st_line: string;
  country: string;
  city: string;
  district: string;
  ward: string;
  roomno: string;
  stayduratcuradd_y: string;
  stayduratcuradd_m: string;
  mailing_address: string;
  mobile: string;
  landlord: string;
  landmark: string;
  email: string;
  fixphone: string;

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
