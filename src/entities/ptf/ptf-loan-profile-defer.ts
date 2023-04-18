import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ptf_loan_profile_defer", { schema: "loan_referral" })
export class PtfLoanProfileDefer {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "loan_profile_id" })
  loanProfileId: number;

  @Column("varchar", { name: "status", length: 45, default: () => "'NEW'" })
  status: string;

  @Column("varchar", { name: "defer_code", nullable: true, length: 45 })
  deferCode: string | null;

  @Column("text", { name: "defer_note" })
  deferNote: string;

  @Column("text", { name: "defer_reply", nullable: true })
  deferReply: string | null;

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
