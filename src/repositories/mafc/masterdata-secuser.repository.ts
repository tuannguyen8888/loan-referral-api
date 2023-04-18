import { EntityRepository, Repository } from "typeorm";
import { SecUserMasterData } from "src/entities";

@EntityRepository(SecUserMasterData)
export class SecUserRepository extends Repository<SecUserMasterData> {}
