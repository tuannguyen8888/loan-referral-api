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
  in_channel?: string = null;
  in_schemeid?: string = null;
  in_downpayment?: string = null;
  in_totalloanamountreq?: string = null;
  in_tenure?: string = null;
  in_sourcechannel?: string = null;
  in_salesofficer?: string = null;
  in_loanpurpose?: string = null;
  in_creditofficercode?: string = null;
  in_bankbranchcode?: string = null;
  in_laa_app_ins_applicable?: string = null;
  in_possipbranch?: string = null;
  in_priority_c?: string = null;
  in_userid?: string = null;
  in_title?: string = null;
  in_fname?: string = null;
  in_mname?: string = null;
  in_lname?: string = null;
  in_gender?: string = null;
  in_nationalid?: string = null;
  in_dob?: string = null;
  in_constid?: string = null;
  address?: any[] = null;
  in_tax_code?: string = null;
  in_presentjobyear?: string = null;
  in_presentjobmth?: string = null;
  in_previousjobyear?: string = null;
  in_previousjobmth?: string = null;
  in_referalgroup?: string = null;
  in_addresstype?: string = null;
  in_addressline?: string = null;
  in_country?: string = null;
  in_city?: string = null;
  in_district?: string = null;
  in_ward?: string = null;
  in_phone?: string = null;
  in_others?: string = null;
  in_position?: string = null;
  in_natureofbuss?: string = null;
  reference: any[] = null;
  in_head?: string = null;
  in_frequency?: string = null;
  in_amount?: string = null;
  in_accountbank?: string = null;
  in_debit_credit?: string = null;
  in_per_cont?: string = null;
}
