import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("mafc_masterdata_city")
export class CityMasterData {
  @PrimaryColumn("varchar", { name: "state_id" })
  stateid: string;

  @Column("varchar", { name: "state_desc", length: 255 })
  statedesc: string;

  @Column("varchar", { name: "country_id", length: 255 })
  countryid: string;

  @Column("tinyint", { name: "is_active", default: false })
  isactive: boolean;
}
