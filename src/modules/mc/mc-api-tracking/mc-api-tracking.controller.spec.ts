import { Test, TestingModule } from "@nestjs/testing";
import { McApiTrackingController } from "./mc-api-tracking.controller";

describe("McApiTrackingController", () => {
  let controller: McApiTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McApiTrackingController]
    }).compile();

    controller = module.get<McApiTrackingController>(McApiTrackingController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
