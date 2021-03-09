import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString
} from "class-validator";
import { AddressDto } from "./address.dto";
import { ReferenceDto } from "./reference.dto";

export class InputQdeDto {
  in_channel?: string;
  in_schemeid?: string;
  in_downpayment?: string;
  in_totalloanamountreq?: string;
  in_tenure?: string;
  in_sourcechannel?: string;
  in_salesofficer?: string;
  in_loanpurpose?: string;
  in_creditofficercode?: string;
  in_bankbranchcode?: string;
  in_laa_app_ins_applicable?: string;
  in_possipbranch?: string;
  in_priority_c?: string;
  in_userid?: string;
  in_title?: string;
  in_fname?: string;
  in_mname?: string;
  in_lname?: string;
  in_gender?: string;
  in_nationalid?: string;
  in_dob?: string;
  in_constid?: string;
  address?: any[];
  in_tax_code?: string;
  in_presentjobyear?: string;
  in_presentjobmth?: string;
  in_previousjobyear?: string;
  in_previousjobmth?: string;
  in_referalgroup?: string;
  in_addresstype?: string;
  in_addressline?: string;
  in_country?: string;
  in_city?: string;
  in_district?: string;
  in_ward?: string;
  in_phone?: string;
  in_others?: string;
  in_position?: string;
  in_natureofbuss?: string;
  reference: any[];
  in_head?: string;
  in_frequency?: string;
  in_amount?: string;
  in_accountbank?: string;
  in_debit_credit?: string;
  in_per_cont?: string;
}
