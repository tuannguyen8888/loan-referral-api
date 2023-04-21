import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("mafc_masterdata_scheme")
export class SchemeMasterData {
  @PrimaryColumn({ name: "scheme_id" })
  schemeid: string;

  @Column("varchar", { name: "scheme_name", length: 255 })
  schemename: string;

  @Column("text", { name: "scheme_group" })
  schemegroup: string;

  @Column("text", { name: "product" })
  product: string;

  @Column("text", { name: "max_amtfin" })
  maxamtfin: string;

  @Column("text", { name: "min_amtfin" })
  minamtfin: string;

  @Column("text", { name: "max_tenure" })
  maxtenure: string;

  @Column("text", { name: "min_tenure" })
  mintenure: string;

  @Column("text", { name: "payment_channel" })
  paymentchannel: string;

  @Column("text", { name: "priority_c" })
  priorityc: string;

  @Column("tinyint", { name: "is_active", default: false })
  isactive: boolean;
}
