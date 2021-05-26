import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ptf_related_person", { schema: "loan_referral" })
export class PtfRelatedPerson {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "loan_profile_id" })
  loanProfileId: number;

  @Column("int", { name: "related_person_type" })
  relatedPersonType: number;

  @Column("varchar", { name: "family_name", length: 50 })
  familyName: string;

  @Column("varchar", { name: "middle_name", length: 50 })
  middleName: string;

  @Column("varchar", { name: "first_name", length: 50 })
  firstName: string;

  @Column("varchar", { name: "phone", nullable: true, length: 24 })
  phone: string | null;

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
