import { EntityRepository, Repository } from "typeorm";
import { PtfProduct } from "../../entities";

@EntityRepository(PtfProduct)
export class PtfProductRepository extends Repository<PtfProduct> {}
