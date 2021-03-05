import { Body, Controller, Headers, Post } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiBody } from "@nestjs/swagger";
import { ReceiveResultService } from "./receive-result.service";
import {
  UploadDeferRequestDto,
  UploadDeferReponseDto,
  UploadStatusF1RequestDto,
  UploadStatusF1ReponseDto
} from "./dto";

@Controller("receive-result")
@ApiTags("Receive Result from MAFC")
export class ReceiveResultController {
  constructor(private readonly service: ReceiveResultService) {}

  @Post("/uploadDefer")
  @ApiOperation({ summary: "Nhận defer của hồ sơ vay do MAFC push qua" })
  receiveDefer(
    @Headers() headers,
    @Body() dto: UploadDeferRequestDto
  ): Promise<UploadDeferReponseDto> {
    return this.service.receiveDefer(dto);
  }

  @Post("/uploadStatusF1")
  @ApiOperation({ summary: "Nhận status của hồ sơ vay do MAFC push qua" })
  @ApiBody({ type: [UploadStatusF1RequestDto] })
  receiveStatus(
    @Headers() headers,
    @Body() dtos: UploadStatusF1RequestDto[]
  ): Promise<UploadStatusF1ReponseDto[]> {
    return this.service.receiveStatus(dtos);
  }
}
