import { Module } from "@nestjs/common";
import { VibIntroduceController } from "./vib-introduce.controller";
import { VibIntroduceService } from "./vib-introduce.service";

@Module({
  controllers: [VibIntroduceController],
  providers: [VibIntroduceService]
})
export class VibIntroduceModule {}
