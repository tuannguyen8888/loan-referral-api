import { Test, TestingModule } from "@nestjs/testing";
import { McLoanProfileController } from "./mc-loan-profile.controller";

describe("McLoanProfileController", () => {
  let controller: McLoanProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McLoanProfileController]
    }).compile();

    controller = module.get<McLoanProfileController>(McLoanProfileController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
