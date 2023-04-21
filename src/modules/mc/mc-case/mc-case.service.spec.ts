import { Test, TestingModule } from "@nestjs/testing";
import { McCaseService } from "./mc-case.service";

describe("McCaseService", () => {
  let service: McCaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McCaseService]
    }).compile();

    service = module.get<McCaseService>(McCaseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
