import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put
} from "@nestjs/common";

import { ApiOperation } from "@nestjs/swagger";
import { McApiTrackingService } from "./mc-api-tracking.service";
import { McApiTrackingUpdateDto } from "./dto/mc-api-tracking.update.dto";
import { GetMCApiTrackingRequestDto } from "./dto/get-api-tracking.request.dto";
import { McApiTrackingsResponseDto } from "./dto/mc-api-trackings.response.dto";
import { McApiTrackingResponseDto } from "./dto/mc-api-tracking.response.dto";
import { McApiTrackingDto } from "./dto/mc-api-tracking.dto";

@Controller("mc-api-tracking")
export class McApiTrackingController {
  constructor(private readonly service: McApiTrackingService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh tracking" })
  getAllApiTrackings(
    @Headers() headers,
    @Body() dto: GetMCApiTrackingRequestDto
  ): Promise<McApiTrackingsResponseDto> {
    // console.log("Lấy danh sách sản phẩm");
    return this.service.getAllApiTrackings(dto);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Lấy chi tiết tracking" })
  getApiTracking(
    @Headers() headers,
    @Param() params
  ): Promise<McApiTrackingResponseDto> {
    return this.service.getApiTracking(params.id);
  }

  @Post("/")
  @ApiOperation({ summary: "Thêm tracking" })
  createApiTracking(
    @Headers() headers,
    @Body() dto: McApiTrackingDto
  ): Promise<McApiTrackingDto> {
    return this.service.createApiTracking(dto);
  }

  @Put("/")
  @ApiOperation({ summary: "Sửa sản phẩm" })
  updateApiTracking(
    @Headers() headers,
    @Body() dto: McApiTrackingUpdateDto
  ): Promise<McApiTrackingUpdateDto> {
    // console.log("Update ApiTracking");
    return this.service.updateApiTracking(dto);
  }
}
