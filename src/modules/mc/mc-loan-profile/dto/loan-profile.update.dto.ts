import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined,
  Matches
} from "class-validator";
import { ProcessDto } from "src/modules/mafc/loan-profile/dto";
import {
  AddressDto,
  AttachFileDto,
  EmploymentInformationDto,
  RelatedPersonDto
} from "./index";

export class LoanProfileUpdateDto {
  @IsDefined()
  id: number = null;
  citizenId: string = null;
  customerName: string = null;
  gender: number = null;
  address: string = null;
  compName: string = null;
  catType: string = null;
  compAddrStreet: string = null;
  officeNumber: string = null;
  companyTaxNumber: string = null;
  saleCode: string = null;
  productId: number = null;
  tempResidence: number = null;
  loanAmount: number = null;
  loanTenor: number = null;
  hasInsurance: number = null;
  issuePlace: string = null;
  shopCode: string = null;
  kiosid: number = null;
  mobileProductType: string = null;
  mobileIssueDateCitizen: string = null;

  @IsOptional()
  @IsDateString()
  updatedAt: string = null;
  updatedBy: string = null;

  @IsOptional()
  @IsDateString()
  deletedAt: string = null;
  deletedBy: string = null;

  // process: ProcessDto[];
  // defers: LoanProfileDeferDto[];
}
