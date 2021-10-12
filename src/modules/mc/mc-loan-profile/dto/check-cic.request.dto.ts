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
  citizenID: string;

  @IsString()
  customerName: string;
}
