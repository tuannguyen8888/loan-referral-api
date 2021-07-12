import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDateString,
    IsDefined, IsUrl, Matches
} from "class-validator";

export class AttachFileDto {
  id?: number = null;
  @IsDefined()
  loanProfileId: number = null;
  type: string = null;
  @Matches(/http[\s\S]*.[jpg,jpeg,png,pdf]/,{message: 'url invalid'})
  url: string = null;
  @IsOptional()
  @IsDateString()
  createdAt: string = null;
  createdBy: string = null;
  @IsOptional()
  @IsDateString()
  updatedAt?: string = null;
  updatedBy?: string = null;
  @IsOptional()
  @IsDateString()
  deletedAt?: string = null;
  deletedBy?: string = null;
}
