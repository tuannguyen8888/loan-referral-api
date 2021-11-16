import { Module } from '@nestjs/common';
import { PartnerLoanProfileController } from './partner-loan-profile.controller';
import { PartnerLoanProfileService } from './partner-loan-profile.service';

@Module({
  controllers: [PartnerLoanProfileController],
  providers: [PartnerLoanProfileService]
})
export class PartnerLoanProfileModule {}
