import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("mafc_masterdata_saleoffice")
export class SaleOfficeMasterData {
  @PrimaryColumn("varchar", { name: "inspector_id" })
  inspectorid: string;

  @Column("varchar", { name: "inspector_name", length: 255 })
  inspectorname: string;

  @Column("tinyint", { name: "is_active", default: false })
  isactive: boolean;
}
