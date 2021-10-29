import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mc_notification", { schema: "loan_referral" })
export class McNotification {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "profileid",
    nullable: true,
    default: 0,
    comment: "Mã hồ sơ của hệ thống Mobile For Sales"
  })
  profileid: number;

  @Column("int", {
    name: "appNumber",
    nullable: true,
    default: 0,
    comment: "Mã hồ sơ vừa khởi tạo của Mobile For Sale"
  })
  appNumber: number;

  @Column("varchar", {
    name: "appId",
    length: 255,
    nullable: true,
    default: "",
    comment: "AppId của hồ sơ gửi lên"
  })
  appId: string;

  @Column("varchar", {
    name: "currentStatus",
    length: 20,
    nullable: true,
    default: "",
    comment: "Nội dung note"
  })
  currentStatus: string;

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
