import {IsDateString, IsOptional} from "class-validator";

export class SearchMasterDataDto {
    @IsOptional()
    keyword: string|null = null;
}
