import { Test, TestingModule } from '@nestjs/testing';
import { SaleGroupService } from './sale-group.service';

describe('SaleGroupService', () => {
  let service: SaleGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleGroupService],
    }).compile();

    service = module.get<SaleGroupService>(SaleGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
