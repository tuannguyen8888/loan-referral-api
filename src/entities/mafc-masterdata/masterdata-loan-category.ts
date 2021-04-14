import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("mafc_masterdata_loan_category")
export class LoanCategoryMasterData {
  @PrimaryColumn("varchar", { name: "lmc_CITYNAME_C", length: 255 })
  value: string;

  @Column("varchar", { name: "lmc_STATE_N", length: 255 })
  description: string;
}
