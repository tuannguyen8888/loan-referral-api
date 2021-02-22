import { Module } from "@nestjs/common";
import { LoanProfileController } from "./loan-profile.controller";
import { LoanProfileService } from "./loan-profile.service";

@Module({
  controllers: [LoanProfileController],
  providers: [LoanProfileService]
})
export class LoanProfileModule {}
