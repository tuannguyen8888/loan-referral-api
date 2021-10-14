import { Test, TestingModule } from '@nestjs/testing';
import { McCaseNoteController } from './mc-case-note.controller';

describe('McCaseNoteController', () => {
  let controller: McCaseNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McCaseNoteController],
    }).compile();

    controller = module.get<McCaseNoteController>(McCaseNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
