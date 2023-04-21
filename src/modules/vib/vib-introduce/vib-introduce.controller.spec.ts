import { Test, TestingModule } from "@nestjs/testing";
import { VibIntroduceController } from "./vib-introduce.controller";

describe("VibIntroduceController", () => {
  let controller: VibIntroduceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VibIntroduceController]
    }).compile();

    controller = module.get<VibIntroduceController>(VibIntroduceController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
