import { EntityRepository, Repository } from "typeorm";
import { VIBIntroduce } from "../../entities/vib/vib-introduce-entiy";

@EntityRepository(VIBIntroduce)
export class VibIntroduceRepository extends Repository<VIBIntroduce> {}
