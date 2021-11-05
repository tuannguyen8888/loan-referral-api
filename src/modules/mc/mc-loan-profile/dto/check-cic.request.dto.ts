import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDefined,
  Min,
  Max,
  IsNumberString
} from "class-validator";

export class CheckCICRequestDto {
  @IsNumberString()
  citizenId: string;

  @IsString()
  customerName: string;
}
