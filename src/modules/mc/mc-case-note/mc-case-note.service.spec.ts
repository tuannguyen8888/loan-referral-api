import { Test, TestingModule } from "@nestjs/testing";
import { McCaseNoteService } from "./mc-case-note.service";

describe("McCaseNoteService", () => {
  let service: McCaseNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McCaseNoteService]
    }).compile();

    service = module.get<McCaseNoteService>(McCaseNoteService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
