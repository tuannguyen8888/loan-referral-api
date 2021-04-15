import { CronService } from "./cron.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [CronService] // <--- this is important, you need to add GlobalService as a provider here
})
export class CronModule {}
