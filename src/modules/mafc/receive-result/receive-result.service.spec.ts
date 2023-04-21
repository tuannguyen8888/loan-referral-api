import { Test, TestingModule } from "@nestjs/testing";
import { ReceiveResultService } from "./receive-result.service";

describe("ReceiveResultService", () => {
  let service: ReceiveResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveResultService]
    }).compile();

    service = module.get<ReceiveResultService>(ReceiveResultService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
