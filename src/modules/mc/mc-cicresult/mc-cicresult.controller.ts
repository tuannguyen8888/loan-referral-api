import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags
} from "@nestjs/swagger";
import { McCicresultService } from "./mc-cicresult.service";
import { McCicresultDto } from "./dto/mc-cicresult.dto";
import { McCicresultUpdateDto } from "./dto/mc-cicresult.update.dto";
import { GetMCCicResultRequestDto } from "./dto/get-cicresult.request.dto";
import { McCicresultsResponseDto } from "./dto/mc-cicresults.response.dto";
import { McCicresultResponseDto } from "./dto/mc-cicresult.response.dto";
@Controller("mc-cicresult")
export class McCicresultController {
  constructor(private readonly service: McCicresultService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh sách Cic result" })
  getAllCicResults(
    @Headers() headers,
    @Body() dto: GetMCCicResultRequestDto
  ): Promise<McCicresultsResponseDto> {
    // console.log("Lấy danh sách Cic result");
    return this.service.getAllCicResults(dto);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Lấy chi tiết Cic result" })
  getCicResult(
    @Headers() headers,
    @Param() params
  ): Promise<McCicresultResponseDto> {
    return this.service.getCicResult(params.id);
  }

  @Post("/")
  @ApiOperation({ summary: "Thêm Cic Result" })
  createCicResult(
    @Headers() headers,
    @Body() dto: McCicresultDto
  ): Promise<McCicresultDto> {
    return this.service.createCicResult(dto);
  }

  @Put("/")
  @ApiOperation({ summary: "Sửa thông tin hồ sơ vay" })
  updateLoanProfile(
    @Headers() headers,
    @Body() dto: McCicresultUpdateDto
  ): Promise<McCicresultUpdateDto> {
    return this.service.updateCicResult(dto);
  }
}
