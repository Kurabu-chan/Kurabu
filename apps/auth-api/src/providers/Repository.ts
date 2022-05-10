import { Inject, Injectable } from "@tsed/di";
import { IEntity } from "src/entities/IEntity";
import { DatabaseService } from "./DatabaseService";

type EntityConstructor<TEntity extends IEntity> = new () => TEntity

@Injectable()
export class Repository<TEntity extends IEntity> {
    constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {
    }

    public getRepository(entity: EntityConstructor<TEntity>) {
        return this.databaseService.getDatabase()<TEntity>(entity.name);
    }
}
