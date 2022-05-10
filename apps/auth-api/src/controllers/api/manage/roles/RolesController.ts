import { Controller, Inject } from "@tsed/di";
import { InternalServerError } from "@tsed/exceptions";
import { Get } from "@tsed/schema";
import { GetUsersQueryHandler } from "../../../../queries/user/getUsersQuery";

@Controller("/roles")
export class RolesController {
    constructor(
        @Inject(GetUsersQueryHandler) private readonly getUserQueryHandler: GetUsersQueryHandler
    ) {

    }

    @Get("/")
    async get() {
        const result = await this.getUserQueryHandler.handle();

        if (!result.success) {
            return new InternalServerError("Couldn't get users");
        }

        return result.data;
    }
}
