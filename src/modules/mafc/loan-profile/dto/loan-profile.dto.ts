import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDateString, maxLength
} from "class-validator";
import { AddressDto } from "./address.dto";
import { ReferenceDto } from "./reference.dto";

export class LoanProfileDto {
  id?: number = null;
  partner_id?: number = null;
  loan_no?: string = null;
  fv_status?: string = null;
  loan_status?: string = null;
  in_channel?: string = null;
  in_schemeid: number = null;
  in_downpayment: number = null;
  in_totalloanamountreq: number = null;
  in_tenure: number = null;
  in_sourcechannel: string = null;
  in_salesofficer: string = null;
  in_loanpurpose: string = null;
  in_creditofficercode: string = null;
  in_bankbranchcode: string = null;
  in_laa_app_ins_applicable: string = null;
  in_possipbranch: string = null;
  in_priority_c: string = null;
  in_userid: string = null;
  in_title: string = null;
  in_fname: string = null;
  in_mname: string = null;
  in_lname: string = null;
  in_gender: string = null;
  in_nationalid: string = null;
  in_dob: string = null;
  in_constid: number = null;
  in_tax_code: string = null;
  in_presentjobyear: number = null;
  in_presentjobmth: number = null;
  in_previousjobyear: number = null;
  in_previousjobmth: number = null;
  in_referalgroup: string = null;
  in_addresstype: string = null;
  in_addressline: string = null;
  in_country: string = null;
  in_city: string = null;
  in_district: string = null;
  in_ward: string = null;
  in_phone: string = null;
  in_others: string = null;
  in_position: string = null;
  in_natureofbuss: string = null;
  in_head: string = null;
  in_frequency: string = null;
  in_amount: number = null;
  in_accountbank: string = null;
  in_debit_credit: string = null;
  in_per_cont: string = null;
  in_maritalstatus: string = null;
  in_qualifyingyear: string = null;
  in_eduqualify: string = null;
  in_noofdependentin: string = null;
  in_paymentchannel: string = null;
  in_nationalidissuedate: string = null;
  in_familybooknumber: string = null;
  in_idissuer: string = null;
  in_spousename: string = null;
  @IsOptional()
  in_spouse_id_c?: string = null;
  in_bankname: string = null;
  in_bankbranch: string = null;
  in_acctype: string = null;
  in_accno: string = null;
  in_dueday: string = null;
  econtract: string = null;
  @IsOptional()
  in_notecode: string = null;
  @IsOptional()
  in_notedetails: string = null;
  @IsOptional()
  @IsDateString()
  created_at: string = null;
  created_by: string = null;
  @IsOptional()
  @IsDateString()
  updated_at: string = null;
  updated_by: string = null;
  @IsOptional()
  @IsDateString()
  deleted_at: string = null;
  deleted_by: string = null;

  address: AddressDto[];
  references: ReferenceDto[];

  @IsOptional()
  disbursement_date: string = null;
}
