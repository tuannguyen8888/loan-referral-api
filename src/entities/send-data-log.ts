import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("send_data_log")
export class SendDataLog {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "api_url", length: 255 })
  apiUrl: string;

  @Column("text", { name: "keyword" })
  keyword: string;

  @Column("text", { name: "data" })
  data: string;

  @Column("text", { name: "result" })
  result: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column("varchar", { name: "created_by" , length: 45})
  createdBy: string;
}
