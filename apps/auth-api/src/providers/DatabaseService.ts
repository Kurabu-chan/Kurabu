import { ProviderScope, Scope, Service } from "@tsed/di";
import { $log } from "@tsed/logger";
import { knex as kn, Knex } from "knex";
import { databaseConnectionOptions } from "../config/envs";

let migrated = false;

@Service()
@Scope(ProviderScope.SINGLETON)
export class DatabaseService {
    private knex: Knex;

    constructor() {
        $log.info("Starting database connection");
        this.knex = kn({
            client: "pg",
            connection: {
                ...databaseConnectionOptions
            }
        });

        migrated = false;
    }

    get database(): Knex {
        return this.getDatabase();
    }
    public getDatabase(): Knex {
        if (!migrated) throw new Error("Database access before migration");

        return this.knex;
    }

    public async migrate(): Promise<void> {
        if (migrated) return;

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
                "todo": todo.map(x => x.file),
            }
        });

        await this.knex.migrate.latest();
        migrated = true;
        $log.info({
            "event": "Migration completed"
        });
    }

    public async destroy() {
        return this.knex.destroy();
    }
}

type Migration = {
    name: string;
    file: string;
}
