import { Body, Controller, Get, Headers } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { SendDataLogService } from "./send-data-log.service";
import {
  SearchSendDataLogDto,
  SendDataLogDto,
  SendDataLogsResponseDto
} from "./dto";

@ApiTags("Send Data Log")
@ApiSecurity("api-key")
@ApiSecurity("checksum")
@Controller("send-data-log")
export class SendDataLogController {
  constructor(private readonly service: SendDataLogService) {}

  @Get("/")
  getAll(
    @Headers() headers,
    @Body() dto: SearchSendDataLogDto
  ): Promise<SendDataLogsResponseDto> {
    return this.service.getAllSendDataLog(dto);
  }
}
