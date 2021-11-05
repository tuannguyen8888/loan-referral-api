import { EntityRepository, Repository } from "typeorm";
import { McLoanProfile } from "../../entities";

@EntityRepository(McLoanProfile)
export class McLoanProfileRepository extends Repository<McLoanProfile> {}
