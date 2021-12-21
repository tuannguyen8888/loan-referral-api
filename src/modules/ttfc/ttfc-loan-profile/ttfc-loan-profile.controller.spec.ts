import { Test, TestingModule } from "@nestjs/testing";
import { TtfcLoanProfileController } from "./ttfc-loan-profile.controller";

describe("TtfcLoanProfileController", () => {
  let controller: TtfcLoanProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TtfcLoanProfileController]
    }).compile();

    controller = module.get<TtfcLoanProfileController>(
      TtfcLoanProfileController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
