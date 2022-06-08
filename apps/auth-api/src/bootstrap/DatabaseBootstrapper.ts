import { InjectorService } from "@tsed/di";
import { DatabaseService } from "../providers/DatabaseService";
import { IBootstrapper } from "./IBootstrapper";

export class DatabaseBootstrapper implements IBootstrapper {

    private database?: DatabaseService;

    public async bootstrap(injector: InjectorService): Promise<void> {
        this.database = injector.get<DatabaseService>(DatabaseService);
        await this.database?.migrate();
    }

    public destroy() {
        void this.database?.destroy();
    }
}
