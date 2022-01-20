import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mc_product", { schema: "loan_referral" })
export class McProduct {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "productid",
    default: 0,
    nullable: true,
    comment: "ID sản phẩm"
  })
  productid: number;

  @Column("varchar", {
    name: "productcode",
    length: 255,
    nullable: true,
    default: "",
    comment: "Mã sản phẩm"
  })
  productcode: string;

  @Column("varchar", {
    name: "productname",
    length: 255,
    nullable: true,
    default: "",
    comment: "Tên sản phẩm"
  })
  productname: string;

  @Column("double", {
    name: "dsarate",
    default: 0,
    nullable: true,
    comment: "Hệ số áp dụng cho DSA"
  })
  dsarate: number;

  @Column("double", {
    name: "tsarate",
    default: 0,
    nullable: true,
    comment: "Hệ số áp dụng cho TSA"
  })
  tsarate: number;

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
