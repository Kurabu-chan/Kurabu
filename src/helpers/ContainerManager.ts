import "reflect-metadata";
import * as tsyringe from "tsyringe";

export default class ContainerManager {
	private container: tsyringe.DependencyContainer;
	constructor(container = tsyringe.container) {
		this.container = container;
	}

	public get Container() {
		return this.container;
	}

	private static _instance: ContainerManager;
	public static getInstance(mock?: any) {
		if (!this._instance && mock === undefined) {
			this._instance = new ContainerManager();
		} else if (mock !== undefined) {
			this._instance = new ContainerManager(mock);
		}
		return this._instance;
	}
}
