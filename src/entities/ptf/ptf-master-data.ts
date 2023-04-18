import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ptf_master_data", { schema: "loan_referral" })
export class PtfMasterData {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "type", length: 45 })
  type: string;

  @Column("varchar", { name: "key", length: 45 })
  key: string;

  @Column("varchar", { name: "code", nullable: true, length: 45 })
  code: string | null;

  @Column("varchar", { name: "value", length: 255 })
  value: string;

  @Column("varchar", { name: "parent1_key", nullable: true, length: 45 })
  parent1Key: string | null;

  @Column("varchar", { name: "parent2_key", nullable: true, length: 45 })
  parent2Key: string | null;
}
