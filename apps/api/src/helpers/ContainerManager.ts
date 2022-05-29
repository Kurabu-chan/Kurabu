import "reflect-metadata";
import * as tsyringe from "tsyringe";
import { HashingProvider, CertificateProvider,EncryptionProvider,KeyProvider } from "@kurabu/common";

export default class ContainerManager {
    private static _instance: ContainerManager;

    private _container: tsyringe.DependencyContainer;

    constructor(container = tsyringe.container) {
        this._container = container;

        // this._container.registerSingleton<HashingProvider>();
        this._container.registerSingleton<HashingProvider>(HashingProvider);
        this._container.registerSingleton<CertificateProvider>(CertificateProvider);
        this._container.registerSingleton<EncryptionProvider>(EncryptionProvider);
        this._container.registerSingleton<KeyProvider>(KeyProvider);
    }

    public get container(): tsyringe.DependencyContainer {
        return this._container;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static getInstance(mock?: any): ContainerManager {
        if (!this._instance && mock === undefined) {
            this._instance = new ContainerManager();
        } else if (mock !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this._instance = new ContainerManager(mock);
        }
        return this._instance;
    }
}
