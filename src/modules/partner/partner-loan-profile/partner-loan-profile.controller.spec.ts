import { Test, TestingModule } from "@nestjs/testing";
import { PartnerLoanProfileController } from "./partner-loan-profile.controller";

describe("PartnerLoanProfileController", () => {
  let controller: PartnerLoanProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerLoanProfileController]
    }).compile();

    controller = module.get<PartnerLoanProfileController>(
      PartnerLoanProfileController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
