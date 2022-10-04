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
} from "./dto/index";
import { AttachFileDto } from "./dto/attach-file.dto";
import { LoanProfileDeferReplyRequestDto } from "./dto/loan-profile-defer-reply.request.dto";

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
      dto.tax_code,
      dto.customer_name,
      dto.user_id
    );
  }

  // @Get("/checking-s37/:customer_national_id")
  // @ApiOperation({ summary: "Kiểm tra lịch sử tín dụng" })
  // checkingS37(@Headers() headers, @Param() params): Promise<any> {
  //   return this.service.checkingS37(params.customer_national_id);
  // }

  @Get("/polling-s37/:customer_national_id/:user_id")
  @ApiOperation({ summary: "Lấy kết quả kiểm tra lịch sử tín dụng" })
  @HttpCode(200)
  pollingS37(@Headers() headers, @Param() params): Promise<any> {
    return this.service.pollingS37(params.customer_national_id, params.user_id);
  }

  @Post("/")
  @ApiOperation({ summary: "Tạo mới hồ sơ vay" })
  createLoanProfile(
    @Headers() headers,
    @Body() dto: LoanProfileDto
  ): Promise<LoanProfileDto> {
    return this.service.createLoanProfile(dto);
  }

  @Put("/remove-national-id/:customer_national_id/:user_id")
  @ApiOperation({ summary: "Gở bỏ số SMND/CCCD để có thể nhập lại hồ sơ" })
  removeNationalId(@Headers() headers, @Param() params): Promise<boolean> {
    return this.service.removeNationalId(
      params.customer_national_id,
      params.user_id
    );
  }

  @Put("/")
  @ApiOperation({ summary: "Sửa thông tin hồ sơ vay" })
  updateLoanProfile(
    @Headers() headers,
    @Body() dto: LoanProfileDto
  ): Promise<LoanProfileDto> {
    return this.service.updateLoanProfile(dto);
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
  @Put("/reply-defers")
  @ApiOperation({ summary: "Phản hồi defer cho hồ sơ vay" })
  @ApiBody({ type: [LoanProfileDeferReplyRequestDto] })
  replyDeffers(
    @Headers() headers,
    @Body() dtos: LoanProfileDeferReplyRequestDto[]
  ): Promise<boolean> {
    return this.service.replyDeffers(dtos);
  }
  // @Get("/sendData_pushUnderSystem/:loan_profile_id")
  // @ApiOperation({ summary: "test đẩy file qua MAFC" })
  // sendData_pushUnderSystem(@Headers() headers, @Param() params): Promise<any> {
  //   return this.service.test_sendData_pushUnderSystem(params.loan_profile_id);
  // }
  //
  // @Get("/sendData_procQDEChangeState/:loan_no")
  // @ApiOperation({ summary: "test chuyển trạng thái QDE qua DDE" })
  // sendData_procQDEChangeState(
  //   @Headers() headers,
  //   @Param() params
  // ): Promise<any> {
  //   return this.service.sendData_procQDEChangeState(params.loan_no);
  // }
  // @Get("/sendData_procDDEChangeState/:loan_no")
  // @ApiOperation({ summary: "test chuyển trạng thái DDE qua POR" })
  // sendData_procDDEChangeState(
  //   @Headers() headers,
  //   @Param() params
  // ): Promise<any> {
  //   return this.service.sendData_procDDEChangeState(params.loan_no);
  // }

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
