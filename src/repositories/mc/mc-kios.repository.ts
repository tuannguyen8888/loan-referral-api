import { EntityRepository, Repository } from "typeorm";
import { McKiosResponseDto } from "../../modules/mc/mc-kios/dto";

@EntityRepository(McKiosResponseDto)
export class McKiosRepository extends Repository<McKiosResponseDto> {}
