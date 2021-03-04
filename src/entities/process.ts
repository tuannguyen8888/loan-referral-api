import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("process")
export class Process {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "loan_profile_id" })
  loanProfileId: number;

  @Column("varchar", { name: "process_status", length: 45 })
  processStatus: string;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null;

  @Column("varchar", { name: "ref_table", nullable: true, length: 45 })
  refTable: string | null;

  @Column("int", { name: "id_ref", nullable: true })
  idRef: number | null;

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
