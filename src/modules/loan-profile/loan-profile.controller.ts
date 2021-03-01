import {
  Headers,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete
} from "@nestjs/common";
import { ApiTags, ApiSecurity, ApiOperation } from "@nestjs/swagger";
import { LoanProfileService } from "./loan-profile.service";
import {
  GetLoanProfilesRequestDto,
  LoanProfilesResponseDto,
  LoanProfileDto
} from "./dto";

@ApiTags("Loan profile")
@ApiSecurity("api-key")
@ApiSecurity("checksum")
@Controller("loan-profile")
export class LoanProfileController {
  constructor(private readonly service: LoanProfileService) {}

  @Get("/")
  @ApiOperation({summary: "Lấy danh sách hồ sơ vay"})
  getLoanProfiles(
    @Headers() headers,
    @Body() dto: GetLoanProfilesRequestDto
  ): Promise<LoanProfilesResponseDto> {
    return this.service.getAllLoanProfiles(dto);
  }

  @Get("/:loan_profile_id")
  @ApiOperation({summary: "Lấy chi tiết hồ sơ vay"})
  getLoanProfile(@Headers() headers, @Param() params): Promise<LoanProfileDto> {
    return this.service.getLoanProfile(params.loan_profile_id);
  }
  @Get("/check-customer-info/:search_val")
  @ApiOperation({summary: "Kiểm tra thông tin khách hàng"})
  checkCustomerInfo(@Headers() headers, @Param() params): Promise<any> {
      return this.service.checkCustomerInfo(params.search_val);
  }

    @Get("/checking-s37/:customer_national_id")
    @ApiOperation({summary: "Kiểm tra lịch sử tín dụng"})
    checkingS37(@Headers() headers, @Param() params): Promise<any> {
        return this.service.checkingS37(params.customer_national_id);
    }
    @Get("/polling-s37/:customer_national_id/:request_id")
    @ApiOperation({summary: "Lấy kết quả kiểm tra lịch sử tín dụng"})
    pollingS37(@Headers() headers, @Param() params): Promise<any> {
        return this.service.pollingS37(params.customer_national_id, params.request_id);
    }

  @Post("/")
  @ApiOperation({summary: "Tạo mới hồ sơ vay"})
  createLoanProfile(
    @Headers() headers,
    @Body() dto: LoanProfileDto
  ): Promise<LoanProfileDto> {
    return this.service.createLoanProfile(dto);
  }
  @Put("/")
  @ApiOperation({summary: "Sửa thông tin hồ sơ vay"})
  updateLoanProfile(
    @Headers() headers,
    @Body() dto: LoanProfileDto
  ): Promise<LoanProfileDto> {
    return this.service.updateLoanProfile(dto);
  }
  @Delete("/")
  @ApiOperation({summary: "Xóa hồ sơ vay"})
  deleteLoanProfile(
    @Headers() headers,
    @Body() dto: LoanProfileDto
  ): Promise<LoanProfileDto> {
    return this.service.deleteLoanProfile(dto);
  }
}
