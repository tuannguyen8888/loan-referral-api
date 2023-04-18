import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined,
  Matches
} from "class-validator";

export class McAttachfileDeleteDto {
  id: number = null;
  deletedBy: string = null;
}
