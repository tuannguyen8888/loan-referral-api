import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("vib_introduce", { schema: "loan_referral" })
export class VIBIntroduce {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "regisdate",
    default: 0,
    nullable: true,
    comment: "Ngày đăng ký"
  })
  regisdate: number;

  @Column("varchar", {
    name: "source",
    length: 255,
    nullable: true,
    default: "",
    comment: "Nguồn"
  })
  source: string;

  @Column("varchar", {
    name: "introduceby",
    length: 255,
    nullable: true,
    default: "",
    comment: "Người giới thiệu"
  })
  introduceby: string;

  @Column("varchar", {
    name: "cardtype",
    length: 255,
    nullable: true,
    default: "",
    comment: "Loại thẻ"
  })
  cardtype: string;

  @Column("varchar", {
    name: "customername",
    length: 255,
    nullable: true,
    default: "",
    comment: "Tên khách hàng"
  })
  customername: string;

  @Column("varchar", {
    name: "customerphone",
    length: 20,
    nullable: true,
    default: "",
    comment: "Số điện thoại khách hàng"
  })
  customerphone: string;

  @Column("varchar", {
    name: "province",
    length: 20,
    nullable: true,
    default: "",
    comment: "Tỉnh / Thành"
  })
  province: string;

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
