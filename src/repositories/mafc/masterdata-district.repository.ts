import { EntityRepository, Repository } from "typeorm";
import { DistrictMasterData } from "src/entities";

@EntityRepository(DistrictMasterData)
export class DistrictRepository extends Repository<DistrictMasterData> {}
