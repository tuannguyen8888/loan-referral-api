import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString
} from "class-validator";
import { ProcessDto } from "src/modules/mafc/loan-profile/dto";

export class McCaseNoteResponseDto {
  id: number = null;
  appNumber: number = null;
  app_uid: string = null;
  note_content: string = null;
  note_date: string = null;
  usr_uid: string = null;

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
