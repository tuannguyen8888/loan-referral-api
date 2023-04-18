import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mc_api_tracking", { schema: "loan_referral" })
export class McApiTracking {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "apiname",
    length: 255,
    nullable: true,
    default: "",
    comment: "Tên api"
  })
  apiname: string;

  @Column("varchar", {
    name: "url",
    length: 255,
    nullable: true,
    default: "",
    comment: "Nhà mạng"
  })
  url: string;

  @Column("varchar", {
    name: "method",
    length: 255,
    nullable: true,
    default: "",
    comment: "Phương thức"
  })
  method: string;

  @Column("text", {
    name: "payload",
    nullable: true,
    default: "",
    comment: "Dữ liệu đầu vào"
  })
  payload: string;

  @Column("text", {
    name: "response",
    nullable: true,
    default: "",
    comment: "Kết quả trả về"
  })
  response: string;

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
