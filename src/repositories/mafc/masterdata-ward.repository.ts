import { EntityRepository, Repository } from "typeorm";
import { WardMasterData } from "src/entities";

@EntityRepository(WardMasterData)
export class WardRepository extends Repository<WardMasterData> {}
