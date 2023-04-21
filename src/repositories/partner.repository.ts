import { EntityRepository, Repository } from "typeorm";
import { Partner } from "src/entities";

@EntityRepository(Partner)
export class PartnerRepository extends Repository<Partner> {}
