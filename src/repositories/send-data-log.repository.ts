import { EntityRepository, Repository } from "typeorm";
import { AttachFile, Process, SendDataLog } from "src/entities";

@EntityRepository(SendDataLog)
export class SendDataLogRepository extends Repository<SendDataLog> {}
