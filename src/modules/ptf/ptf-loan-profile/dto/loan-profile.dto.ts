import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString
} from "class-validator";
import { ProcessDto } from "src/modules/mafc/loan-profile/dto";
import {
  AttachFileDto,
  AddressDto,
  EmploymentInformationDto,
  RelatedPersonDto
} from ".";

export class LoanProfileDto {
  @IsOptional()
  id?: number = null;
  @IsOptional()
  partnerId?: number = null;
  @IsOptional()
  loanApplicationId?: string = null;
  @IsOptional()
  loanPublicId?: string = null;
  @IsOptional()
  fvStatus?: string = null;
  @IsOptional()
  loanStatus?: string = null;
  firstName: string = null;
  middleName: string = null;
  lastName: string = null;
  gender: number = null;
  birthDate: string = null;
  idDocumentNumber: string = null;
  idIssueDate: string = null;
  idIssueCity: number = null;
  frbDocumentNumber: string = null;
  primaryMobile: string = null;
  @IsOptional()
  homePhone: string = null;
  @IsOptional()
  secondaryMobile: string = null;
  @IsOptional()
  email: string = null;
  @IsOptional()
  socialAccountType: number = null;
  @IsOptional()
  socialAccountDetails: string = null;
  maritalStatus: number = null;
  accompanimentOfClient: number = null;
  numberOfChildren: number = null;
  education: number = null;
  disbursementMethod: number = null;
  accountNumber: string = null;
  bankNameId: number = null;
  bankCityId: number = null;
  bankBranchId: number = null;
  bankCode: string = null;
  serviceName: number = null;
  iCareLead: number = null;
  creationDate: Date = null;
  clientPhotoUrl: string = null;
  // documentPhoto: AttachFileDto[] = null;
  currentAddress: AddressDto = null;
  currentAndPermanentSame: boolean = null;
  permanentAddress: AddressDto = null;
  relatedPersons: RelatedPersonDto[] = null;
  employmentInformation: EmploymentInformationDto = null;
  creditProduct: string = null;
  @IsOptional()
  stateCode: string = null;
  amount: number = null;
  loanPurpose: number = null;
  loanTerm: string = null;

  @IsOptional()
  @IsDateString()
  createdAt: string = null;
  createdBy: string = null;
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
