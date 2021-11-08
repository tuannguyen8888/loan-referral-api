import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDateString,
    Matches
} from "class-validator";

import {
    AttachFileDto,
    AddressDto,
    EmploymentInformationDto,
    RelatedPersonDto
} from ".";

export class McLoanProfileDto {
    @IsOptional()
    id?: number = null;
    citizenId: string = null;
    customerName: string = null;
    gender: string = null;
    address: string = null;
    compName: string = null;
    catType: string = null;
    compAddrStreet: string = null;
    officeNumber: string = null;
    companyTaxNumber: string = null;
    saleCode: string = null;
    productId: number = null;
    productCategoryId: string = null;
    productCode: string = null;
    productName: string = null;
    tempResidence: number = null;
    loanAmount: number = null;
    loanTenor: number = null;
    hasInsurance: number = null;
    issuePlace: string = null;
    shopCode: string = null;
    kiosid: number = null;
    mobileProductType: string = null;
    mobileIssueDateCitizen: string = null;
    appNumber: number = null;
    profileid: number = null;
    appid: string = null;
    cicResult: number = null;
    cicDescription: string = null;
    hasCourier: number = null;
    status: string = null;
    bpmStatus: string = null;
    dateOfBirth: string = null;
    customerIncome: number = null;
    checkcontract: string = null;
    checkcontractdes: string = null;
    verifyInfo: string = null;
    verifyDes: string = null;
    reasons: string = null;
    pdfFiles: string = null;

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
