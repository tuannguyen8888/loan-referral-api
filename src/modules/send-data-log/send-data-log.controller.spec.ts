import { Test, TestingModule } from "@nestjs/testing";
import { SendDataLogController } from "./send-data-log.controller";

describe("SendDataLogController", () => {
  let controller: SendDataLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendDataLogController]
    }).compile();

    controller = module.get<SendDataLogController>(SendDataLogController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
