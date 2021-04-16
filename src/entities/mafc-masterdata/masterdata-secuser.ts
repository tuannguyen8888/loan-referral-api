import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("mafc_masterdata_secuser")
export class SecUserMasterData {
  @PrimaryColumn("binary", { name: "lsu_USER_ID_C", length: 255, })
  lsu_USER_ID_C: string;

  @Column("varchar", { name: "lsu_USER_NAME_C", length: 255 })
  lsu_USER_NAME_C: string;

}
