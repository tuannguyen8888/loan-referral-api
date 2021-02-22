import { EntityRepository, Repository } from "typeorm";
import { LoanProfileChangeLog } from "../entities";

@EntityRepository(LoanProfileChangeLog)
export class LoanProfileChangeLogRepository extends Repository<
  LoanProfileChangeLog
> {}
