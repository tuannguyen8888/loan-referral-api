import { Test, TestingModule } from "@nestjs/testing";
import { TtfcLoanProfileService } from "./ttfc-loan-profile.service";

describe("TtfcLoanProfileService", () => {
  let service: TtfcLoanProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtfcLoanProfileService]
    }).compile();

    service = module.get<TtfcLoanProfileService>(TtfcLoanProfileService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
