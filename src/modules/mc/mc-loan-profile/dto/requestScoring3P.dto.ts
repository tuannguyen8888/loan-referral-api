import { IsOptional } from "class-validator";

export class requestScoring3PDto {
  verificationCode: string;
  primaryPhone: string;
  nationalId: string;
  typeScore: string;
  @IsOptional()
  loanprofileid: number;
  user_id: string;
}
