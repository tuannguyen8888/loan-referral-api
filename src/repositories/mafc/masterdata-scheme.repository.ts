import { EntityRepository, Repository } from "typeorm";
import { SchemeMasterData } from "src/entities";

@EntityRepository(SchemeMasterData)
export class SchemeRepository extends Repository<SchemeMasterData> {}
