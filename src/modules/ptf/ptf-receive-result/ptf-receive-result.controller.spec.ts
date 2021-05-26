import { Test, TestingModule } from "@nestjs/testing";
import { PtfReceiveResultController } from "./ptf-receive-result.controller";

describe("PtfReceiveResultController", () => {
  let controller: PtfReceiveResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PtfReceiveResultController]
    }).compile();

    controller = module.get<PtfReceiveResultController>(
      PtfReceiveResultController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
