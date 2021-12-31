import { EntityRepository, Repository } from "typeorm";
import { McProduct } from "../../entities";

@EntityRepository(McProduct)
export class McProductRepository extends Repository<McProduct> {}
