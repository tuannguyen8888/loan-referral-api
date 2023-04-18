import { InputQdeAddressDto, InputQdeReferenceDto } from "./input-qde.dto";
import { AddressDto } from "./address.dto";

export class InputDataUpdateDto {
  in_channel?: string = null;
  in_appid?: string = null;
  in_schemeid?: number = null;
  in_totalloanamountreq?: number = null;
  in_tenure?: number = null;
  in_salesofficer?: string = null;
  in_loanpurpose?: string = null;
  in_laa_app_ins_applicable?: string = null;
  in_priority_c?: string = null;
  in_userid?: string = null;
  in_title?: string = null;
  in_fname?: string = null;
  in_mname?: string = null;
  in_lname?: string = null;
  in_gender?: string = null;
  in_nationalid?: string = null;
  in_dob?: string = null;
  address?: InputDataUpdateAddressDto[] = [];
  in_tax_code?: string = null;
  in_presentjobyear?: number = null;
  in_presentjobmth?: number = null;
  in_others?: string = null;
  in_position?: string = null;
  in_amount?: number = null;
  in_accountbank?: string = null;

  reference: InputQdeReferenceDto[] = [];

  in_maritalstatus?: string = null;
  in_eduqualify?: string = null;
  in_noofdependentin?: string = null;
  in_paymentchannel?: string = null;
  in_nationalidissuedate?: string = null;
  in_familybooknumber?: string = null;
  in_idissuer?: string = null;
  in_spousename?: string = null;
  in_spouse_id_c?: string = null;
  in_categoryid?: string = null;
  in_bankname?: string = null;
  in_bankbranch?: string = null;
  in_accno?: string = null;
}
export class InputDataUpdateAddressDto {
  id?: number;
  in_addresstype?: string = null;
  in_propertystatus?: string = null;
  in_address1stline?: string = null;
  in_country?: string = null;
  in_city?: string = null;
  in_district?: string = null;
  in_ward?: string = null;
  in_roomno?: string = null;
  in_mobile?: string = null;
  in_phone?: string = null;
}
