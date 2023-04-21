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
import { PtfLoanProfileService } from "./ptf-loan-profile.service";
import {
  GetPtfLoanProfilesRequestDto,
  LoanProfileDto,
  LoanProfileResponseDto,
  LoanProfilesResponseDto,
  AttachFileDto,
  LoanProfileUpdateDto,
  CreateDeferRequestDto,
  UpdateDeferRequestDto
} from "./dto";
import { CheckCustomerInfoRequestDto } from "../../mafc/loan-profile/dto";

@Controller("loan-profile")
@ApiSecurity("api-key")
@ApiSecurity("checksum")
@ApiTags("PTF Loan Profile")
export class PtfLoanProfileController {
  constructor(private readonly service: PtfLoanProfileService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh sách hồ sơ vay" })
  getLoanProfiles(
    @Headers() headers,
    @Body() dto: GetPtfLoanProfilesRequestDto
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

  @Post("/")
  @ApiOperation({ summary: "Tạo mới hồ sơ vay" })
  createLoanProfile(
    @Headers() headers,
    @Body() dto: LoanProfileDto
  ): Promise<LoanProfileDto> {
    return this.service.createLoanProfile(dto);
  }

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

  @Put("/")
  @ApiOperation({ summary: "Sửa thông tin hồ sơ vay" })
  updateLoanProfile(
    @Headers() headers,
    @Body() dto: LoanProfileUpdateDto
  ): Promise<LoanProfileResponseDto> {
    return this.service.updateLoanProfile(dto);
  }

  @Post("/defer")
  @ApiOperation({ summary: "Tạo mới defer cho hồ sơ vay" })
  createDefer(
    @Headers() headers,
    @Body() dto: CreateDeferRequestDto
  ): Promise<boolean> {
    return this.service.createDefer(dto);
  }

  @Put("/defer")
  @ApiOperation({ summary: "Update defer cho hồ sơ vay" })
  updateDefer(
    @Headers() headers,
    @Body() dtos: UpdateDeferRequestDto[]
  ): Promise<boolean> {
    return this.service.updateDefer(dtos);
  }
}
