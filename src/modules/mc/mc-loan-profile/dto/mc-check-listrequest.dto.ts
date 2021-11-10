import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min,
  Max,
  IsNumberString
} from "class-validator";

export class McCheckListrequestDto {
  mobileSchemaProductCode: string;
  mobileTemResidence: number;
  loanAmountAfterInsurrance: number;
  shopCode: string;
  @IsOptional()
  customerName: string;
  @IsOptional()
  citizenId: string;
  @IsOptional()
  loanTenor: number = null;
  @IsOptional()
  hasInsurance: number = null;
  @IsOptional()
  companyTaxNumber: string = null;
  @IsOptional()
  mobileProductType: string = null;
  @IsOptional()
  mobileIssueDateCitizen: string = null;
  @IsOptional()
  hasCourier: number = null;
}
