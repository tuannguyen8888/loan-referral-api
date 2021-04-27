import {Body, Controller, Get, Headers, HttpCode, Param, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {PtfLoanProfileService} from "./ptf-loan-profile.service";
import {GetPtfLoanProfilesRequestDto, LoanProfileDto, LoanProfileResponseDto, LoanProfilesResponseDto} from "./dto";
import {CheckCustomerInfoRequestDto} from "../../loan-profile/dto";

@Controller('loan-profile')
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

    @Put("/")
    @ApiOperation({ summary: "Sửa thông tin hồ sơ vay" })
    updateLoanProfile(
        @Headers() headers,
        @Body() dto: LoanProfileDto
    ): Promise<LoanProfileDto> {
        return this.service.updateLoanProfile(dto);
    }
}
