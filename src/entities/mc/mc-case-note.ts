import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mc_case_note", { schema: "loan_referral" })
export class McCaseNote {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "appNumber",
    nullable: true,
    default: 0,
    comment: "Mã hồ sơ vừa khởi tạo của Mobile For Sale"
  })
  appNumber: number;

  @Column("varchar", {
    name: "app_uid",
    length: 255,
    nullable: true,
    default: "",
    comment: "AppId của hồ sơ gửi lên"
  })
  app_uid: string;

  @Column("varchar", {
    name: "note_content",
    length: 255,
    nullable: true,
    default: "",
    comment: "Nội dung note"
  })
  note_content: string;

  @Column("timestamp", {
    name: "note_date",
    default: () => "CURRENT_TIMESTAMP",
    comment: "Thời gian tạo note TIMESTAMP"
  })
  note_date: Date;

  @Column("varchar", {
    name: "usr_uid",
    length: 255,
    nullable: true,
    default: "",
    comment: "AppId của hồ sơ gửi lên"
  })
  usr_uid: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column("varchar", {
    name: "created_by",
    length: 255,
    default: ""
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
