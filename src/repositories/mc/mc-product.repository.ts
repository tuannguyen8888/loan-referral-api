import { EntityRepository, Repository } from "typeorm";
import {McProductResponseDto} from "../../modules/mc/mc-product/dto";

@EntityRepository(McProductResponseDto)
export class McProductRepository extends Repository<McProductResponseDto> {}
