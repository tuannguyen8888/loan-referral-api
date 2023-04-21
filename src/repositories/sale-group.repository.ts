import { EntityRepository, Repository } from "typeorm";
import { SaleGroup } from "src/entities";

@EntityRepository(SaleGroup)
export class SaleGroupRepository extends Repository<SaleGroup> {}
