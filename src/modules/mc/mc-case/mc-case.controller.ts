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
import { McCaseService } from "./mc-case.service";
import { GetMCCaseRequestDto } from "./dto/get-case.request.dto";
import { McCasesResponseDto } from "./dto/mc-cases.response.dto";
import { McCicresultResponseDto } from "../mc-cicresult/dto/mc-cicresult.response.dto";
import { McCicresultDto } from "../mc-cicresult/dto/mc-cicresult.dto";
import { McCicresultUpdateDto } from "../mc-cicresult/dto/mc-cicresult.update.dto";
import { McCaseResponseDto } from "./dto/mc-case.response.dto";
import { McCaseDto } from "./dto/mc-case.dto";
import { McCaseUpdateDto } from "./dto/mc-case.update.dto";

@Controller("mc-case")
export class McCaseController {
  constructor(private readonly service: McCaseService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh sách Case" })
  getAllCases(
    @Headers() headers,
    @Body() dto: GetMCCaseRequestDto
  ): Promise<McCasesResponseDto> {
    console.log("Lấy danh sách Case");
    return this.service.getAllCases(dto);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Lấy chi tiết Case" })
  getCase(@Headers() headers, @Param() params): Promise<McCaseResponseDto> {
    return this.service.getCase(params.id);
  }

  @Post("/")
  @ApiOperation({ summary: "Thêm Cic Result" })
  createCase(@Headers() headers, @Body() dto: McCaseDto): Promise<McCaseDto> {
    return this.service.createCase(dto);
  }

  @Put("/")
  @ApiOperation({ summary: "Sửa thông tin hồ sơ vay" })
  updateLoanProfile(
    @Headers() headers,
    @Body() dto: McCaseUpdateDto
  ): Promise<McCaseUpdateDto> {
    return this.service.updateCicResult(dto);
  }
}
