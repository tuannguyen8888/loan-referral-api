import { EntityRepository, Repository } from "typeorm";
import { McProduct, McScoringTracking } from "../../entities";

@EntityRepository(McScoringTracking)
export class McScoringTrackingRepository extends Repository<
  McScoringTracking
> {}
