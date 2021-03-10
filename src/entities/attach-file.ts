import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("attach_file")
export class AttachFile {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "loan_profile_id" })
  loanProfileId: number;

  @Column("varchar", { name: "doc_code", length: 45 })
  docCode: string;

  @Column("varchar", { name: "url", nullable: true, length: 255 })
  url: string | null;

    @Column("timestamp", {
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: Date;

    @Column("varchar", {
        name: "created_by",
        nullable: true, length: 255,
        comment: "user id who create "
    })
    createdBy: string;

    @Column("timestamp", { name: "updated_at", nullable: true })
    updatedAt: Date | null;

    @Column("varchar", { name: "updated_by", nullable: true, length: 255 })
    updatedBy: string;

    @Column("timestamp", { name: "deleted_at", nullable: true })
    deletedAt: Date | null;

    @Column("varchar", { name: "deleted_by", nullable: true, length: 255})
    deletedBy: string;
}
