import { EntityRepository, Repository } from "typeorm";
import { LoanCategoryMasterData } from "src/entities";

@EntityRepository(LoanCategoryMasterData)
export class LoanCategoryRepository extends Repository<
  LoanCategoryMasterData
> {}
