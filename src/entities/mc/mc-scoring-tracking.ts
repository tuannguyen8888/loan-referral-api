import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mc_scoring_tracking", { schema: "loan_referral" })
export class McScoringTracking {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "typeScore",
    length: 10,
    nullable: true,
    default: "",
    comment: "Nhà mạng"
  })
  typeScore: string;

  @Column("varchar", {
    name: "primaryPhone",
    length: 20,
    nullable: true,
    default: "",
    comment: "Nhà mạng"
  })
  primaryPhone: string;

  @Column("varchar", {
    name: "fullname",
    length: 255,
    nullable: true,
    default: "",
    comment: "Tên khách hàng"
  })
  fullname: string;

  @Column("varchar", {
    name: "nationalId",
    length: 20,
    nullable: true,
    default: "",
    comment: "Số CMND"
  })
  nationalId: string;

  @Column("varchar", {
    name: "verificationCode",
    length: 20,
    nullable: true,
    default: "",
    comment: "Mã otp"
  })
  verificationCode: string;

  @Column("text", {
    name: "requestSendOtp3P",
    nullable: true,
    default: "",
    comment: "Phản hàng yêu cầu OTP"
  })
  requestSendOtp3P: string;

  @Column("text", {
    name: "requestScoring3P",
    nullable: true,
    default: "",
    comment: "Phản hồi kết quả chấm điểm"
  })
  requestScoring3P: string;

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
