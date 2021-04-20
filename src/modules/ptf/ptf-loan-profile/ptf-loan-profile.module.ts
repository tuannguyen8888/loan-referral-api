import { Module } from '@nestjs/common';
import { PtfLoanProfileController } from './ptf-loan-profile.controller';
import { PtfLoanProfileService } from './ptf-loan-profile.service';

@Module({
  controllers: [PtfLoanProfileController],
  providers: [PtfLoanProfileService]
})
export class PtfLoanProfileModule {}
