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
import {McLoanProfileService} from "./mc-loan-profile.service";
import {
  GetMCLoanProfilesRequestDto,
  McLoanProfileDto,
  LoanProfileResponseDto,
  LoanProfilesResponseDto,
  LoanProfileUpdateDto,
  McCategoryResponseDto
} from "./dto";

import {CheckCICRequestDto} from "./dto/check-cic.request.dto";
import {CheckCitizenidRequestDto} from "./dto/check-citizenid.request.dto";
import {CheckInitContractRequestDto} from "./dto/check-init-contract.request.dto";
import {McCheckListrequestDto} from "./dto/mc-check-listrequest.dto";
import {GetMcCaseRequestDto} from "./dto/get-mc-case.request.dto";

@Controller("mc-loan-profile")
@ApiSecurity("api-key")
@ApiSecurity("checksum")
@ApiTags("MC Loan Profile")
export class McLoanProfileController {
  constructor(private readonly service: McLoanProfileService) {
  }

  @Get("/")
  @ApiOperation({summary: "Lấy danh sách hồ sơ vay"})
  getLoanProfiles(
      @Headers() headers,
      @Body() dto: GetMCLoanProfilesRequestDto
  ): Promise<LoanProfilesResponseDto> {
    console.log("MC Lấy danh sách hồ sơ vay");
    return this.service.getAllLoanProfiles(dto);
  }

  @Get("/:loan_profile_id")
  @ApiOperation({summary: "Lấy chi tiết hồ sơ vay"})
  getLoanProfile(
      @Headers() headers,
      @Param() params
  ): Promise<LoanProfileResponseDto> {
    return this.service.getLoanProfile(params.loan_profile_id);
  }

  @Post("/checkCIC")
  @ApiOperation({summary: "Kiểm tra thông tin CIC"})
  @HttpCode(200)
  checkCIC(@Headers() headers, @Body() dto: CheckCICRequestDto) {
    return this.service.checkCIC(dto.citizenId, dto.customerName);
  }

  @Post("/checkCitizenId")
  @ApiOperation({summary: "Kiểm tra thông tin khách hàng"})
  @HttpCode(200)
  checkCitizenId(@Headers() headers, @Body() dto: CheckCitizenidRequestDto) {
    return this.service.checkCitizenId(dto.citizenId);
  }

  @Post("/getCases")
  @ApiOperation({summary: "Lấy thông tin hợp đồng trả về"})
  @HttpCode(200)
  getCases(@Headers() headers, @Body() dto: GetMcCaseRequestDto) {
    return this.service.getCases(dto);
  }

  @Post("/checkList")
  @ApiOperation({summary: ""})
  @HttpCode(200)
  checkList(@Headers() headers, @Body() dto: McCheckListrequestDto) {
    return this.service.checkList(dto);
  }

  @Post("/uploadDocument/:loan_profile_id")
  @ApiOperation({summary: "uploadDocument"})
  @HttpCode(200)
  uploadDocument(@Headers() headers, @Param() params) {
    console.log("uploadDocument");
    return this.service.uploadDocument(params.loan_profile_id);
  }

  @Get("/checkCategory/:companyTaxNumber")
  @ApiOperation({summary: "Kiểm tra thông tin công ty"})
  checkCategory(
      @Headers() headers,
      @Param() params
  ): Promise<McCategoryResponseDto> {
    return this.service.checkCategory(params.companyTaxNumber);
  }

  @Get("/checkInitContract/:loan_profile_id")
  @ApiOperation({summary: "Kiểm tra khả năng cho vay"})
  @HttpCode(200)
  checkInitContract(@Headers() headers, @Param() params) {
    console.log(params.loan_profile_id);
    return this.service.checkInitContract(params.loan_profile_id);
  }

  @Get("/listCaseNote/:loan_profile_id")
  @ApiOperation({summary: "Kiểm tra khả năng cho vay"})
  @HttpCode(200)
  listCaseNote(@Headers() headers, @Param() params) {
    console.log(params.loan_profile_id);
    return this.service.listCaseNote(params.loan_profile_id);
  }

  @Post("/")
  @ApiOperation({summary: "Tạo mới hồ sơ vay"})
  createLoanProfile(
      @Headers() headers,
      @Body() dto: McLoanProfileDto
  ): Promise<McLoanProfileDto> {
    return this.service.createLoanProfile(dto);
  }

  @Put("/")
  @ApiOperation({summary: "Sửa thông tin hồ sơ vay"})
  updateLoanProfile(
      @Headers() headers,
      @Body() dto: LoanProfileUpdateDto
  ): Promise<LoanProfileUpdateDto> {
    return this.service.updateLoanProfile(dto);
  }
}
