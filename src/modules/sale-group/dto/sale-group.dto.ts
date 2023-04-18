import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined
} from "class-validator";

export class SaleGroupDto {
  id?: number = null;
  @IsString()
  @IsNotEmpty()
  email: string = null;
  name?: string = null;
  parent: number = null;
  tree_path: string = null;
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
