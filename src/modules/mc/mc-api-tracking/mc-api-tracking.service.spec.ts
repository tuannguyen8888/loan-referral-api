import { Test, TestingModule } from "@nestjs/testing";
import { McApiTrackingService } from "./mc-api-tracking.service";

describe("McApiTrackingService", () => {
  let service: McApiTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McApiTrackingService]
    }).compile();

    service = module.get<McApiTrackingService>(McApiTrackingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
