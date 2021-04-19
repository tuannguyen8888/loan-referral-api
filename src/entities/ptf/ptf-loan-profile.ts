import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ptf_loan_profile")
export class LoanProfile {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "partner_id" })
  partnerId: number;

  @Column("varchar", {
    name: "loan_application_id",
    comment: "Mã hồ sơ vay",
    length: 45
  })
  loanApplicationId: string;

  @Column("varchar", {
    name: "loan_public_id",
    comment: "Mã khoản vay public cho đối tác, khách hàng",
    length: 45
  })
  loanPublicId: string;

  @Column("varchar", { name: "fv_status", nullable: true, length: 45 })
  fvStatus: string;

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
    comment: "Tên đệm khách hàng",
    nullable: true,
    length: 30
  })
  middleName: string;

  @Column("varchar", {
    name: "last_name",
    comment: "Họ khách hàng",
    length: 30
  })
  lastName: string;

  @Column("int", { name: "gender", default: () => 0 })
  gender: number;

  @Column("varchar", {
    name: "birth_date",
    length: 10
  })
  birthDate: string | null;

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
  idIssueDate: string | null;

  @Column("int", { name: "id_issue_city", default: () => 0 })
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

  @Column("varchar", {
    name: "primary_mobile",
    length: 20
  })
  primaryMobile: string;

  @Column("varchar", {
    name: "home_phone",
    length: 20
  })
  homePhone: string;

  @Column("varchar", {
    name: "secondary_mobile",
    length: 20
  })
  secondaryMobile: string;

  @Column("varchar", {
    name: "email",
    length: 255
  })
  email: string;

  @Column("int", { name: "social_account_type" })
  socialAccountType: number;

  @Column("varchar", { name: "social_account_details", length: 255 })
  socialAccountDetails: number;

  @Column("int", { name: "marital_status" })
  maritalStatus: number;

  @Column("int", { name: "accompaniment_of_client", default: () => 0 })
  accompanimentOfClient: number;

  @Column("int", { name: "number_of_children", default: () => 0 })
  numberOfChildren: number;

  @Column("int", { name: "education", default: () => 0 })
  education: number;

  @Column("int", { name: "disbursement_method", default: () => 0 })
  disbursementMethod: number;
  ssss;
  @Column("varchar", { name: "account_number", length: 255 })
  accountNumber: number;

  @Column("int", { name: "bank_name_id", default: () => 0 })
  bankNameId: number;

  @Column("int", { name: "bank_branch_id", default: () => 0 })
  bankBranchId: number;

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
