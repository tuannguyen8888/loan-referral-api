import { Test, TestingModule } from "@nestjs/testing";
import { McAttachfileService } from "./mc-attachfile.service";

describe("McAttachfileService", () => {
  let service: McAttachfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McAttachfileService]
    }).compile();

    service = module.get<McAttachfileService>(McAttachfileService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
