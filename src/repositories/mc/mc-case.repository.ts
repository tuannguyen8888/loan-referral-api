import { EntityRepository, Repository } from "typeorm";
import {McCase} from "../../entities";

@EntityRepository(McCase)
export class McCaseRepository extends Repository<McCase> {}
