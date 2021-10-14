import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined,
  Matches
} from "class-validator";

export class McCaseNoteUpdateDto {
  @IsDefined()
  id: number = null;
  appNumber: number = null;
  app_uid: string = null;
  note_content:string = null;
  note_date: string = null;
  usr_uid: string = null;

  @IsOptional()
  @IsDateString()
  updatedAt: string = null;
  updatedBy: string = null;

  @IsOptional()
  @IsDateString()
  deletedAt: string = null;
  deletedBy: string = null;
}
