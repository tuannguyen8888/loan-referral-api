import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ptf_employment_information", { schema: "loan_referral" })
export class PtfEmploymentInformation {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "loan_profile_id" })
  loanProfileId: number;

  @Column("varchar", {
    name: "house_number_and_street",
    nullable: true,
    length: 255
  })
  houseNumberAndStreet: string | null;

  @Column("int", { name: "city_id", nullable: true })
  cityId: number | null;

  @Column("int", { name: "district_id", nullable: true })
  districtId: number | null;

  @Column("int", { name: "ward_id", nullable: true })
  wardId: number | null;

  @Column("int", { name: "economical_status", nullable: true })
  economicalStatus: number | null;

  @Column("varchar", {
    name: "company_university_name",
    nullable: true,
    length: 255
  })
  companyUniversityName: string | null;

  @Column("int", { name: "profession", nullable: true })
  profession: number | null;

  @Column("varchar", {
    name: "employed_at_last_work",
    nullable: true,
    length: 10
  })
  employedAtLastWork: string | null;

  @Column("double", { name: "income", nullable: true, precision: 22 })
  income: number | null;

  @Column("double", {
    name: "monthly_payments_other_loans",
    nullable: true,
    precision: 22
  })
  monthlyPaymentsOtherLoans: number | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column("varchar", { name: "created_by", nullable: true, length: 255 })
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
