import { IsDateString, IsOptional } from "class-validator";

export class LoanStatusDto {
  id: number = null;
  code: string = null;
  name: string = null;
}
