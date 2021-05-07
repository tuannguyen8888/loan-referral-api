import { EntityRepository, Repository } from "typeorm";
import { PtfAttachFile } from "../../entities";

@EntityRepository(PtfAttachFile)
export class PtfAttachFileRepository extends Repository<PtfAttachFile> {}
