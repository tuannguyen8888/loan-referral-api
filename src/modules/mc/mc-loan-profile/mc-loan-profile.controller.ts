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
    LoanProfileDto,
    LoanProfileResponseDto,
    LoanProfilesResponseDto,
    LoanProfileUpdateDto,
    McCategoryResponseDto
} from "./dto";

import {CheckCICRequestDto} from "./dto/check-cic.request.dto";
import {CheckCitizenidRequestDto} from "./dto/check-citizenid.request.dto";
import {CheckInitContractRequestDto} from "./dto/check-init-contract.request.dto";
import {McCheckListrequestDto} from "./dto/mc-check-listrequest.dto";

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

    @Post("/checkInitContract")
    @ApiOperation({summary: "Kiểm tra thông tin khách hàng"})
    @HttpCode(200)
    checkInitContract(
        @Headers() headers,
        @Body() dto: CheckInitContractRequestDto
    ) {
        return this.service.checkInitContract(dto);
    }

    @Post("/checkList")
    @ApiOperation({summary: ""})
    @HttpCode(200)
    checkList(@Headers() headers, @Body() dto: McCheckListrequestDto) {
        return this.service.checkList(dto);
    }
    @Post("/uploadDocument")
    @ApiOperation({summary: ""})
    @HttpCode(200)
    uploadDocument(@Headers() headers) {
        return this.service.uploadDocument();
    }
    @Get("/checkCategory/:companyTaxNumber")
    @ApiOperation({summary: "Kiểm tra thông tin công ty"})
    checkCategory(
        @Headers() headers,
        @Param() params
    ): Promise<McCategoryResponseDto> {
        return this.service.checkCategory(params.companyTaxNumber);
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
        @Body() dto: LoanProfileUpdateDto
    ): Promise<LoanProfileUpdateDto> {
        return this.service.updateLoanProfile(dto);
    }
}
