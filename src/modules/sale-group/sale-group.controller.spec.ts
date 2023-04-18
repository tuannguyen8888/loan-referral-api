import { Test, TestingModule } from "@nestjs/testing";
import { SaleGroupController } from "./sale-group.controller";

describe("SaleGroupController", () => {
  let controller: SaleGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleGroupController]
    }).compile();

    controller = module.get<SaleGroupController>(SaleGroupController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
