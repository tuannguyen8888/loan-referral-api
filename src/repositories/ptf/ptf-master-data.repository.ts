import { EntityRepository, Repository } from "typeorm";
import { PtfMasterData} from "../../entities";

@EntityRepository(PtfMasterData)
export class PtfMasterDataRepository extends Repository<PtfMasterData> {}
