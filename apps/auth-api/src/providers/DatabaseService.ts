import { Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { $log } from "@tsed/logger";
import { knex as kn, Knex } from "knex";
import { databaseConnectionOptions } from "src/config/envs";

@Injectable({
    scope: ProviderScope.SINGLETON,
    type: ProviderType.SERVICE,
})
export class DatabaseService {
    private knex: Knex;
    private migrated: boolean;

    constructor() {
        $log.info("Starting database connection");
        this.knex = kn({
            client: "pg",
            connection: {
                ...databaseConnectionOptions
            }
        });

        this.migrated = false;
    }

    get database(): Knex {
        return this.getDatabase();
    }
    public getDatabase(): Knex {
        if (!this.migrated) throw new Error("Database access before migration");

        return this.knex;
    }

    public async migrate(): Promise<void> {
        if (this.migrated) return;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const migrations = await this.knex.migrate.list();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const completed: Migration[] = migrations[0];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const todo: Migration[] = migrations[1];

        $log.info({
            "event": "Starting migration",
            "migrations": {
                "completed": completed.map(x => x.name),
                "todo": todo.map(x => x.name),
            }
        });

        await this.knex.migrate.latest();
        this.migrated = true;
    }

    public async destroy() {
        return this.knex.destroy();
    }
}

type Migration = {
    name: string;
}
