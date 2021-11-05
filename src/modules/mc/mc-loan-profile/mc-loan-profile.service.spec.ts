import { Test, TestingModule } from "@nestjs/testing";
import { McLoanProfileService } from "./mc-loan-profile.service";

describe("McLoanProfileService", () => {
  let service: McLoanProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McLoanProfileService]
    }).compile();

    service = module.get<McLoanProfileService>(McLoanProfileService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
