import "reflect-metadata";
import * as tsyringe from "tsyringe";

export default class ContainerManager {
    private container: tsyringe.DependencyContainer;
    constructor() {
        this.container = tsyringe.container; 
    }

    private RegisterTypes(){

    }

    public get Container(){
        return this.container;
    }

    private static _instance: ContainerManager;
    public static getInstance(){
        if(!this._instance){
            this._instance = new ContainerManager();
        }
        return this._instance;
    }
}