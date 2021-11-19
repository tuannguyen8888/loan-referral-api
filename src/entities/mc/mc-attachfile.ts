import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mc_attachfile", { schema: "loan_referral" })
export class McAttachfile {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "profileid",
    nullable: true,
    default: 0,
    comment: "Mã hồ sơ của hệ thống Mobile For Sales"
  })
  profileid: number;

  @Column("varchar", {
    name: "appId",
    length: 255,
    nullable: true,
    default: "",
    comment: "AppId của hồ sơ gửi lên"
  })
  appId: string;

  @Column("int", {
    name: "appNumber",
    nullable: true,
    default: 0,
    comment: "Mã hồ sơ vừa khởi tạo của Mobile For Sale"
  })
  appNumber: number;

  @Column("varchar", {
    name: "fileName",
    length: 255,
    nullable: true,
    default: "",
    comment: "Tên file ảnh upload case"
  })
  fileName: string;

  @Column("varchar", {
    name: "documentCode",
    length: 255,
    nullable: true,
    default: "",
    comment: "Mã của document"
  })
  documentCode: string;

  @Column("varchar", {
    name: "mimeType",
    length: 10,
    nullable: true,
    default: "",
    comment: "Định dạng file upload(jpg,jpeg,png)"
  })
  mimeType: string;

  @Column("int", {
    name: "groupId",
    nullable: true,
    default: 0,
    comment: "Mã của group"
  })
  groupId: number;

  @Column("string", {
    name: "url",
    length: 255,
    nullable: true,
    comment: "Định dạng file upload(jpg,jpeg,png)"
  })
  url: string;

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
