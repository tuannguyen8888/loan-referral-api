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
import { McAttachfileService } from "./mc-attachfile.service";
import { GetMCAttachfileRequestDto } from "./dto/mc-get-attachfile.request.dto";
import { McAttachfilesResponseDto } from "./dto/mc-attachfiles.response.dto";
import { McAttachfileResponseDto } from "./dto/mc-attachfile.response.dto";
import { McAttachfileDto } from "./dto/mc-attachfile.dto";
import { McAttachfileUpdateDto } from "./dto/mc-attachfile.update.dto";

@Controller("mc-attachfile")
export class McAttachfileController {
  constructor(private readonly service: McAttachfileService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh sách Attachfile" })
  getAllAttachfiles(
    @Headers() headers,
    @Body() dto: GetMCAttachfileRequestDto
  ): Promise<McAttachfilesResponseDto> {
    console.log("Lấy danh sách Attachfile");
    return this.service.getAllAttachfile(dto);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Lấy chi tiết Attachfile" })
  getAttachfile(
    @Headers() headers,
    @Param() params
  ): Promise<McAttachfileResponseDto> {
    return this.service.getAttachfile(params.id);
  }

  @Post("/")
  @ApiOperation({ summary: "Thêm Attachfile" })
  createAttachfile(
    @Headers() headers,
    @Body() dto: McAttachfileDto
  ): Promise<McAttachfileDto> {
    return this.service.createAttachfile(dto);
  }

  @Put("/")
  @ApiOperation({ summary: "Sửa Attachfile" })
  updateAttachfile(
    @Headers() headers,
    @Body() dto: McAttachfileUpdateDto
  ): Promise<McAttachfileUpdateDto> {
    return this.service.updateAttachfile(dto);
  }
}
