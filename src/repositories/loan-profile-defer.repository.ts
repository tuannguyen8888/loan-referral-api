import { EntityRepository, Repository } from "typeorm";
import {LoanProfile, LoanProfileDefer} from "../entities";

@EntityRepository(LoanProfileDefer)
export class LoanProfileDeferRepository extends Repository<LoanProfileDefer> {}
