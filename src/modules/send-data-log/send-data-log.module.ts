import { Module } from '@nestjs/common';
import { SendDataLogController } from './send-data-log.controller';
import { SendDataLogService } from './send-data-log.service';

@Module({
  controllers: [SendDataLogController],
  providers: [SendDataLogService]
})
export class SendDataLogModule {}
