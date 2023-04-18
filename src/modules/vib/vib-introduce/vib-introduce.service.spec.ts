import { Test, TestingModule } from "@nestjs/testing";
import { VibIntroduceService } from "./vib-introduce.service";

describe("VibIntroduceService", () => {
  let service: VibIntroduceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VibIntroduceService]
    }).compile();

    service = module.get<VibIntroduceService>(VibIntroduceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
