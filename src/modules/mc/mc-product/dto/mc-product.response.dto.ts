import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString
} from "class-validator";
import { ProcessDto } from "src/modules/mafc/loan-profile/dto";
import {} from "./index";

export class McProductResponseDto {
  id: number = null;
  ccy: string = null;
  createdBy: string = null;
  createdDate: number = null;
  endEffDate: number = null;
  lastUpdatedBy: string = null;
  lastUpdatedDate: number = null;
  latePenaltyFee: number = null;
  lateRateIndex: number = null;
  maxLoanAmount: number = null;
  maxQuantityCommodities: number = null;
  maxTenor: number = null;
  minLoanAmount: number = null;
  minTenor: number = null;
  preLiquidationFee: number = null;
  productCategoryId: number = null;
  productCode: string = null;
  productGroupId: number = null;
  productName: string = null;
  pti: number = null;
  rateIndex: number = null;
  recordStatus: string = null;
  startEffDate: number = null;
  status: string = null;
  tenor: number = null;
  isCheckCat: string = null;
  productGroupName: string = null;
}
