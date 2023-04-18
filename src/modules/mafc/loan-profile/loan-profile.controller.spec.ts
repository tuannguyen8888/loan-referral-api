import { Test, TestingModule } from "@nestjs/testing";
import { LoanProfileController } from "./loan-profile.controller";

describe("LoanProfileController", () => {
  let controller: LoanProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanProfileController]
    }).compile();

    controller = module.get<LoanProfileController>(LoanProfileController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
