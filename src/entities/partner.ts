import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("code_UNIQUE", ["code"], { unique: true })
@Entity("partner")
export class Partner {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "code", unique: true, length: 45 })
  code: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "secret_key", nullable: true, length: 255 })
  secretKey: string | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column("int", { name: "created_by", nullable: true })
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
