import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Put, Delete, Patch } from "@tsed/schema";
import { CreateExternalApplicationCommandHandler } from "../../../../commands/externalApplications/CreateExternalApplicationCommand";
import { DeleteExternalApplicationCommandHandler } from "../../../../commands/externalApplications/DeleteExternalApplicationCommand";
import { UpdateExternalApplicationCommandHandler } from "../../../../commands/externalApplications/UpdateExternalApplicationCommand";
import { CreateExternalApplicationModel } from "./CreateExternalApplicationModel";
import { DeleteExternalApplicationModel } from "./DeleteExternalApplicationModel";
import { UpdateExternalApplicationModel } from "./UpdateExternalApplicationModel";

@Controller("/externalApplication")
export class ExternalApplicationController {
    constructor(
        @Inject(CreateExternalApplicationCommandHandler)
        private readonly createExternalApplicationCommandHandler:
            CreateExternalApplicationCommandHandler,
        @Inject(UpdateExternalApplicationCommandHandler)
        private readonly updateExternalApplicationCommandHandler:
            UpdateExternalApplicationCommandHandler,
        @Inject(DeleteExternalApplicationCommandHandler)
        private readonly deleteExternalApplicationCommandHandler:
            DeleteExternalApplicationCommandHandler,
    ) {

    }

    @Put("/")
    put(@BodyParams() externalApplication: CreateExternalApplicationModel) {
        return this.createExternalApplicationCommandHandler.handle(externalApplication);
    }

    @Delete("/")
    delete(@BodyParams() externalApplication: DeleteExternalApplicationModel) {
        return this.deleteExternalApplicationCommandHandler.handle(externalApplication);
    }

    @Patch("/")
    patch(@BodyParams() externalApplication: UpdateExternalApplicationModel) {
        return this.updateExternalApplicationCommandHandler.handle(externalApplication);
    }
}
