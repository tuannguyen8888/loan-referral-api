import { Module } from '@nestjs/common';
import { PtfMasterDataController } from './ptf-master-data.controller';
import { PtfMasterDataService } from './ptf-master-data.service';

@Module({
  controllers: [PtfMasterDataController],
  providers: [PtfMasterDataService]
})
export class PtfMasterDataModule {}
