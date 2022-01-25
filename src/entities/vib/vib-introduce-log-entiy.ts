import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("vib_introduce_log", { schema: "loan_referral" })
export class VIBIntroduceLog {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "introduceid",
    default: 0,
    nullable: true,
    comment: ""
  })
  introduceid: number;

  @Column("varchar", {
    name: "statuslead",
    length: 50,
    nullable: true,
    default: "",
    comment: "Tình trạng lead"
  })
  statuslead: string;

  @Column("varchar", {
    name: "statusapproval",
    length: 50,
    nullable: true,
    default: "",
    comment: "Tình trạng phê duyệt"
  })
  statusapproval: string;

  @Column("int", {
    name: "intidate",
    default: 0,
    nullable: true,
    comment: "Ngày tạo hồ sơ"
  })
  intidate: number;

  @Column("int", {
    name: "carddeliverydate",
    default: 0,
    nullable: true,
    comment: "Ngày giao thẻ"
  })
  carddeliverydate: number;

  @Column("int", {
    name: "cardactivedate",
    default: 0,
    nullable: true,
    comment: "Ngày kích hoạt thẻ"
  })
  cardactivedate: number;

  @Column("double", {
    name: "commission",
    default: 0,
    nullable: true,
    comment: "Số tiền hoa hồng"
  })
  commission: number;

  @Column("int", {
    name: "paid",
    default: 0,
    nullable: true,
    comment: "Đã trả hoa hồng"
  })
  paid: number;

  @Column("varchar", {
    name: "status",
    length: 20,
    default: "",
    nullable: true,
    comment: "Tình trang giới thiệu new,expired"
  })
  status: number;

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
