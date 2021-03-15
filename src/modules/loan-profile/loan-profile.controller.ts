import {
  Headers,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpCode
} from "@nestjs/common";
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiBody,
  ApiResponse
} from "@nestjs/swagger";
import { LoanProfileService } from "./loan-profile.service";
import {
  GetLoanProfilesRequestDto,
  LoanProfilesResponseDto,
  LoanProfileDto,
  CheckCustomerInfoRequestDto,
  LoanProfileResponseDto
} from "./dto";
import { AttachFileDto } from "./dto/attach-file.dto";

@ApiTags("Loan profile")
@ApiSecurity("api-key")
@ApiSecurity("checksum")
@Controller("loan-profile")
export class LoanProfileController {
  constructor(private readonly service: LoanProfileService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh sách hồ sơ vay" })
  getLoanProfiles(
    @Headers() headers,
    @Body() dto: GetLoanProfilesRequestDto
  ): Promise<LoanProfilesResponseDto> {
    return this.service.getAllLoanProfiles(dto);
  }

  @Get("/:loan_profile_id")
  @ApiOperation({ summary: "Lấy chi tiết hồ sơ vay" })
  getLoanProfile(
    @Headers() headers,
    @Param() params
  ): Promise<LoanProfileResponseDto> {
    return this.service.getLoanProfile(params.loan_profile_id);
  }

  @Post("/check-customer-info")
  @ApiOperation({ summary: "Kiểm tra thông tin khách hàng" })
  @HttpCode(200)
  checkCustomerInfo(
    @Headers() headers,
    @Body() dto: CheckCustomerInfoRequestDto
  ) {
    return this.service.checkCustomerInfo(
      dto.customer_national_id,
      dto.phone,
      dto.tax_code
    );
  }

  // @Get("/checking-s37/:customer_national_id")
  // @ApiOperation({ summary: "Kiểm tra lịch sử tín dụng" })
  // checkingS37(@Headers() headers, @Param() params): Promise<any> {
  //   return this.service.checkingS37(params.customer_national_id);
  // }

  @Get("/polling-s37/:customer_national_id")
  @ApiOperation({ summary: "Lấy kết quả kiểm tra lịch sử tín dụng" })
  @HttpCode(200)
  pollingS37(@Headers() headers, @Param() params): Promise<any> {
    return this.service.pollingS37(params.customer_national_id);
  }

  @Post("/")
  @ApiOperation({ summary: "Tạo mới hồ sơ vay" })
  createLoanProfile(
    @Headers() headers,
    @Body() dto: LoanProfileDto
  ): Promise<LoanProfileDto> {
    return this.service.createLoanProfile(dto);
  }

  // @Put("/")
  // @ApiOperation({ summary: "Sửa thông tin hồ sơ vay" })
  // updateLoanProfile(
  //   @Headers() headers,
  //   @Body() dto: LoanProfileDto
  // ): Promise<LoanProfileDto> {
  //   return this.service.updateLoanProfile(dto);
  // }
  @Put("/update-attach-files")
  @ApiOperation({ summary: "Update file đính kèm cho hồ sơ vay" })
  @ApiBody({ type: [AttachFileDto] })
  @ApiResponse({ type: [AttachFileDto] })
  updateAttachFiles(
    @Headers() headers,
    @Body() dtos: AttachFileDto[]
  ): Promise<AttachFileDto[]> {
    return this.service.updateAttachFiles(dtos);
  }
  @Delete("/remove-attach-files/:attach_file_id/:user_id")
  @ApiOperation({ summary: "Xóa file đính kèm cho hồ sơ vay" })
  removeAttachFiles(@Headers() headers, @Param() params): Promise<boolean> {
    return this.service.removeAttachFiles(
      params.attach_file_id,
      params.user_id
    );
  }

  @Delete("/:loan_profile_id/:user_id")
  @ApiOperation({ summary: "Xóa hồ sơ vay" })
  deleteLoanProfile(@Headers() headers, @Param() params): Promise<boolean> {
    return this.service.deleteLoanProfile(
      params.loan_profile_id,
      params.user_id
    );
  }
}
