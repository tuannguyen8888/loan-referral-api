import { EntityRepository, Repository } from "typeorm";
import { SaleOfficeMasterData } from "src/entities";

@EntityRepository(SaleOfficeMasterData)
export class SaleOfficeRepository extends Repository<SaleOfficeMasterData> {}
