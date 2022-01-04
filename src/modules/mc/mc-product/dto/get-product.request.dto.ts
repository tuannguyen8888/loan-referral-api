import { IsString, IsNumber, IsOptional, IsDefined } from "class-validator";

export class GetMCProductRequestDto {
  // @IsNumber()
  // @IsOptional()
  // partner_id?: number;

  @IsOptional()
  keyword: string;
  user_id: string;
}
