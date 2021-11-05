import { Test, TestingModule } from "@nestjs/testing";
import { McAttachfileController } from "./mc-attachfile.controller";

describe("McAttachfileController", () => {
  let controller: McAttachfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McAttachfileController]
    }).compile();

    controller = module.get<McAttachfileController>(McAttachfileController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
