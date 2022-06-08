import { CertificateProvider, EncryptionProvider, HashingProvider, KeyProvider, MailServiceFactory } from "@kurabu/common";
import { InjectorService, ProviderScope, ProviderType } from "@tsed/di";
import { $log } from "@tsed/logger";
import { IBootstrapper } from "./IBootstrapper";

export class ExternalProviderBootstrapper implements IBootstrapper {

    public bootstrap(injector: InjectorService): void {
        registerSingleton(CertificateProvider, injector);
        registerSingleton(EncryptionProvider, injector);
        registerSingleton(HashingProvider, injector);
        registerSingleton(KeyProvider, injector);
        registerSingleton(MailServiceFactory, injector);
    }

    public postLoad(injector: InjectorService): void {
        const certProvider = injector.get<CertificateProvider>(CertificateProvider); // load certificates
        certProvider?.requireCertificate("jwt", "EC PRIVATE KEY");
    }
}

// function registerEmailConfigurations(emailFactory: MailServiceFactoryProvider | undefined) {
//     if (emailFactory === undefined) {
//         throw new Error("Email service factory is not registered");
//     }

//     for (const [key, config] of Object.entries(emailConfigurations)) {
//         emailFactory.addConfiguration(key, config);
//     }
// }

function registerSingleton(token: new (...args: any) => any,
    injector: InjectorService,
    type: ProviderType = ProviderType.PROVIDER) {
    injector.addProvider(token, {
        scope: ProviderScope.SINGLETON,
        type,
    });
    $log.info("Registered singleton: " + token.name);
}

