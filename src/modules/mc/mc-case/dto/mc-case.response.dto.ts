import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString
} from "class-validator";
import { ProcessDto } from "src/modules/mafc/loan-profile/dto";


export class McCaseResponseDto {
  id: number = null;
  appNumber: number = null;
  creditAppId: number = null;
  createdDate: string = null;
  customerName: string = null;
  citizenId: string = null;
  productName: string = null;
  loanAmount: number = null;
  loanTenor: number = null;
  hasInsurance: number = null;
  tempResidence: number = null;
  kioskAddress: string = null;
  bpmStatus: string = null;
  reasonsid: number = null;
  reason: string = null;
  reasonDetail: string = null;
  userComment: string = null;
  pdfFilesid: number = null;
  pdfCreatedDate: string = null;
  remotePathServer: string = null;
  fileName: string = null;

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
}
