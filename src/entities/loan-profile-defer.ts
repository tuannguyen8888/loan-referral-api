import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("loan_profile_defer")
export class LoanProfileDefer {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "loan_profile_id" })
  loanProfileId: number;

  @Column("varchar", { name: "id_f1", length: 45 })
  idF1: string;

  @Column("varchar", { name: "client_name", length: 255 })
  clientName: string;

  @Column("varchar", { name: "defer_code", length: 45 })
  deferCode: string;

  @Column("varchar", { name: "defer_note", length: 255 })
  deferNote: string;

  @Column("timestamp", {
    name: "defer_time"
  })
  deferTime: Date;

  @Column("varchar", { name: "status", length: 45 })
  status: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column("int", {
    name: "created_by",
    nullable: true,
    comment: "user id who create "
  })
  createdBy: number | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("int", { name: "updated_by", nullable: true })
  updatedBy: number | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("int", { name: "deleted_by", nullable: true })
  deletedBy: number | null;
}
