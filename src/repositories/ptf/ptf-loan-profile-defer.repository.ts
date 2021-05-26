import { EntityRepository, Repository } from "typeorm";
import { PtfLoanProfileDefer } from "../../entities";

@EntityRepository(PtfLoanProfileDefer)
export class PtfLoanProfileDeferRepository extends Repository<
  PtfLoanProfileDefer
> {}
