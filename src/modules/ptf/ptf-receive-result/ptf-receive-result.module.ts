import { Module } from '@nestjs/common';
import { PtfReceiveResultController } from './ptf-receive-result.controller';
import { PtfReceiveResultService } from './ptf-receive-result.service';

@Module({
  controllers: [PtfReceiveResultController],
  providers: [PtfReceiveResultService]
})
export class PtfReceiveResultModule {}
