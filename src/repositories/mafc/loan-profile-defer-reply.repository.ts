import { EntityRepository, Repository } from "typeorm";
import {
  LoanProfile,
  LoanProfileDefer,
  LoanProfileDeferReply
} from "../../entities/index";

@EntityRepository(LoanProfileDeferReply)
export class LoanProfileDeferReplyRepository extends Repository<
  LoanProfileDeferReply
> {}
