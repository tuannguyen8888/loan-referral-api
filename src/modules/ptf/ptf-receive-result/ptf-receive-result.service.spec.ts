import { Test, TestingModule } from "@nestjs/testing";
import { PtfReceiveResultService } from "./ptf-receive-result.service";

describe("PtfReceiveResultService", () => {
  let service: PtfReceiveResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PtfReceiveResultService]
    }).compile();

    service = module.get<PtfReceiveResultService>(PtfReceiveResultService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
