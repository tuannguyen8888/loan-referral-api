import { Test, TestingModule } from "@nestjs/testing";
import { McNotificationController } from "./mc-notification.controller";

describe("McNotificationController", () => {
  let controller: McNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McNotificationController]
    }).compile();

    controller = module.get<McNotificationController>(McNotificationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
