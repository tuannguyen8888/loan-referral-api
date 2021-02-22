import { EntityRepository, Repository } from "typeorm";
import { LoanProfile } from "../entities";

@EntityRepository(LoanProfile)
export class LoanProfileRepository extends Repository<LoanProfile> {}
