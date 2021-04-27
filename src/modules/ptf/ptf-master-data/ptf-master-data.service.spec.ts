import { Test, TestingModule } from '@nestjs/testing';
import { PtfMasterDataService } from './ptf-master-data.service';

describe('PtfMasterDataService', () => {
  let service: PtfMasterDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PtfMasterDataService],
    }).compile();

    service = module.get<PtfMasterDataService>(PtfMasterDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
