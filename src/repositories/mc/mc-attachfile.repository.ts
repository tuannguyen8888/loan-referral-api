import { EntityRepository, Repository } from "typeorm";
import { McAttachfile } from "../../entities";

@EntityRepository(McAttachfile)
export class McAttachfileRepository extends Repository<McAttachfile> {}
