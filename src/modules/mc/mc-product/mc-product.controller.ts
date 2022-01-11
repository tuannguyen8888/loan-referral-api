import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { McLoanProfileService } from "../mc-loan-profile/mc-loan-profile.service";
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags
} from "@nestjs/swagger";

import { McProductService } from "./mc-product.service";
import { McProductRepository } from "../../../repositories";
import { GetMCCaseNoteRequestDto } from "../mc-case-note/dto/get-case-note.request.dto";
import { McCaseNotesResponseDto } from "../mc-case-note/dto/mc-case-notes.response.dto";
import { McCaseNoteResponseDto } from "../mc-case-note/dto/mc-case-note.response.dto";
import { McCaseNoteDto } from "../mc-case-note/dto/mc-case-note.dto";
import { McCaseNoteUpdateDto } from "../mc-case-note/dto/mc-case-note.update.dto";
import { GetMCProductRequestDto } from "./dto/get-product.request.dto";
import { McProductsResponseDto } from "./dto/mc-products.response.dto";
import { McProductResponseDto } from "./dto/mc-product.response.dto";
import { McProductDto } from "./dto/mc-product.dto";
import { McProductUpdateDto } from "./dto/mc-product.update.dto";

@Controller("mc-product")
export class McProductController {
  constructor(private readonly service: McProductService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh sách sản phẩm" })
  getProducts(@Headers() headers): Promise<McProductRepository> {
    console.log("Lấy danh sách product");
    return this.service.getProducts();
  }
  @Get("/all")
  @ApiOperation({ summary: "Lấy danh sách sản phẩm" })
  getAllProducts(
    @Headers() headers,
    @Body() dto: GetMCProductRequestDto
  ): Promise<McProductsResponseDto> {
    console.log("Lấy danh sách sản phẩm");
    return this.service.getAllProducts(dto);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Lấy chi tiết Case Note" })
  getProduct(
    @Headers() headers,
    @Param() params
  ): Promise<McProductResponseDto> {
    return this.service.getProduct(params.id);
  }

  @Post("/")
  @ApiOperation({ summary: "Thêm sản phẩm" })
  createProduct(@Headers() headers, @Body() dto: McProductDto): Promise<any> {
    return this.service.createProduct(dto);
  }

  @Put("/")
  @ApiOperation({ summary: "Sửa sản phẩm" })
  updateProduct(
    @Headers() headers,
    @Body() dto: McProductUpdateDto
  ): Promise<McProductUpdateDto> {
    console.log("Update Product");
    return this.service.updateProduct(dto);
  }
}
