import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("reference")
export class Reference {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "loan_profile_id" })
  loanProfileId: number;

  @Column("varchar", {
    name: "title",
    comment: "Title trên Finnone: MR.; MRS.; MS.",
    length: 50
  })
  title: string;

  @Column("varchar", {
    name: "referee_name",
    nullable: true,
    comment: "Referee Name  trên Finnone",
    length: 250
  })
  refereeName: string | null;

  @Column("varchar", {
    name: "referee_relation",
    nullable: true,
    comment:
      "Referee Relation  trên Finnone\n•\tR  - Relative\n•\tCA – CO Applicant\n•\tWH  - Wife/Husband\n•\tF – Friend\n•\tC - Colleague\n",
    length: 8
  })
  refereeRelation: string | null;

  @Column("varchar", {
    name: "phone_1",
    nullable: true,
    comment: "Phone 1 trên Finnone",
    length: 24
  })
  phone_1: string | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column("int", {
    name: "created_by",
    nullable: true,
    comment: "user id who create "
  })
  createdBy: number | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("int", { name: "updated_by", nullable: true })
  updatedBy: number | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("int", { name: "deleted_by", nullable: true })
  deletedBy: number | null;
}
