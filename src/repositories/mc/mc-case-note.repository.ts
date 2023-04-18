import { EntityRepository, Repository } from "typeorm";
import { McCaseNote } from "../../entities";

@EntityRepository(McCaseNote)
export class McCaseNoteRepository extends Repository<McCaseNote> {}
