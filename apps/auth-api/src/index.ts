import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import { MailConfiguration } from "@kurabu/common";
import { Server } from "./Server";
import { bootstrappers } from "./bootstrap";
import { IBootstrapper } from "./bootstrap/IBootstrapper";

export enum MailConfigurations {
    verify = "verify",
}

const emailConfigurations: Record<MailConfigurations, MailConfiguration> = {
    verify: {
        from: "noreply@mail.kurabu.moe"
    }
};

export function getMailConfiguration(key: MailConfigurations) {
    return emailConfigurations[key];
}

async function bootstrap() {

    const bootstrapperInstances: IBootstrapper[] = [];

    for (const bootstrapper of bootstrappers) {
        bootstrapperInstances.push(new bootstrapper());
    }

    try {
        const platform = await PlatformExpress.bootstrap(Server);
        const injector = platform.injector;

        for (const bootstrapper of bootstrapperInstances) {
            if (bootstrapper.bootstrap !== undefined) {
                await bootstrapper.bootstrap(injector);
            }
        }

        injector.loadSync();

        for (const bootstrapper of bootstrapperInstances) {
            if (bootstrapper.postLoad !== undefined) {
                await bootstrapper.postLoad(injector);
            }
        }

		await platform.listen();

		process.on("SIGINT", () => {
            void platform.stop();

            for (const bootstrapper of bootstrapperInstances) {
                if (bootstrapper.destroy !== undefined) {
                    void bootstrapper.destroy(injector);
                }
            }
		});
	} catch (error) {
		$log.error({
			error,
			event: "SERVER_BOOTSTRAP_ERROR",
		});
	}
}


void bootstrap();
