import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsDateString, IsOptional } from "class-validator";

export class LoanProfileChangeLogDto {
  id: number;
  action_change: string;
  changed_at: string;
  loan_profile_id: number;
  partner_id: number;
  loan_no: string;
  fv_status: string;
  loan_status: string;
  in_channel: string;
  in_schemeid: number;
  in_downpayment: number;
  in_totalloanamountreq: number;
  in_tenure: number;
  in_sourcechannel: string;
  in_salesofficer: string;
  in_loanpurpose: string;
  in_creditofficercode: string;
  in_bankbranchcode: string;
  in_laaappinsapplicable: string;
  in_possipbranch: string;
  in_priorityC: string;
  in_userid: string;
  in_title: string;
  in_fname: string;
  in_mname: string;
  in_lname: string;
  in_gender: string;
  in_nationalid: string;
  in_dob: string;
  in_constid: string;
  in_taxcode: string;
  in_presentjobyear: number;
  in_presentjobmth: number;
  in_previousjobyear: number;
  in_previousjobmth: number;
  in_referalgroup: string;
  in_addresstype: string;
  in_addressline: string;
  in_country: string;
  in_city: string;
  in_district: string;
  in_ward: string;
  in_phone: string;
  in_others: string;
  in_position: string;
  in_natureofbuss: string;
  in_head: string;
  in_frequency: string;
  in_amount: number;
  in_accountbank: string;
  in_debitcredit: string;
  in_perCont: string;
  in_maritalstatus: string;
  in_qualifyingyear: string;
  in_eduqualify: string;
  in_noofdependentin: string;
  in_paymentchannel: string;
  in_nationalidissuedate: string;
  in_familybooknumber: string;
  in_idissuer: string;
  in_spousename: string;
  in_spouseIdC: string;
  in_bankname: string;
  in_bankbranch: string;
  in_acctype: string;
  in_accno: string;
  in_dueday: string;
  in_notecode: string;
  in_notedetails: string;
  @IsOptional()
  @IsDateString()
  created_at: string;
  created_by: number;
  @IsOptional()
  @IsDateString()
  updated_at: string;
  updated_by: number;
  @IsOptional()
  @IsDateString()
  deleted_at: string;
  deleted_by: number;
}
