import { InjectorService } from "@tsed/di";

export interface IBootstrapper {
    bootstrap?(injector: InjectorService): Promise<void> | void;
    postLoad?(injector: InjectorService): Promise<void> | void;
    destroy?(injector: InjectorService): void;
}
