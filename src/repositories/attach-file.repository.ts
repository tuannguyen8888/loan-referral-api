import { EntityRepository, Repository } from "typeorm";
import {AttachFile, Process} from "src/entities";

@EntityRepository(AttachFile)
export class AttachFileRepository extends Repository<AttachFile> {}
