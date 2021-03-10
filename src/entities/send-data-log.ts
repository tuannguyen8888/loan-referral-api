import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("send_data_log")
export class SendDataLog {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

    @Column("varchar", { name: "api_url", length: 255 })
    apiUrl: string;

    @Column("text", { name: "api_url"})
    data: string;

    @Column("text", { name: "api_url"})
    result: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;
}
