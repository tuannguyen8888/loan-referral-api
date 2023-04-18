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
import { McScoringTrackingService } from "./mc-scoring-tracking.service";
import { McScoringTrackingUpdateDto } from "./dto/mc-scoring-tracking.update.dto";
import { GetMCScoringTrackingRequestDto } from "./dto/get-scoring-tracking.request.dto";
import { McScoringTrackingsResponseDto } from "./dto/mc-scoring-trackings.response.dto";
import { McScoringTrackingResponseDto } from "./dto/mc-scoring-tracking.response.dto";
import { McScoringTrackingDto } from "./dto/mc-scoring-tracking.dto";

@Controller("mc-scoring-tracking")
export class McScoringTrackingController {
  constructor(private readonly service: McScoringTrackingService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh tracking" })
  getAllScoringTrackings(
    @Headers() headers,
    @Body() dto: GetMCScoringTrackingRequestDto
  ): Promise<McScoringTrackingsResponseDto> {
    // console.log("Lấy danh sách sản phẩm");
    return this.service.getAllScoringTrackings(dto);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Lấy chi tiết tracking" })
  getScoringTracking(
    @Headers() headers,
    @Param() params
  ): Promise<McScoringTrackingResponseDto> {
    return this.service.getScoringTracking(params.id);
  }

  @Post("/")
  @ApiOperation({ summary: "Thêm tracking" })
  createScoringTracking(
    @Headers() headers,
    @Body() dto: McScoringTrackingDto
  ): Promise<McScoringTrackingDto> {
    return this.service.createScoringTracking(dto);
  }

  @Put("/")
  @ApiOperation({ summary: "Sửa sản phẩm" })
  updateScoringTracking(
    @Headers() headers,
    @Body() dto: McScoringTrackingUpdateDto
  ): Promise<McScoringTrackingUpdateDto> {
    // console.log("Update ScoringTracking");
    return this.service.updateScoringTracking(dto);
  }
}
