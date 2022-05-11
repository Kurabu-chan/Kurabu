import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Put, Delete, Patch } from "@tsed/schema";
import { CreateRoleCommandHandler } from "../../../../commands/roles/CreateRoleCommand";
import { DeleteRoleCommandHandler } from "../../../../commands/roles/DeleteRoleCommand";
import { UpdateRoleCommandHandler } from "../../../../commands/roles/UpdateRoleCommand";
import { CreateRoleModel } from "./CreateRoleModel";
import { DeleteRoleModel } from "./DeleteRoleModel";
import { UpdateRoleModel } from "./UpdateRoleModel";

@Controller("/role")
export class RoleController {
    constructor(
        @Inject(CreateRoleCommandHandler)
        private readonly createRoleCommandHandler: CreateRoleCommandHandler,
        @Inject(UpdateRoleCommandHandler)
        private readonly updateRoleCommandHandler: UpdateRoleCommandHandler,
        @Inject(DeleteRoleCommandHandler)
        private readonly deleteRoleCommandHandler: DeleteRoleCommandHandler,
    ) {

    }

    @Put("/")
    put(@BodyParams() role: CreateRoleModel) {
        return this.createRoleCommandHandler.handle(role);
    }

    @Delete("/")
    delete(@BodyParams() role: DeleteRoleModel) {
        return this.deleteRoleCommandHandler.handle(role);
    }

    @Patch("/")
    patch(@BodyParams() role: UpdateRoleModel) {
        return this.updateRoleCommandHandler.handle(role);
    }
}
