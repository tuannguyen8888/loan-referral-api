import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ptf_loan_profile", { schema: "loan_referral" })
export class PtfLoanProfile {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "partner_id" })
  partnerId: number;

  @Column("varchar", {
    name: "loan_application_id",
    comment: "Mã hồ sơ vay",
    length: 45,
    nullable: true
  })
  loanApplicationId: string;

  @Column("varchar", {
    name: "loan_public_id",
    comment: "Mã khoản vay public cho đối tác, khách hàng",
    length: 45,
    nullable: true
  })
  loanPublicId: string;

  @Column("varchar", { name: "fv_status", nullable: true, length: 45 })
  fvStatus: string | null;

  @Column("varchar", { name: "loan_status", nullable: true, length: 45 })
  loanStatus: string | null;

  @Column("varchar", {
    name: "first_name",
    comment: "Tên khách hàng",
    length: 30
  })
  firstName: string;

  @Column("varchar", {
    name: "middle_name",
    nullable: true,
    comment: "Tên đệm khách hàng",
    length: 30
  })
  middleName: string | null;

  @Column("varchar", {
    name: "last_name",
    comment: "Họ khách hàng",
    length: 30
  })
  lastName: string;

  @Column("int", { name: "gender", default: () => "'0'" })
  gender: number;

  @Column("varchar", { name: "birth_date", length: 10 })
  birthDate: string;

  @Column("varchar", {
    name: "id_document_number",
    comment: "Số CMND/CCCD",
    length: 20
  })
  idDocumentNumber: string;

  @Column("varchar", {
    name: "id_issue_date",
    comment: "Ngày cấp CMND/CCCD",
    length: 10
  })
  idIssueDate: string;

  @Column("int", { name: "id_issue_city", default: () => "'0'" })
  idIssueCity: number;

  @Column("varchar", {
    name: "frb_document_number",
    comment: "Sổ hộ khẩu",
    length: 20
  })
  frbDocumentNumber: string;

  @Column("varchar", {
    name: "client_photo_url",
    comment: "Ảnh khách hàng",
    length: 255
  })
  clientPhotoUrl: string;

  @Column("varchar", { name: "primary_mobile", length: 20 })
  primaryMobile: string;

  @Column("varchar", { name: "home_phone", length: 20 })
  homePhone: string;

  @Column("varchar", { name: "secondary_mobile", length: 20 })
  secondaryMobile: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("int", { name: "social_account_type" })
  socialAccountType: number;

  @Column("varchar", { name: "social_account_details", length: 255 })
  socialAccountDetails: string;

  @Column("int", { name: "current_and_permanent_same", default: () => "'0'" })
  currentAndPermanentSame: number;

  @Column("int", { name: "marital_status" })
  maritalStatus: number;

  @Column("int", { name: "accompaniment_of_client", default: () => "'0'" })
  accompanimentOfClient: number;

  @Column("int", { name: "number_of_children", default: () => "'0'" })
  numberOfChildren: number;

  @Column("int", { name: "education", default: () => "'0'" })
  education: number;

  @Column("int", { name: "disbursement_method", default: () => "'0'" })
  disbursementMethod: number;

  @Column("varchar", { name: "account_number", nullable: true, length: 255 })
  accountNumber: string | null;

  @Column("int", { name: "bank_name_id", nullable: true, default: () => "'0'" })
  bankNameId: number | null;

  @Column("int", { name: "bank_city_id", nullable: true })
  bankCityId: number | null;

  @Column("int", {
    name: "bank_branch_id",
    nullable: true,
    default: () => "'0'"
  })
  bankBranchId: number | null;

  @Column("varchar", { name: "bank_code", nullable: true, length: 45 })
  bankCode: string | null;

  @Column("varchar", { name: "partner_id_code", length: 45 })
  partnerIdCode: string;

  @Column("int", { name: "service_name" })
  serviceName: number;

  @Column("int", { name: "i_care_lead", nullable: true })
  iCareLead: number | null;

  @Column("date", { name: "creation_date", nullable: true })
  creationDate: string | null;

  @Column("varchar", {
    name: "credit_product",
    comment: "Mã sản phẩm vay",
    length: 45
  })
  creditProduct: string;

  @Column("varchar", { name: "state_code", nullable: true, length: 45 })
  stateCode: string | null;

  @Column("decimal", {
    name: "amount",
    comment: "Số tiền vay",
    precision: 18,
    scale: 0
  })
  amount: string;

  @Column("int", { name: "loan_purpose", comment: "Mục đích vay" })
  loanPurpose: number;

  @Column("int", { name: "loan_term" })
  loanTerm: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column("varchar", {
    name: "created_by",
    nullable: true,
    comment: "user id who create ",
    length: 255
  })
  createdBy: string | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("varchar", { name: "updated_by", nullable: true, length: 255 })
  updatedBy: string | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("varchar", { name: "deleted_by", nullable: true, length: 255 })
  deletedBy: string | null;
}
