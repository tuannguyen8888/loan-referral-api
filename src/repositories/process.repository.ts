import { EntityRepository, Repository } from "typeorm";
import { Process } from "src/entities";

@EntityRepository(Process)
export class ProcessRepository extends Repository<Process> {}
