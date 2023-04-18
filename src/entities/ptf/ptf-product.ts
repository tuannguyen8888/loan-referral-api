import { Column, Entity } from "typeorm";

@Entity("ptf_product", { schema: "loan_referral" })
export class PtfProduct {
  @Column("varchar", { primary: true, name: "id", length: 100 })
  id: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "description", length: 255 })
  description: string;

  @Column("varchar", { name: "status", length: 45, default: () => "'ACTIVE'" })
  status: string;

  @Column("decimal", {
    name: "min_amount",
    nullable: true,
    precision: 18,
    scale: 0
  })
  minAmount: string | null;

  @Column("decimal", {
    name: "max_amount",
    nullable: true,
    precision: 18,
    scale: 0
  })
  maxAmount: string | null;

  @Column("int", { name: "min_term", nullable: true })
  minTerm: number | null;

  @Column("int", { name: "max_term", nullable: true })
  maxTerm: number | null;

  @Column("varchar", { name: "require_doc_types", nullable: true, length: 255 })
  requireDocTypes: string | null;
}
