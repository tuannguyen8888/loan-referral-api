import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  Matches
} from "class-validator";

export class McAttachfileDto {
  @IsOptional()
  id?: number = null;
  profileid: number = null;
  appId: string = null;
  appNumber: number = null;
  fileName: string = null;
  documentCode: string = null;
  mimeType: string = null;
  groupId: number = null;
  url: string = null;

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
