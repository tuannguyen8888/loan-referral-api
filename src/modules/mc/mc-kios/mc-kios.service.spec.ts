import { Test, TestingModule } from "@nestjs/testing";
import { McKiosService } from "./mc-kios.service";

describe("McKiosService", () => {
  let service: McKiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McKiosService]
    }).compile();

    service = module.get<McKiosService>(McKiosService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
