import { EntityRepository, Repository } from "typeorm";
import { PtfEmploymentInformation } from "../../entities";

@EntityRepository(PtfEmploymentInformation)
export class PtfEmploymentInformationRepository extends Repository<
  PtfEmploymentInformation
> {}
