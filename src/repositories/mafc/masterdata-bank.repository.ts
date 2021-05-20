import { EntityRepository, Repository } from "typeorm";
import { BankMasterData } from "src/entities";

@EntityRepository(BankMasterData)
export class BankRepository extends Repository<BankMasterData> {}
