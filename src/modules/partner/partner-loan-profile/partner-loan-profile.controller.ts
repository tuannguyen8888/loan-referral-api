import {Body, Controller, Get, Headers, HttpCode, Param, Post, Put} from '@nestjs/common';
import {PartnerLoanProfileService} from "./partner-loan-profile.service";
import {ApiOperation} from "@nestjs/swagger";
import {
    GetMCLoanProfilesRequestDto,
    LoanProfileResponseDto,
    LoanProfilesResponseDto, LoanProfileUpdateDto, McCategoryResponseDto, McLoanProfileDto
} from "../../mc/mc-loan-profile/dto";
import {PartnerResultResponseDto} from "./dto/partner-result.response.dto";
import {CheckCICRequestDto} from "../../mc/mc-loan-profile/dto/check-cic.request.dto";
import {CheckCitizenidRequestDto} from "../../mc/mc-loan-profile/dto/check-citizenid.request.dto";
import {McCheckListrequestDto} from "../../mc/mc-loan-profile/dto/mc-check-listrequest.dto";
import {McAttachfileDto} from "../../mc/mc-attachfile/dto/mc-attachfile.dto";
import {McAttachfileUpdateDto} from "../../mc/mc-attachfile/dto/mc-attachfile.update.dto";
import {GetMCAttachfileRequestDto} from "../../mc/mc-attachfile/dto/mc-get-attachfile.request.dto";
import {McCaseNoteDto} from "../../mc/mc-case-note/dto/mc-case-note.dto";
import {requestSendOtp3PDto} from "../../mc/mc-loan-profile/dto/requestSendOtp3P.dto";
import {requestScoring3PDto} from "../../mc/mc-loan-profile/dto/requestScoring3P.dto";
import {GetMcCaseRequestDto} from "../../mc/mc-loan-profile/dto/get-mc-case.request.dto";

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

    @Post("/getbpmStatus")
    @ApiOperation({ summary: "Lấy thông tin hợp đồng trả về" })
    @HttpCode(200)
    getbpmStatus(@Headers() headers) {
        return this.service.getbpmStatus(headers.salecode);
    }

    @Post("/checkCIC")
    @ApiOperation({ summary: "Kiểm tra thông tin CIC" })
    @HttpCode(200)
    checkCIC(@Headers() headers, @Body() dto: CheckCICRequestDto) {
        return this.service.checkCIC(headers.salecode,dto.citizenId, dto.customerName);
    }

    @Post("/checkCitizenId")
    @ApiOperation({ summary: "Kiểm tra thông tin khách hàng" })
    @HttpCode(200)
    checkCitizenId(@Headers() headers, @Body() dto: CheckCitizenidRequestDto) {
        return this.service.checkCitizenId(headers.salecode,dto.citizenId);
    }

    @Get("/checkInitContract/:loan_profile_id")
    @ApiOperation({ summary: "Kiểm tra khả năng cho vay" })
    @HttpCode(200)
    checkInitContract(@Headers() headers, @Param() params) {
        console.log(params.loan_profile_id);
        return this.service.checkInitContract(headers.salecode,params.loan_profile_id);
    }

    @Get("/checkCategory/:companyTaxNumber")
    @ApiOperation({ summary: "Kiểm tra thông tin công ty" })
    checkCategory(
        @Headers() headers,
        @Param() params
    ): Promise<PartnerResultResponseDto> {
        return this.service.checkCategory(headers.salecode,params.companyTaxNumber);
    }

    @Post("/getKios")
    @ApiOperation({ summary: "Lấy thông tin cửa hàng" })
    @HttpCode(200)
    getKios(@Headers() headers) {
        return this.service.getKios(headers.salecode);
    }

    @Post("/getProducts")
    @ApiOperation({ summary: "Lấy thông tin cửa hàng" })
    @HttpCode(200)
    getProducts(@Headers() headers) {
        return this.service.getProducts(headers.salecode);
    }

    @Post("/checkList")
    @ApiOperation({ summary: "" })
    @HttpCode(200)
    checkList(@Headers() headers, @Body() dto: McCheckListrequestDto) {
        return this.service.checkList(headers.salecode,dto);
    }

    @Post("/uploadDocument/:loan_profile_id")
    @ApiOperation({ summary: "uploadDocument" })
    @HttpCode(200)
    uploadDocument(@Headers() headers, @Param() params) {
        console.log("uploadDocument");
        return this.service.uploadDocument(headers.salecode,params.loan_profile_id);
    }

    @Post("/getAllAttachfile")
    @ApiOperation({ summary: "" })
    @HttpCode(200)
    getAllAttachfile(@Headers() headers, @Body() dto: GetMCAttachfileRequestDto) {
        return this.service.getAllAttachfile(headers.salecode,dto);
    }

    @Get("/getAttachfile/:attachfileid")
    @ApiOperation({ summary: "Kiểm tra thông tin công ty" })
    getAttachfile(
        @Headers() headers,
        @Param() params
    ): Promise<PartnerResultResponseDto> {
        return this.service.getAttachfile(headers.salecode,params.attachfileid);
    }

    @Post("/createAttachfile")
    @ApiOperation({ summary: "Upload attach file" })
    @HttpCode(200)
    createAttachfile(@Headers() headers, @Body() dto: McAttachfileDto) {
        return this.service.createAttachfile(headers.salecode,dto);
    }

    @Put("/updateAttachfile")
    @ApiOperation({ summary: "Upload attach file" })
    @HttpCode(200)
    updateAttachfile(@Headers() headers, @Body() dto: McAttachfileUpdateDto) {
        return this.service.updateAttachfile(headers.salecode,dto);
    }

    @Get("/listCaseNote/:loan_profile_id")
    @ApiOperation({ summary: "Kiểm tra khả năng cho vay" })
    @HttpCode(200)
    listCaseNote(@Headers() headers, @Param() params) {
        console.log(params.loan_profile_id);
        return this.service.listCaseNote(headers.salecode,params.loan_profile_id);
    }
    @Post("/createCaseNote")
    @ApiOperation({ summary: "Thêm Case Note" })
    createCaseNote(
        @Headers() headers,
        @Body() dto: McCaseNoteDto
    ): Promise<PartnerResultResponseDto> {
        return this.service.createCaseNote(headers.salecode,dto);
    }

    @Post("/requestSendOtp3P")
    @ApiOperation({ summary: "Lấy otp để chấm điểm" })
    @HttpCode(200)
    requestSendOtp3P(@Headers() headers, @Body() dto: requestSendOtp3PDto) {
        return this.service.requestSendOtp3P(headers.salecode,dto);
    }

    @Post("/requestScoring3P")
    @ApiOperation({ summary: "Lấy otp để chấm điểm" })
    @HttpCode(200)
    requestScoring3P(@Headers() headers, @Body() dto: requestScoring3PDto) {
        return this.service.requestScoring3P(headers.salecode,dto);
    }

    @Post("/getCases")
    @ApiOperation({ summary: "Lấy thông tin hợp đồng trả về" })
    @HttpCode(200)
    getCases(@Headers() headers, @Body() dto: GetMcCaseRequestDto) {
        return this.service.getCases(headers.salecode,dto);
    }

    @Get("/getReturnChecklist/:loan_profile_id")
    @ApiOperation({ summary: "Kiểm tra khả năng cho vay" })
    @HttpCode(200)
    getReturnChecklist(@Headers() headers, @Param() params) {
        console.log(params.loan_profile_id);
        return this.service.getReturnChecklist(headers.salecode,params.loan_profile_id);
    }
}
