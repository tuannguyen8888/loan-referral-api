import {Body, Controller, Get, Headers, Param, Post, Put} from '@nestjs/common';
import {PartnerLoanProfileService} from "./partner-loan-profile.service";
import {ApiOperation} from "@nestjs/swagger";
import {
    GetMCLoanProfilesRequestDto,
    LoanProfileResponseDto,
    LoanProfilesResponseDto, LoanProfileUpdateDto, McLoanProfileDto
} from "../../mc/mc-loan-profile/dto";
import {PartnerResultResponseDto} from "./dto/partner-result.response.dto";

@Controller('partner-loan-profile')
export class PartnerLoanProfileController {
    constructor(private readonly  service:PartnerLoanProfileService) {}

    @Get("/")
    @ApiOperation({ summary: "Lấy danh sách hồ sơ vay" })
    getLoanProfiles(
        @Headers() headers,
        @Body() dto: GetMCLoanProfilesRequestDto
    ): Promise<PartnerResultResponseDto> {
        console.log("Partner Lấy danh sách hồ sơ vay");
        dto.saleCode = headers.salecode;
        return this.service.getAllLoanProfiles(dto);
    }

    @Get("/:loan_profile_id")
    @ApiOperation({ summary: "Lấy chi tiết hồ sơ vay" })
    getLoanProfile(
        @Headers() headers,
        @Param() params
    ): Promise<PartnerResultResponseDto> {
        console.log("Partner Lấy chi tiết hồ sơ");
        return this.service.getLoanProfile(params.loan_profile_id,headers.salecode);
    }
    @Post("/")
    @ApiOperation({ summary: "Tạo mới hồ sơ vay" })
    createLoanProfile(
        @Headers() headers,
        @Body() dto: McLoanProfileDto
    ): Promise<PartnerResultResponseDto> {
        dto.saleCode = headers.salecode;
        return this.service.createLoanProfile(dto);
    }

    @Put("/")
    @ApiOperation({ summary: "Sửa thông tin hồ sơ vay" })
    updateLoanProfile(
        @Headers() headers,
        @Body() dto: LoanProfileUpdateDto
    ): Promise<PartnerResultResponseDto> {
        dto.saleCode = headers.salecode;
        return this.service.updateLoanProfile(dto);
    }
}
