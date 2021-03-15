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
  id?: number = null;
  address_type: string = null;
  property_status: string = null;
  address_1st_line: string = null;
  country: string = null;
  city: string = null;
  district: string = null;
  ward: string = null;
  roomno: string = null;
  stayduratcuradd_y: number = null;
  stayduratcuradd_m: number = null;
  mailing_address: string = null;
  mobile: string = null;
  landlord: string = null;
  landmark: string = null;
  email: string = null;
  fixphone: string = null;

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
