import { Test, TestingModule } from "@nestjs/testing";
import { PtfLoanProfileService } from "./ptf-loan-profile.service";

describe("PtfLoanProfileService", () => {
  let service: PtfLoanProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PtfLoanProfileService]
    }).compile();

    service = module.get<PtfLoanProfileService>(PtfLoanProfileService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
