import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Put, Delete, Patch } from "@tsed/schema";
import { CreateClientCommandHandler } from "../../../../commands/clients/CreateClientCommand";
import { DeleteClientCommandHandler } from "../../../../commands/clients/DeleteClientCommand";
import { UpdateClientCommandHandler } from "../../../../commands/clients/UpdateClientCommand";
import { CreateClientModel } from "./CreateClientModel";
import { DeleteClientModel } from "./DeleteClientModel";
import { UpdateClientModel } from "./UpdateClientModel";

@Controller("/client")
export class ClientController {
    constructor(
        @Inject(CreateClientCommandHandler)
        private readonly createClientCommandHandler: CreateClientCommandHandler,
        @Inject(UpdateClientCommandHandler)
        private readonly updateClientCommandHandler: UpdateClientCommandHandler,
        @Inject(DeleteClientCommandHandler)
        private readonly deleteClientCommandHandler: DeleteClientCommandHandler,
    ) {

    }

    @Put("/")
    put(@BodyParams() client: CreateClientModel) {
        return this.createClientCommandHandler.handle(client);
    }

    @Delete("/")
    delete(@BodyParams() client: DeleteClientModel) {
        return this.deleteClientCommandHandler.handle(client);
    }

    @Patch("/")
    patch(@BodyParams() client: UpdateClientModel) {
        return this.updateClientCommandHandler.handle(client);
    }
}
