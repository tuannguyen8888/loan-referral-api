import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("loan_profile_change_log")
export class LoanProfileChangeLog {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "action_change",
    comment: "Hành động làm thay đổi dữ liệu: CREATE, UPDATE, DELETE",
    length: 45
  })
  actionChange: string;

  @Column("varchar", {
    name: "changed_at",
    length: 45,
    default: () => "CURRENT_TIMESTAMP"
  })
  changedAt: string;

  @Column("int", { name: "loan_profile_id" })
  loanProfileId: number;

  @Column("int", { name: "partner_id" })
  partnerId: number;

  @Column("varchar", {
    name: "loan_no",
    comment: "Mã/ số hợp đồng, App ID",
    length: 45
  })
  loanNo: string;

  @Column("varchar", { name: "fv_status", length: 45 })
  fvStatus: string;

  @Column("varchar", { name: "loan_status", nullable: true, length: 45 })
  loanStatus: string | null;

  @Column("varchar", { name: "in_channel", length: 8, default: () => "'FIV'" })
  inChannel: string;

  @Column("int", {
    name: "in_schemeid",
    nullable: true,
    comment: "Scheme trên Finnone (Master data)"
  })
  inSchemeid: number | null;

  @Column("int", { name: "in_downpayment", nullable: true })
  inDownpayment: number | null;

  @Column("float", {
    name: "in_totalloanamountreq",
    nullable: true,
    comment: "Loan Amount Requested trên Finnone",
    precision: 22
  })
  inTotalloanamountreq: number | null;

  @Column("int", { name: "in_tenure", nullable: true })
  inTenure: number | null;

  @Column("varchar", {
    name: "in_sourcechannel",
    length: 20,
    default: () => "'ADVT'"
  })
  inSourcechannel: string;

  @Column("varchar", {
    name: "in_salesofficer",
    nullable: true,
    comment: "Sales officer trên Finnone (Master data) ",
    length: 8
  })
  inSalesofficer: string | null;

  @Column("varchar", {
    name: "in_loanpurpose",
    nullable: true,
    comment:
      "API nhận Code (A,M,H,V,P)  A   :APPLIANCE/FURNITURE/ELECTRONICS  M   :MEDICAL EXPENSE  H   :IMPROVEMENT/LOT DOWNPAYMENT  V   :VACATION/TRAVEL EXPENSE  P   :MULTIPURPOSE  ",
    length: 8
  })
  inLoanpurpose: string | null;

  @Column("varchar", {
    name: "in_creditofficercode",
    comment:
      "Credit Officer Code trên Finnone (Master data): Default value: EXT_FIV  ",
    length: 20,
    default: () => "'EXT_FIV'"
  })
  inCreditofficercode: string;

  @Column("varchar", {
    name: "in_bankbranchcode",
    comment:
      "Default value: 01 (CodeID) – Hồ Chí Minh ( Desc) – API nhận codeID",
    length: 50,
    default: () => "'01'"
  })
  inBankbranchcode: string;

  @Column("varchar", {
    name: "in_laa_app_ins_applicable",
    nullable: true,
    comment: "Insurance Applicable trên Finnone :   Y, N",
    length: 1
  })
  inLaaAppInsApplicable: string | null;

  @Column("varchar", {
    name: "in_possipbranch",
    length: 30,
    default: () => "'14'"
  })
  inPossipbranch: string;

  @Column("varchar", {
    name: "in_priority_c",
    nullable: true,
    comment:
      "Priority trên Finnone :  Bank Statement Business License No Business License None Pay Slip",
    length: 50
  })
  inPriorityC: string | null;

  @Column("varchar", {
    name: "in_userid",
    nullable: true,
    length: 7,
    default: () => "'EXT_FIV'"
  })
  inUserid: string | null;

  @Column("varchar", {
    name: "in_title",
    comment: "Title trên Finnone MR. MRS. MS.  ",
    length: 4
  })
  inTitle: string;

  @Column("varchar", {
    name: "in_fname",
    comment: "Family Name trên Finnone  ",
    length: 30
  })
  inFname: string;

  @Column("varchar", {
    name: "in_mname",
    comment: "Middle Name  trên Finnone",
    length: 30
  })
  inMname: string;

  @Column("varchar", {
    name: "in_lname",
    comment: "Name  trên Finnone",
    length: 30
  })
  inLname: string;

  @Column("varchar", {
    name: "in_gender",
    comment: "Gender trên Finnone",
    length: 10
  })
  inGender: string;

  @Column("varchar", {
    name: "in_nationalid",
    comment: "National ID  trên Finnone",
    length: 40
  })
  inNationalid: string;

  @Column("varchar", { name: "in_dob", length: 10 })
  inDob: string;

  @Column("varchar", {
    name: "in_constid",
    comment:
      "Constitution trên Finnone  (Master data)   5 – SALARIED   8 – SELF EMPLOYED   API nhận code 5 - 8",
    length: 2
  })
  inConstid: string;

  @Column("varchar", { name: "in_tax_code", nullable: true, length: 30 })
  inTaxCode: string | null;

  @Column("int", { name: "in_presentjobyear", default: () => "'0'" })
  inPresentjobyear: number;

  @Column("int", { name: "in_presentjobmth", default: () => "'0'" })
  inPresentjobmth: number;

  @Column("int", {
    name: "in_previousjobyear",
    nullable: true,
    default: () => "'0'"
  })
  inPreviousjobyear: number | null;

  @Column("int", {
    name: "in_previousjobmth",
    nullable: true,
    default: () => "'0'"
  })
  inPreviousjobmth: number | null;

  @Column("varchar", {
    name: "in_referalgroup",
    nullable: true,
    comment: "3 – THIRD PARTY   4 – NORMAL  ",
    length: 20
  })
  inReferalgroup: string | null;

  @Column("varchar", {
    name: "in_addresstype",
    nullable: true,
    comment: "•   HEADOFF - HEAD OFFICE BCHOFF - BRANCH OFFICE  ",
    length: 20
  })
  inAddresstype: string | null;

  @Column("varchar", {
    name: "in_addressline",
    nullable: true,
    comment: "Address: 1st line  trên Finnone",
    length: 100
  })
  inAddressline: string | null;

  @Column("varchar", {
    name: "in_country",
    nullable: true,
    comment:
      "Country trên Finnone (Master data)  Default value: Code 189 – Việt Nam – API nhận code 189  ",
    length: 8,
    default: () => "'189'"
  })
  inCountry: string | null;

  @Column("varchar", {
    name: "in_city",
    nullable: true,
    comment: "City trên Finnone (Master data)",
    length: 8
  })
  inCity: string | null;

  @Column("varchar", {
    name: "in_district",
    nullable: true,
    comment: "District trên Finnone (Master data)",
    length: 8
  })
  inDistrict: string | null;

  @Column("varchar", {
    name: "in_ward",
    nullable: true,
    comment: "Ward trên Finnone (Master data)",
    length: 8
  })
  inWard: string | null;

  @Column("varchar", {
    name: "in_phone",
    nullable: true,
    comment: "Fixed Phone trên Finnone",
    length: 20
  })
  inPhone: string | null;

  @Column("varchar", {
    name: "in_others",
    nullable: true,
    comment: "Others trên Finnone",
    length: 400
  })
  inOthers: string | null;

  @Column("varchar", {
    name: "in_position",
    nullable: true,
    comment: "Position trên Finnone",
    length: 50
  })
  inPosition: string | null;

  @Column("varchar", {
    name: "in_natureofbuss",
    comment:
      "Nature of Business trên Finnone  – Default: hoat dong lam thue cac cong viec trong cac hgd,sx sp vat chat va dich vu tu tieu dung cua ho gia dinh",
    length: 105,
    default: () =>
      "'hoat dong lam thue cac cong viec trong cac hgd,sx sp vat chat va dich vu tu tieu dung cua ho gia dinh'"
  })
  inNatureofbuss: string;

  @Column("varchar", {
    name: "in_head",
    comment:
      "Head trên Finnone (Master data)  Default value: NETINCOM = NET INCOME  - API nhận code NETINCOM",
    length: 8,
    default: () => "'NETINCOM'"
  })
  inHead: string;

  @Column("varchar", {
    name: "in_frequency",
    nullable: true,
    comment: "Frequency trên Finnone  Default : MONTHLY",
    length: 7,
    default: () => "'MONTHLY'"
  })
  inFrequency: string | null;

  @Column("float", { name: "in_amount", precision: 22 })
  inAmount: number;

  @Column("varchar", {
    name: "in_accountbank",
    comment: "Salary Account With Bank trên Finnone  Y   N ",
    length: 1,
    default: () => "'Y'"
  })
  inAccountbank: string;

  @Column("varchar", {
    name: "in_debit_credit",
    comment: "Percentage trên Finnone - Default value: 100",
    length: 1,
    default: () => "'P'"
  })
  inDebitCredit: string;

  @Column("varchar", {
    name: "in_per_cont",
    comment: "Percentage trên Finnone - Default value: 100",
    length: 3,
    default: () => "'100'"
  })
  inPerCont: string;

  @Column("varchar", {
    name: "in_maritalstatus",
    nullable: true,
    comment:
      "Trường Marital Status trên F1  Divorced/Widow/Separated   -    W  Married   -      M  Single   -      S   API nhận code W- M-S ",
    length: 1
  })
  inMaritalstatus: string | null;

  @Column("varchar", {
    name: "in_qualifyingyear",
    nullable: true,
    comment: "Trường Staff Code Number trên F1",
    length: 60
  })
  inQualifyingyear: string | null;

  @Column("varchar", {
    name: "in_eduqualify",
    nullable: true,
    comment:
      "Trường Educational Qualification trên F1  CE  - COLLEGE OR EQUIVALENT     HG  - HIGH SCHOOL     LG  - LOWER HIGH SCHOOL     U   - UNIVERSITY      UU  - UPPER UNIVERSITY     API nhận code CE – HG – LG - U – UU. ",
    length: 24
  })
  inEduqualify: string | null;

  @Column("varchar", {
    name: "in_noofdependentin",
    nullable: true,
    comment: "Trường No. of Dependent(s) trên F1",
    length: 3
  })
  inNoofdependentin: string | null;

  @Column("varchar", {
    name: "in_paymentchannel",
    nullable: true,
    comment:
      "Trường Payment Channel trên F1  O – SALARY DEDUCTION  C -  NORMAL  T – Auto Tranfer   API nhận code T- C – O ",
    length: 1
  })
  inPaymentchannel: string | null;

  @Column("varchar", {
    name: "in_nationalidissuedate",
    nullable: true,
    comment: "Trường National ID Issue Date(dd/mm/yyyy) trên F1",
    length: 10
  })
  inNationalidissuedate: string | null;

  @Column("varchar", {
    name: "in_familybooknumber",
    nullable: true,
    comment: "Trường Family book number trên F1",
    length: 30
  })
  inFamilybooknumber: string | null;

  @Column("varchar", {
    name: "in_idissuer",
    nullable: true,
    comment: "Trường ID Issuer trên F1",
    length: 45
  })
  inIdissuer: string | null;

  @Column("varchar", {
    name: "in_spousename",
    nullable: true,
    comment: "Trường Spouse Name trên F1",
    length: 100
  })
  inSpousename: string | null;

  @Column("varchar", {
    name: "in_spouse_id_c",
    comment: "Trường Loan Category trên F1 – Master data   Default: FIV",
    length: 30,
    default: () => "'FIV'"
  })
  inSpouseIdC: string;

  @Column("varchar", {
    name: "in_bankname",
    nullable: true,
    comment: "Trường Bank Name trên F1 – Master data",
    length: 24
  })
  inBankname: string | null;

  @Column("varchar", {
    name: "in_bankbranch",
    nullable: true,
    comment: "Trường Bank Branch trên F1",
    length: 100
  })
  inBankbranch: string | null;

  @Column("varchar", {
    name: "in_acctype",
    nullable: true,
    comment:
      "Trường Account Type trên F1   SAVINGS - SAVINGS ACCOUNT  CURRENT - CURRENT ACCOUNT  OVRDRAFT - OVRDRAFT ACCOUNT  JOINT   - JOINT ACCOUNT   API nhận Code: SAVINGS  - CURRENT – OVRDRAFT - JOINT ",
    length: 24
  })
  inAcctype: string | null;

  @Column("varchar", {
    name: "in_accno",
    nullable: true,
    comment: "Trường Account No. trên F1",
    length: 60
  })
  inAccno: string | null;

  @Column("varchar", {
    name: "in_dueday",
    nullable: true,
    comment: "Trường Due Day trên F1",
    length: 2
  })
  inDueday: string | null;

  @Column("varchar", {
    name: "in_notecode",
    nullable: true,
    comment:
      'Trường Note Code trên F1 – Master data  dùng code "DE_MOBILE" cho trường CMND cũ trên mobile',
    length: 20
  })
  inNotecode: string | null;

  @Column("varchar", {
    name: "in_notedetails",
    nullable: true,
    comment: "Trường Note Details trên F1",
    length: 3000
  })
  inNotedetails: string | null;

  @Column("varchar", {
    name: "note_notecode",
    nullable: true,
    length: 20
  })
  noteNotecode: string | null;

  @Column("varchar", {
    name: "note_notedetails",
    nullable: true,
    length: 3000
  })
  noteNotedetails: string | null;
  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column("varchar", {
    name: "created_by",
    nullable: true,
    length: 255,
    comment: "user id who create "
  })
  createdBy: string;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("varchar", { name: "updated_by", nullable: true, length: 255 })
  updatedBy: string;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("varchar", { name: "deleted_by", nullable: true, length: 255 })
  deletedBy: string;
}
