import { Controller, Inject } from "@tsed/di";
import { InternalServerError } from "@tsed/exceptions";
import { Get } from "@tsed/schema";
import { GetRolesQueryHandler } from "../../../../queries/roles/getRolesQuery";

@Controller("/roles")
export class RolesController {
    constructor(
        @Inject(GetRolesQueryHandler) private readonly getRolesQueryHandler: GetRolesQueryHandler
    ) {

    }

    @Get("/")
    async get() {
        const result = await this.getRolesQueryHandler.handle();

        if (!result.success) {
            return new InternalServerError("Couldn't get roles");
        }

        return result.data;
    }
}
