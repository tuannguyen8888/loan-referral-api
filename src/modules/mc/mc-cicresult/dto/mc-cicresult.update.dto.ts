import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined,
  Matches
} from "class-validator";

export class McCicresultUpdateDto {
  @IsDefined()
  id: number = null;
  requestId: string = null;
  identifier: string = null;
  customerName: string = null;
  cicResult: number = null;
  description: string = null;
  cicImageLink: string = null;
  lastUpdateTime: Date = null;
  status: string = null;
  numberOfRelationOrganize: string = null;

  @IsOptional()
  @IsDateString()
  updatedAt: string = null;
  updatedBy: string = null;

  @IsOptional()
  @IsDateString()
  deletedAt: string = null;
  deletedBy: string = null;
}
