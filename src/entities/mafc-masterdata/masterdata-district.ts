import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("mafc_masterdata_district")
export class DistrictMasterData {
  @PrimaryColumn("varchar", { name: "lmc_CITYID_C" })
  lmc_CITYID_C: string;

  @Column("varchar", { name: "lmc_CITYNAME_C", length: 255 })
  lmc_CITYNAME_C: string;

  @Column("varchar", { name: "lmc_STATE_N", length: 7 })
  lmc_STATE_N: string;
}
