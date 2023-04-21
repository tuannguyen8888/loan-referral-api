import { Test, TestingModule } from "@nestjs/testing";
import { LoanProfileService } from "./loan-profile.service";

describe("LoanProfileService", () => {
  let service: LoanProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanProfileService]
    }).compile();

    service = module.get<LoanProfileService>(LoanProfileService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
