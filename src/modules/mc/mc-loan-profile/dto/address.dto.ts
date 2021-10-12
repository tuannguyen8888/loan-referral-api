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
  addressType?: string = null;
  @IsOptional()
  houseNumberAndStreet?: string = null;
  @IsOptional()
  cityId?: number = null;
  @IsOptional()
  districtId?: number = null;
  @IsOptional()
  wardId?: number = null;
  @IsOptional()
  @IsDateString()
  createdAt: string = null;
  createdBy: string = null;
  @IsOptional()
  @IsDateString()
  updatedAt?: string = null;
  @IsOptional()
  updatedBy?: string = null;
  @IsOptional()
  @IsDateString()
  deletedAt?: string = null;
  @IsOptional()
  deletedBy?: string = null;
}
