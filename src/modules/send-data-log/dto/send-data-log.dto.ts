import { IsDateString, IsOptional } from "class-validator";

export class SendDataLogDto {
  id: number = null;
  api_url: string = null;
  keyword: string = null;
  data: string = null;
  result: string = null;
  created_at: string = null;
}
