import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { $log } from "@tsed/logger";
import { Role } from "../../entities/Role";
import { Scope } from "../../entities/Scope";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";

export interface UpdateRoleCommand extends ICommand {
    roleId: string;
    name: string;
    scopes: string[];
}

export interface UpdateRoleCommandResult extends ICommandResult {

}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class UpdateRoleCommandHandler implements
    ICommandHandler<UpdateRoleCommand, UpdateRoleCommandResult> {
    constructor(
        @Inject(Repository) private readonly roleRepository: Repository<Role>,
        @Inject(Repository) private readonly scopeRepository: Repository<Scope>
    ) {

    }

    async handle(command: UpdateRoleCommand): Promise<UpdateRoleCommandResult> {
        // Get the role
        const role = await this.roleRepository.getRepository(Role)
            .where("roleId", "=", command.roleId)
            .select("*");

        // Check if a role was found
        if (role.length === 0) {
            $log.error({
                event: "Failed to update role"
            });
            return {
                success: false
            };
        }

        const roleId = role[0].roleId;

        // Get the current scopes and their ids
        const scopes = await this.scopeRepository.getRepository(Scope)
            .where("roleId", "=", roleId)
            .select("scopeId", "name");

        // Filter the scopes that should be deleted
        const deletes = scopes
            .filter(x => !command.scopes.includes(x.name))
            .map(x => x.scopeId);

        // Filter the scopes that should be inserted
        const creates = command.scopes
            .filter(x => scopes.filter(y => y.name === x).length === 0)
            .map(scope => ({
                name: scope,
                roleId,
            }));

        // Insert the missing scopes
        if (creates.length > 0) {
            await this.scopeRepository.getRepository(Scope).insert(creates);
        }

        // Delete all the extra scopes
        for (const del of deletes) {
            await this.scopeRepository.getRepository(Scope).where("scopeId", "=", del).delete();
        }

        // If the name needs to be updated, update it
        if (command.name !== role[0].name) {
            await this.roleRepository.getRepository(Role).where("roleId", "=", roleId).update({
                name: command.name
            });
        }

        return {
            success: true,
        };
    }
}
