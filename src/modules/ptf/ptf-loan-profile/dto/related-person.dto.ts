import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined
} from "class-validator";

export class RelatedPersonDto {
  id?: number = null;
  @IsDefined()
  loanProfileId: number = null;
  relatedPersonType: number = null;
  familyName: string = null;
  @IsOptional()
  middleName: string = null;
  firstName: string = null;
  phone: string = null;
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
