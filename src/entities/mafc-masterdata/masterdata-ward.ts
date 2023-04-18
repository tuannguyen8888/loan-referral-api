import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("mafc_masterdata_ward")
export class WardMasterData {
  @PrimaryColumn("varchar", { name: "zip_code", length: 10 })
  zipcode: string;

  @Column("varchar", { name: "zip_desc" })
  zipdesc: string;

  @Column("varchar", { name: "city", length: 255 })
  city: string;

  @Column("tinyint", { name: "is_active", default: false })
  isactive: boolean;
}
