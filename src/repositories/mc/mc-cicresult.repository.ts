import { EntityRepository, Repository } from "typeorm";
import {McCicResult} from "../../entities";

@EntityRepository(McCicResult)
export class McCicresultRepository extends Repository<McCicResult> {}
