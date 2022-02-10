import { EntityRepository, Repository } from "typeorm";
import { VIBIntroduce } from "../../entities/vib/vib-introduce-entiy";
import { VIBIntroduceLog } from "../../entities";

@EntityRepository(VIBIntroduceLog)
export class VibIntroduceLogRepository extends Repository<VIBIntroduceLog> {}
