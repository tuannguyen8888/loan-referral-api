import { Controller, Get, Headers, Param } from "@nestjs/common";
import { ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { MasterDataService } from "./master-data.service";

@Controller("master-data")
@ApiTags("Master data")
@ApiSecurity("api-key")
@ApiSecurity("checksum")
export class MasterDataController {
  constructor(private readonly service: MasterDataService) {}

  @Get("/get-banks")
  @ApiOperation({
    summary:
      "Dành cho Vendor/3rd system gọi để lấy thông tin ngân hàng của MAFC"
  })
  checkCustomerInfo(@Headers() headers, @Param() params): Promise<any> {
    return this.service.getBanks();
  }
  @Get("/get-schemes")
  @ApiOperation({
    summary: "Dành cho Vendor/3rd system gọi để lấy thông tin schemes của MAFC"
  })
  getSchemes(@Headers() headers, @Param() params): Promise<any> {
    return this.service.getSchemes();
  }
  @Get("/get-sale-office")
  @ApiOperation({
    summary:
      "Dành cho Vendor/3rd system gọi để lấy thông tin SaleOffice của MAFC"
  })
  getSaleOffice(@Headers() headers, @Param() params): Promise<any> {
    return this.service.getSaleOffice();
  }
  @Get("/get-sec-user")
  @ApiOperation({
    summary: "Dành cho Vendor/3rd system gọi để lấy thông tin user của MAFC"
  })
  getSecUser(@Headers() headers, @Param() params): Promise<any> {
    return this.service.getSecUser();
  }
  @Get("/get-city")
  @ApiOperation({
    summary: "Dành cho Vendor/3rd system gọi để lấy thông tin city của MAFC"
  })
  getCity(@Headers() headers, @Param() params): Promise<any> {
    return this.service.getCity();
  }
  @Get("/get-district")
  @ApiOperation({
    summary: "Dành cho Vendor/3rd system gọi để lấy thông tin district của MAFC"
  })
  getDistrict(@Headers() headers, @Param() params): Promise<any> {
    return this.service.getDistrict();
  }
  @Get("/get-ward")
  @ApiOperation({
    summary: "Dành cho Vendor/3rd system gọi để lấy thông tin ward của MAFC"
  })
  getWard(@Headers() headers, @Param() params): Promise<any> {
    return this.service.getWard();
  }
  @Get("/get-loan-category")
  @ApiOperation({
    summary: "Dành cho Vendor/3rd system gọi để lấy thông tin loan của MAFC"
  })
  getLoanCategory(@Headers() headers, @Param() params): Promise<any> {
    return this.service.getLoanCategory();
  }
}
