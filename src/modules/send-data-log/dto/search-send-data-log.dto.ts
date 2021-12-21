import { IsDateString, IsOptional } from "class-validator";
import {BaseRequestDto} from "../../mafc/loan-profile/dto/base.request.dto";

export class SearchSendDataLogDto  extends BaseRequestDto {
    @IsOptional()
    keyword: string | null = null;
    @IsOptional()
    data: string | null = null;
    @IsOptional()
    result: string | null = null;
}
