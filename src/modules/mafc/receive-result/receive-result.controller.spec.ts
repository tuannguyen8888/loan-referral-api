import { Test, TestingModule } from "@nestjs/testing";
import { ReceiveResultController } from "./receive-result.controller";

describe("ReceiveResultController", () => {
  let controller: ReceiveResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiveResultController]
    }).compile();

    controller = module.get<ReceiveResultController>(ReceiveResultController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
