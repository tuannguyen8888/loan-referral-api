import { Test, TestingModule } from "@nestjs/testing";
import { PartnerLoanProfileService } from "./partner-loan-profile.service";

describe("PartnerLoanProfileService", () => {
  let service: PartnerLoanProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerLoanProfileService]
    }).compile();

    service = module.get<PartnerLoanProfileService>(PartnerLoanProfileService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
