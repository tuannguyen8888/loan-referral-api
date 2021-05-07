import { EntityRepository, Repository } from "typeorm";
import { PtfLoanProfile } from "../../entities";

@EntityRepository(PtfLoanProfile)
export class PtfLoanProfileRepository extends Repository<PtfLoanProfile> {}
