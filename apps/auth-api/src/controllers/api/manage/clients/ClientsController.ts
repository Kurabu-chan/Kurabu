import { Controller, Inject } from "@tsed/di";
import { InternalServerError } from "@tsed/exceptions";
import { Get } from "@tsed/schema";
import { GetClientsQueryHandler } from "../../../../queries/clients/GetClientsQuery";

@Controller("/clients")
export class ClientsController {
    constructor(
        @Inject(GetClientsQueryHandler)
        private readonly getClientsQueryHandler: GetClientsQueryHandler
    ) {

    }

    @Get("/")
    async get() {
        const result = await this.getClientsQueryHandler.handle();

        if (!result.success) {
            return new InternalServerError("Couldn't get clients");
        }

        return result.data;
    }
}
