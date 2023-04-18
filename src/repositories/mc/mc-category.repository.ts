import { EntityRepository, Repository } from "typeorm";
import { McCategoryResponseDto } from "../../modules/mc/mc-loan-profile/dto";

@EntityRepository(McCategoryResponseDto)
export class McCategoryRepository extends Repository<McCategoryResponseDto> {}
