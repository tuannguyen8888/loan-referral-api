import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDateString
} from "class-validator";
import {ProcessDto} from "src/modules/loan-profile/dto";
import {AddressDto, AttachFileDto, EmploymentInformationDto, RelatedPersonDto} from "./index";

export class LoanProfileResponseDto {
    id: number = null;
    partnerId: number = null;
    loanApplicationId?: string = null;
    loanPublicId?: string = null;
    fvStatus: string = null;
    loanStatus: string = null;
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
    homePhone: string = null;
    secondaryMobile: string = null;
    email: string = null;
    socialAccountType: number = null;
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
    documentPhoto: AttachFileDto[] = null;
    currentAddress: AddressDto = null;
    currentAndPermanentSame: boolean = null;
    permanentAddress: AddressDto = null;
    relatedPersons: RelatedPersonDto[] = null;
    employmentInformation: EmploymentInformationDto = null;
    creditProduct: string = null;
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

    process: ProcessDto[];
    // defers: LoanProfileDeferDto[];
}
