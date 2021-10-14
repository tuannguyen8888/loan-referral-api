import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    Param,
    Post,
    Put
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiSecurity,
    ApiTags
} from "@nestjs/swagger";
import {McCaseService} from "./mc-case.service";
import {GetMCCaseRequestDto} from "./dto/get-case.request.dto";
import {McCasesResponseDto} from "./dto/mc-cases.response.dto";

@Controller('mc-case')
export class McCaseController {
    constructor(private readonly service:McCaseService) {
    }

    @Get("/")
    @ApiOperation({summary: "Lấy danh sách Case"})
    getAllCases(
        @Headers() headers,
        @Body() dto: GetMCCaseRequestDto
    ): Promise<McCasesResponseDto> {
        console.log("Lấy danh sách Case");
        return this.service.getAllCases(dto);
    }
}
