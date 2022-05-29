import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import { InjectorService, ProviderType, ProviderScope } from "@tsed/di";
import { CertificateProvider, EncryptionProvider, HashingProvider, KeyProvider } from "@kurabu/common";
import { Server } from "./Server";
import { DatabaseService } from "./providers/DatabaseService";

async function bootstrap() {
    try {
        const platform = await PlatformExpress.bootstrap(Server);
        const injector = platform.injector;
        const database = await initializeDatabase(injector);

        registerSingleton(CertificateProvider, injector);
        registerSingleton(EncryptionProvider, injector);
        registerSingleton(HashingProvider, injector);
        registerSingleton(KeyProvider, injector);

        const certProvider = injector.get<CertificateProvider>(CertificateProvider); // load certificates
        certProvider?.requireCertificate("jwt", "EC PRIVATE KEY");

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

function registerSingleton(token: any, injector: InjectorService) {
    injector.addProvider(token, {
        scope: ProviderScope.SINGLETON,
        type: ProviderType.PROVIDER,
    });
}

async function initializeDatabase(injector: InjectorService) {
    const database = injector.get<DatabaseService>(DatabaseService);
    await database?.migrate();

    return database;
}

void bootstrap();
