import { Test, TestingModule } from "@nestjs/testing";
import { McProductService } from "./mc-product.service";

describe("McProductService", () => {
  let service: McProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McProductService]
    }).compile();

    service = module.get<McProductService>(McProductService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
