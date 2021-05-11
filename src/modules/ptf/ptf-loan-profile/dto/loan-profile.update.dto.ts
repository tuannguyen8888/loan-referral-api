import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined
} from "class-validator";
import { ProcessDto } from "src/modules/loan-profile/dto";
import {
  AddressDto,
  AttachFileDto,
  EmploymentInformationDto,
  RelatedPersonDto
} from "./index";

export class LoanProfileUpdateDto {
  @IsDefined()
  id: number = null;
  @IsDefined()
  partnerId: number = null;
  loanApplicationId?: string = null;
  loanPublicId?: string = null;
  @IsNotEmpty()
  fvStatus: string = null;
  @IsOptional()
  loanStatus: string = null;
  @IsNotEmpty()
  firstName: string = null;
  middleName: string = null;
  @IsNotEmpty()
  lastName: string = null;
  @IsNotEmpty()
  gender: number = null;
  birthDate: string = null;
  @IsNotEmpty()
  idDocumentNumber: string = null;
  @IsNotEmpty()
  idIssueDate: string = null;
  @IsDefined()
  idIssueCity: number = null;
  frbDocumentNumber: string = null;
  @IsNotEmpty()
  primaryMobile: string = null;
  homePhone: string = null;
  secondaryMobile: string = null;
  email: string = null;
  @IsDefined()
  socialAccountType: number = null;
  socialAccountDetails: string = null;
  @IsDefined()
  maritalStatus: number = null;
  @IsDefined()
  accompanimentOfClient: number = null;
  @IsDefined()
  numberOfChildren: number = null;
  @IsDefined()
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
  stateCode: string = null;
  @IsDefined()
  amount: number = null;
  @IsDefined()
  loanPurpose: number = null;
  loanTerm: string = null;

  @IsNotEmpty()
  @IsDateString()
  createdAt: string = null;
  @IsNotEmpty()
  createdBy: string = null;

  @IsNotEmpty()
  @IsDateString()
  updatedAt: string = null;
  @IsNotEmpty()
  updatedBy: string = null;
  @IsOptional()
  @IsDateString()
  deletedAt: string = null;
  deletedBy: string = null;

  // process: ProcessDto[];
  // defers: LoanProfileDeferDto[];
}
