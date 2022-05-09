import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import { InjectorService } from "@tsed/di";
import { Server } from "./Server";
import { DatabaseService } from "./providers/DatabaseService";

async function bootstrap() {
    try {
        const injector = new InjectorService();

        await injector.load();

        const database = await initializeDatabase(injector);

		const platform = await PlatformExpress.bootstrap(Server);
		await platform.listen();

		process.on("SIGINT", () => {
            void platform.stop();

            void database?.destroy();
		});
	} catch (error) {
		$log.error({
			error,
			event: "SERVER_BOOTSTRAP_ERROR",
		});
	}
}

async function initializeDatabase(injector: InjectorService) {
    const database = injector.get<DatabaseService>(DatabaseService);
    await database?.migrate();

    return database;
}

void bootstrap();
