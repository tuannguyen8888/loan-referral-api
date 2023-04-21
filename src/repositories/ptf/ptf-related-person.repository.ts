import { EntityRepository, Repository } from "typeorm";
import { PtfRelatedPerson } from "../../entities";

@EntityRepository(PtfRelatedPerson)
export class PtfRelatedPersonRepository extends Repository<PtfRelatedPerson> {}
