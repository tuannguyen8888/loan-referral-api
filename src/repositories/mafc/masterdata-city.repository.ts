import { EntityRepository, Repository } from "typeorm";
import { CityMasterData } from "src/entities";

@EntityRepository(CityMasterData)
export class CityRepository extends Repository<CityMasterData> {}
