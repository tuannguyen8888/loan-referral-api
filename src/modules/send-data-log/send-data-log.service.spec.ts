import { Test, TestingModule } from "@nestjs/testing";
import { SendDataLogService } from "./send-data-log.service";

describe("SendDataLogService", () => {
  let service: SendDataLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendDataLogService]
    }).compile();

    service = module.get<SendDataLogService>(SendDataLogService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
