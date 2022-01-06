import { IsString, IsNumber, IsOptional, IsDefined } from "class-validator";

export class GetMCProductRequestDto {
  // @IsNumber()
  // @IsOptional()
  // partner_id?: number;
  @IsOptional()
  productid:number;
  @IsOptional()
  keyword: string;
  @IsOptional()
  user_id: string;
}
