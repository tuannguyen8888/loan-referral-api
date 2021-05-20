import { EntityRepository, Repository } from "typeorm";
import { AttachFile, Process } from "src/entities/index";

@EntityRepository(AttachFile)
export class AttachFileRepository extends Repository<AttachFile> {}
