import { EntityRepository, Repository } from "typeorm";
import { LoanProfile } from "../../entities/index";

@EntityRepository(LoanProfile)
export class LoanProfileRepository extends Repository<LoanProfile> {}
