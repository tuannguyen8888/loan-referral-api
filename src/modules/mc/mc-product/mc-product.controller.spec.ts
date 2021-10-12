import { Test, TestingModule } from '@nestjs/testing';
import { McProductController } from './mc-product.controller';

describe('McProductController', () => {
  let controller: McProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McProductController],
    }).compile();

    controller = module.get<McProductController>(McProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
