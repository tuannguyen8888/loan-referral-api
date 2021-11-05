import { Test, TestingModule } from "@nestjs/testing";
import { McCaseController } from "./mc-case.controller";

describe("McCaseController", () => {
  let controller: McCaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McCaseController]
    }).compile();

    controller = module.get<McCaseController>(McCaseController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
