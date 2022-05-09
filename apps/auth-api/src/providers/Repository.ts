import { Inject, Injectable } from "@tsed/di";
import { IEntity } from "src/entities/IEntity";
import { knex, Knex } from "knex";
import { DatabaseService } from "./DatabaseService";

type EntityConstructor<TEntity extends IEntity> = new () => TEntity

@Injectable()
export class Repository<TEntity extends IEntity> {
    private repo?: Knex<TEntity, unknown[]>;

    constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {
    }

    public getRepository(entity: EntityConstructor<TEntity>) {
        if (!this.repo) {
            this.repo = knex<TEntity>(entity.name);
        }

        return this.repo;
    }
}
