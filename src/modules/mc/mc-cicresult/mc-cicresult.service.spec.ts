import { Test, TestingModule } from "@nestjs/testing";
import { McCicresultService } from "./mc-cicresult.service";

describe("McCicresultService", () => {
  let service: McCicresultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McCicresultService]
    }).compile();

    service = module.get<McCicresultService>(McCicresultService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
