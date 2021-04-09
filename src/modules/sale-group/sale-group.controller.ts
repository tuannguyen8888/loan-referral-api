import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { SaleGroupService } from "./sale-group.service";
import { SaleGroupDto } from "./dto";
import { AttachFileDto } from "../loan-profile/dto/attach-file.dto";
import { LoanProfileDto } from "../loan-profile/dto";

@ApiTags("Sale Group")
@ApiSecurity("api-key")
@ApiSecurity("checksum")
@Controller("sale-group")
export class SaleGroupController {
  constructor(private readonly service: SaleGroupService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh sách sale group (dạng tree)" })
  @ApiBody({ type: [SaleGroupDto] })
  getLoanProfiles(@Headers() headers): Promise<SaleGroupDto[]> {
    return this.service.getAllSaleGroupTree();
  }
  @Post("/")
  @ApiOperation({ summary: "Thêm sale group vào tree" })
  addNewSaleGroup(
    @Headers() headers,
    @Body() dto: SaleGroupDto
  ): Promise<LoanProfileDto> {
    return this.service.addNewSaleGroup(dto);
  }
  @Put("/")
  @ApiOperation({ summary: "Sửa parent của sale group" })
  changeParrentSaleGroup(
    @Headers() headers,
    @Body() dto: SaleGroupDto
  ): Promise<LoanProfileDto> {
    return this.service.updateParrentSaleGroup(dto);
  }

  @Delete("/:id/:user_id")
  @ApiOperation({ summary: "Xóa sale group" })
  deleteSaleGroup(@Headers() headers, @Param() params): Promise<boolean> {
    return this.service.deleteSaleGroup(params.id, params.user_id);
  }
}
