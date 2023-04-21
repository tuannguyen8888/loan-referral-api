import { Test, TestingModule } from "@nestjs/testing";
import { McKiosController } from "./mc-kios.controller";

describe("McKiosController", () => {
  let controller: McKiosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McKiosController]
    }).compile();

    controller = module.get<McKiosController>(McKiosController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
