import { Test, TestingModule } from "@nestjs/testing";
import { PtfMasterDataController } from "./ptf-master-data.controller";

describe("PtfMasterDataController", () => {
  let controller: PtfMasterDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PtfMasterDataController]
    }).compile();

    controller = module.get<PtfMasterDataController>(PtfMasterDataController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
