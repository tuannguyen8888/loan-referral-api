import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { VibIntroduceService } from "./vib-introduce.service";
import { ApiOperation } from "@nestjs/swagger";
import { GetVibIntroduceRequestDto } from "./dto/get-introduce.request.dto";
import { VibIntroducesResponseDto } from "./dto/vib-introduces.response.dto";
import { VibIntroduceResponseDto } from "./dto/vib-introduce.response.dto";
import { VibIntroduceDto } from "./dto/vib-introduce.dto";
import { VibIntroduceUpdateDto } from "./dto/vib-introduce.update.dto";
import { VibIntroduceUpdateCommissionDto } from "./dto/vib-introduce.update.commission.dto";

@Controller("vib-introduce")
export class VibIntroduceController {
  constructor(private readonly service: VibIntroduceService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh sách Giới thiệu" })
  getAllIntroduce(
    @Headers() headers,
    @Body() dto: GetVibIntroduceRequestDto
  ): Promise<VibIntroducesResponseDto> {
    console.log("Lấy danh sách giới thiệu");
    return this.service.getAllIntroduces(dto);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Lấy chi tiết Case Note" })
  getIntroduce(
    @Headers() headers,
    @Param() params
  ): Promise<VibIntroduceResponseDto> {
    return this.service.getVibIntroduce(params.id);
  }

  @Post("/")
  @ApiOperation({ summary: "Thêm giới thiệu" })
  createIntroduce(
    @Headers() headers,
    @Body() dto: VibIntroduceDto
  ): Promise<VibIntroduceResponseDto> {
    return this.service.createIntroduce(dto);
  }

  @Put("/")
  @ApiOperation({ summary: "Sửa giới thiệu" })
  updateIntroduce(
    @Headers() headers,
    @Body() dto: VibIntroduceUpdateDto
  ): Promise<VibIntroduceUpdateDto> {
    return this.service.updateVibIntroduce(dto);
  }
  @Put("/updateCommission")
  @ApiOperation({ summary: "Cập nhật hoa hồng" })
  updateIntroduceCommission(
    @Headers() headers,
    @Body() dto: VibIntroduceUpdateCommissionDto
  ): Promise<VibIntroduceUpdateDto> {
    return this.service.updateVibIntroduceCommission(dto);
  }
}
