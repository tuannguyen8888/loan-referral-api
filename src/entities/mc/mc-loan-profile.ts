import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mc_loan_profile", { schema: "loan_referral" })
export class McLoanProfile {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "citizenId",
    length: 20,
    nullable: true,
    default: "",
    comment: "Chứng minh thư"
  })
  citizenId: string;

  @Column("varchar", {
    name: "customerName",
    length: 255,
    nullable: true,
    default: "",
    comment: "Tên khách hàng"
  })
  customerName: string;

  @Column("varchar", {
    name: "gender",
    length: 1,
    default: "",
    nullable: true
  })
  gender: number;

  @Column("varchar", {
    name: "address",
    length: 255,
    nullable: true,
    default: ""
  })
  address: string;

  @Column("varchar", {
    name: "compName",
    length: 255,
    nullable: true,
    default: ""
  })
  compName: string;

  @Column("varchar", {
    name: "catType",
    length: 20,
    nullable: true,
    default: "",
    comment: "Phân loại category"
  })
  catType: string;

  @Column("varchar", {
    name: "compAddrStreet",
    length: 255,
    nullable: true,
    default: "",
    comment: "Địa chỉ công ty"
  })
  compAddrStreet: string;

  @Column("varchar", {
    name: "officeNumber",
    length: 20,
    nullable: true,
    default: "",
    comment: "Số điện thoại công ty"
  })
  officeNumber: string;

  @Column("varchar", {
    name: "companyTaxNumber",
    length: 20,
    nullable: true,
    default: "",
    comment: "Mã số thuế"
  })
  companyTaxNumber: string;

  @Column("varchar", {
    name: "saleCode",
    length: 20,
    nullable: true,
    default: "",
    comment: "Bắt buộc khi tích hợp API (Mã SaleCode)"
  })
  saleCode: string;

  @Column("int", {
    name: "productId",
    default: 0,
    nullable: true,
    comment: "Mã sản phẩm"
  })
  productId: number;

  @Column("int", {
    name: "tempResidence",
    default: 0,
    nullable: true,
    comment: "Địa chỉ sống trùng hộ khẩu(1 - Có, 0 - Không)"
  })
  tempResidence: number;

  @Column("double", {
    name: "loanAmount",
    default: 0,
    nullable: true,
    comment: "Số tiền đề nghị vay"
  })
  loanAmount: number;

  @Column("int", {
    name: "loanTenor",
    default: 0,
    nullable: true,
    comment: "Kỳ hạn vay"
  })
  loanTenor: number;

  @Column("int", {
    name: "hasInsurance",
    default: 0,
    nullable: true,
    comment: "KH có tham gia bảo hiểm hay không(1 - Có,0 - Không)"
  })
  hasInsurance: number;

  @Column("varchar", {
    name: "issuePlace",
    length: 255,
    nullable: true,
    default: "",
    comment: "Địa điểm đăng ký VKTD"
  })
  issuePlace: string;

  @Column("varchar", {
    name: "shopCode",
    length: 50,
    nullable: true,
    default: "",
    comment: "Mã HUB/KIOSK"
  })
  shopCode: string;

  @Column("int", {
    name: "kiosid",
    default: 0,
    nullable: true
  })
  kiosid: number;

  @Column("varchar", {
    name: "mobileProductType",
    length: 20,
    nullable: true,
    default: "",
    comment: "Loại sản phẩm(Cash Loan,Credit Card)"
  })
  mobileProductType: string;

  @Column("varchar", {
    name: "mobileIssueDateCitizen",
    length: 20,
    nullable: true,
    default: "",
    comment: "Ngày đăng ký CMND Định dạng: dd/mm/yyyy"
  })
  mobileIssueDateCitizen: string;

  @Column("int", {
    name: "profileid",
    nullable: true,
    default: 0,
    comment: "Mã hồ sơ vừa khởi tạo của Mobile For Sale"
  })
  profileid: number;

  @Column("varchar", {
    name: "appid",
    length: 255,
    nullable: true,
    default: "",
    comment: "Mã hồ sơ vừa khởi tạo của Mobile For Sale"
  })
  appid: number;

  @Column("int", {
    name: "appNumber",
    nullable: true,
    default: 0,
    comment: "Mã hồ sơ vừa khởi tạo của Mobile For Sale"
  })
  appNumber: number;

  @Column("int", {
    name: "cicResult",
    nullable: true,
    default: 0,
    comment: "mã cic"
  })
  cicResult: number;

  @Column("varchar", {
    name: "cicDescription",
    length: 255,
    nullable: true,
    default: "",
    comment: "Mô tả cic"
  })
  cicDescription: string;

  @Column("varchar", {
    name: "status",
    nullable: true,
    default: "",
    comment: "Trạng thái hồ sơ"
  })
  status: string;
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
