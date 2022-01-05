import "reflect-metadata";
import * as tsyringe from "tsyringe";

export default class ContainerManager {
    private static _instance: ContainerManager;

    private _container: tsyringe.DependencyContainer;

    constructor(container = tsyringe.container) {
        this._container = container;
    }

    public get container(): tsyringe.DependencyContainer {
        return this._container;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static getInstance(mock?: any): ContainerManager {
        if (!this._instance && mock === undefined) {
            this._instance = new ContainerManager();
        } else if (mock !== undefined) {
            this._instance = new ContainerManager(mock);
        }
        return this._instance;
    }
}
