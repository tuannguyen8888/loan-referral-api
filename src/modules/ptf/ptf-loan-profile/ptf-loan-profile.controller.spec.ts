import { Test, TestingModule } from "@nestjs/testing";
import { PtfLoanProfileController } from "./ptf-loan-profile.controller";

describe("PtfLoanProfileController", () => {
  let controller: PtfLoanProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PtfLoanProfileController]
    }).compile();

    controller = module.get<PtfLoanProfileController>(PtfLoanProfileController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
