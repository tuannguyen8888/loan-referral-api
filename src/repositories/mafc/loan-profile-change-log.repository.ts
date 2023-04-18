import { EntityRepository, Repository } from "typeorm";
import { LoanProfileChangeLog } from "../../entities/index";

@EntityRepository(LoanProfileChangeLog)
export class LoanProfileChangeLogRepository extends Repository<
  LoanProfileChangeLog
> {}
