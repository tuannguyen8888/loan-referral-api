import { EntityRepository, Repository } from "typeorm";
import { Reference } from "src/entities";

@EntityRepository(Reference)
export class ReferenceRepository extends Repository<Reference> {}
