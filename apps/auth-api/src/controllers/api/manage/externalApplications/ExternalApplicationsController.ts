import { Controller, Inject } from "@tsed/di";
import { InternalServerError } from "@tsed/exceptions";
import { Get } from "@tsed/schema";
import { GetExternalApplicationsQueryHandler } from "../../../../queries/externalApplications/GetExternalApplicationsQuery";

@Controller("/externalApplications")
export class ExternalApplicationsController {
    constructor(
        @Inject(GetExternalApplicationsQueryHandler)
        private readonly getExternalApplicationsQueryHandler: GetExternalApplicationsQueryHandler
    ) {

    }

    @Get("/")
    async get() {
        const result = await this.getExternalApplicationsQueryHandler.handle();

        if (!result.success) {
            return new InternalServerError("Couldn't get externalApplications");
        }

        return result.data;
    }
}
