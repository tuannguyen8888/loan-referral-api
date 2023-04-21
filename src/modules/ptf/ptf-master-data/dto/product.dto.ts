import { IsDateString, IsOptional } from "class-validator";

export class ProductDto {
  id: number = null;
  client_name: string = null;
  description: string = null;
  status: string = null;
  min_amount: number = null;
  max_amount: number = null;
  min_term: number = null;
  max_term: number = null;
  require_doc_types: string = null;
}
