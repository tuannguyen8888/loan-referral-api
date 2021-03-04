import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("address")
export class Address {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "loan_profile_id" })
  loanProfileId: number;

  @Column("varchar", {
    name: "address_type",
    comment: "PERMNENT, CURRES\n",
    length: 45
  })
  addressType: string;

  @Column("varchar", {
    name: "property_status",
    comment: "O, R, F ",
    length: 45
  })
  propertyStatus: string;

  @Column("varchar", { name: "address_1st_line", nullable: true, length: 255 })
  address_1stLine: string | null;

  @Column("varchar", {
    name: "country",
    nullable: true,
    comment:
      "Country trên Finnone (Master data)\nDefault value: Code 189 – Việt Nam – API nhận code 189",
    length: 8
  })
  country: string | null;

  @Column("varchar", { name: "city", nullable: true, length: 8 })
  city: string | null;

  @Column("varchar", { name: "district", nullable: true, length: 8 })
  district: string | null;

  @Column("varchar", { name: "ward", nullable: true, length: 8 })
  ward: string | null;

  @Column("varchar", {
    name: "roomno",
    nullable: true,
    comment: "Room No. from Renting trên Finnone",
    length: 45
  })
  roomno: string | null;

  @Column("int", {
    name: "stayduratcuradd_y",
    nullable: true,
    comment: "Stay Duration at Current Address year trên Finnone"
  })
  stayduratcuraddY: number | null;

  @Column("int", {
    name: "stayduratcuradd_m",
    nullable: true,
    comment: "Stay Duration at Current Address month trên Finnone"
  })
  stayduratcuraddM: number | null;

  @Column("varchar", {
    name: "mailing_address",
    nullable: true,
    comment:
      "Mailing Address trên Finnone: \nY  (Đối với addresstype là CURRES), \nN  (Đối với addresstype là PERMNENT)",
    length: 1
  })
  mailingAddress: string | null;

  @Column("varchar", {
    name: "mobile",
    nullable: true,
    comment: "Mobile trên Finnone",
    length: 24
  })
  mobile: string | null;

  @Column("varchar", {
    name: "landlord",
    nullable: true,
    comment: "Land-Lord Name trên Finnone",
    length: 40
  })
  landlord: string | null;

  @Column("varchar", {
    name: "landmark",
    nullable: true,
    comment: "Landmark trên Finnone",
    length: 200
  })
  landmark: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 50 })
  email: string | null;

  @Column("varchar", {
    name: "fixphone",
    nullable: true,
    comment: "Trường Fixphone trên F1",
    length: 24
  })
  fixphone: string | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column("int", {
    name: "created_by",
    nullable: true,
    comment: "user id who create "
  })
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
