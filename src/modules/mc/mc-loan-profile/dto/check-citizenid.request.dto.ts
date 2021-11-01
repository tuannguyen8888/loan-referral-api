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

export class CheckCitizenidRequestDto {
  @IsNumberString()
  citizenId: string;
}
