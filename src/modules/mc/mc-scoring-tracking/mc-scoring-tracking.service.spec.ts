import { Test, TestingModule } from "@nestjs/testing";
import { McScoringTrackingService } from "./mc-scoring-tracking.service";

describe("McScoringTrackingService", () => {
  let service: McScoringTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McScoringTrackingService]
    }).compile();

    service = module.get<McScoringTrackingService>(McScoringTrackingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
