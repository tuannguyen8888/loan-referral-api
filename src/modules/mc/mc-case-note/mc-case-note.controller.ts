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
import {McCaseNoteService} from "./mc-case-note.service";
import {GetMCCaseNoteRequestDto} from "./dto/get-case-note.request.dto";
import {McCaseNotesResponseDto} from "./dto/mc-case-notes.response.dto";
import {McCaseNoteResponseDto} from "./dto/mc-case-note.response.dto";
import {McCaseNoteDto} from "./dto/mc-case-note.dto";
import {McCaseNoteUpdateDto} from "./dto/mc-case-note.update.dto";

@Controller('mc-case-note')
export class McCaseNoteController {
    constructor(private readonly service:McCaseNoteService) {
    }

    @Get("/")
    @ApiOperation({summary: "Lấy danh sách Case Note"})
    getAllCaseNotes(
        @Headers() headers,
        @Body() dto: GetMCCaseNoteRequestDto
    ): Promise<McCaseNotesResponseDto> {
        console.log("Lấy danh sách Case");
        return this.service.getAllCaseNotes(dto);
    }

    @Get("/:id")
    @ApiOperation({summary: "Lấy chi tiết Case Note"})
    getCaseNote(@Headers() headers, @Param() params): Promise<McCaseNoteResponseDto> {
        return this.service.getCaseNote(params.id);
    }

    @Post("/")
    @ApiOperation({summary: "Thêm Case Note"})
    createCaseNote(@Headers() headers, @Body() dto: McCaseNoteDto): Promise<McCaseNoteDto> {
        return this.service.createCaseNote(dto);
    }

    @Put("/")
    @ApiOperation({summary: "Sửa Case Note"})
    updateCaseNote(@Headers() headers, @Body() dto: McCaseNoteUpdateDto): Promise<McCaseNoteUpdateDto> {
        return this.service.updateCaseNote(dto);
    }
}
