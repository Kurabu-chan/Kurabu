import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { Role } from "../../entities/Role";
import { Scope } from "../../entities/Scope";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";

export interface DeleteRoleCommand extends ICommand {
    roleId: string
}

export interface DeleteRoleCommandResult extends ICommandResult {
    message?: string
}


@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class DeleteRoleCommandHandler implements
    ICommandHandler<DeleteRoleCommand, DeleteRoleCommandResult> {
    constructor(
        @Inject(Repository) private readonly roleRepository: Repository<Role>,
        @Inject(Repository) private readonly scopeRepository: Repository<Scope>
    ) {

    }

    async handle(command: DeleteRoleCommand): Promise<DeleteRoleCommandResult> {

        const roleId = await this.roleRepository
            .getRepository(Role)
            .where("roleId", "=", command.roleId)
            .select("roleId");

        if (roleId.length === 0) {
            return {
                message: "Role does not exist",
                success: false
            };
        }

        await this.scopeRepository.getRepository(Scope)
            .where("roleId", "=", command.roleId).delete();
        await this.roleRepository.getRepository(Role)
            .where("roleId", "=", command.roleId).delete();

        return {
            success: true,
        };
    }
}
