import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("mafc_masterdata_bank")
export class BankMasterData {
  @PrimaryColumn("varchar", { name: "bank_id" })
  bankid: string;

  @Column("varchar", { name: "bank_desc", length: 255 })
  bankdesc: string;
}
