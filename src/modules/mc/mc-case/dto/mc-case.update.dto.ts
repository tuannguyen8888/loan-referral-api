import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined,
  Matches
} from "class-validator";

export class McCaseUpdateDto {
  @IsDefined()
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
  checklist: string = null;
  reasons: string = null;
  pdfFiles: string = null;

  @IsOptional()
  @IsDateString()
  updatedAt: string = null;
  updatedBy: string = null;

  @IsOptional()
  @IsDateString()
  deletedAt: string = null;
  deletedBy: string = null;
}
