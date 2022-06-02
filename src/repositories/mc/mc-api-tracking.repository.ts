import { EntityRepository, Repository } from "typeorm";
import { McApiTracking } from "../../entities";

@EntityRepository(McApiTracking)
export class McApiTrackingRepository extends Repository<
  McApiTracking
> {}
