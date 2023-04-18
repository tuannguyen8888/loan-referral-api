import { EntityRepository, Repository } from "typeorm";
import { Address } from "../../entities/index";

@EntityRepository(Address)
export class AddressRepository extends Repository<Address> {}
