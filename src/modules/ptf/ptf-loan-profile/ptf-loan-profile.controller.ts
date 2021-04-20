import {Body, Controller, Get, Headers, Param} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {PtfLoanProfileService} from "./ptf-loan-profile.service";
import {GetPtfLoanProfilesRequestDto, LoanProfileResponseDto, LoanProfilesResponseDto} from "./dto";

@Controller('loan-profile')
@ApiTags("PTF")
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
}
