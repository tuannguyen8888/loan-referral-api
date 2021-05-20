import { EntityRepository, Repository } from "typeorm";
import { PtfAddress } from "../../entities";

@EntityRepository(PtfAddress)
export class PtfAddressRepository extends Repository<PtfAddress> {}
