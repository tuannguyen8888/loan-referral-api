import { Module } from "@nestjs/common";
import { TtfcLoanProfileController } from "./ttfc-loan-profile.controller";
import { TtfcLoanProfileService } from "./ttfc-loan-profile.service";

@Module({
  controllers: [TtfcLoanProfileController],
  providers: [TtfcLoanProfileService]
})
export class TtfcLoanProfileModule {}
