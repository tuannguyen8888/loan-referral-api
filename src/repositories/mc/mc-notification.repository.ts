import { EntityRepository, Repository } from "typeorm";
import { McNotification } from "../../entities";

@EntityRepository(McNotification)
export class McNotificationRepository extends Repository<McNotification> {}
