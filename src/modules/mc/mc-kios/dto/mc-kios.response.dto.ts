import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString
} from "class-validator";
import { ProcessDto } from "src/modules/mafc/loan-profile/dto";
import {} from "./index";

export class McKiosResponseDto {
  id: number = null;
  kioskCode: string = null;
  kioskAddress: string = null;
  kioskProvince: number = null;
}
