import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDateString
} from "class-validator";
import {ProcessDto} from "src/modules/mafc/loan-profile/dto";
import {} from "./index";

export class McCategoryResponseDto {
    id: number = null;
    compName: string = null;
    catType: string = null;
    compAddrStreet: string = null;
    officeNumber: string = null;
    companyTaxNumber: string = null;
}
