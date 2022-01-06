import { Test, TestingModule } from "@nestjs/testing";
import { McScoringTrackingController } from "./mc-scoring-tracking.controller";

describe("McScoringTrackingController", () => {
  let controller: McScoringTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McScoringTrackingController]
    }).compile();

    controller = module.get<McScoringTrackingController>(
      McScoringTrackingController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
