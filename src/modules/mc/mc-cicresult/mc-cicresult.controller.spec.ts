import { Test, TestingModule } from "@nestjs/testing";
import { McCicresultController } from "./mc-cicresult.controller";

describe("McCicresultController", () => {
  let controller: McCicresultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McCicresultController]
    }).compile();

    controller = module.get<McCicresultController>(McCicresultController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
