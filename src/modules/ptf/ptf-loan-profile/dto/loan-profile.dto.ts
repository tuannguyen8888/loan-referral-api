import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDateString
} from "class-validator";
import {ProcessDto} from "src/modules/loan-profile/dto";
import {AttachFileDto, AddressDto, EmploymentInformationDto, RelatedPersonDto} from ".";

export class LoanProfileDto {
    id: number = null;
    partnerId: number = null;
    loanNo: string = null;
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
    created_at: string = null;
    created_by: string = null;
    @IsOptional()
    @IsDateString()
    updated_at: string = null;
    updated_by: string = null;
    @IsOptional()
    @IsDateString()
    deleted_at: string = null;
    deleted_by: string = null;

    // process: ProcessDto[];
    // defers: LoanProfileDeferDto[];
}
