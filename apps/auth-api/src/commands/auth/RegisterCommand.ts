import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { HashingProvider, KeyProvider } from "@kurabu/common";
import { InternalServerError } from "@tsed/exceptions";
import { $log } from "@tsed/logger";
import { RoleAssignment } from "../../entities/RoleAssignment";
import { User } from "../../entities/User";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";
import { Role } from "../../entities/Role";

export interface RegisterCommand extends ICommand {
    email: string,
    pass: string
}

export interface RegisterCommandResult extends ICommandResult {
    userId: string
}

export interface RegisterCommandErrorResult extends ICommandResult {
    message: string;
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class RegisterCommandHandler implements
    ICommandHandler<RegisterCommand,
    RegisterCommandResult | RegisterCommandErrorResult> {
    constructor(
        @Inject(Repository) private readonly userRepository: Repository<User>,
        @Inject(Repository) private readonly roleAssignmentRepository: Repository<RoleAssignment>,
        @Inject(Repository) private readonly roleRepository: Repository<Role>,
        @Inject(HashingProvider) private readonly hashingProvider: HashingProvider,
        @Inject(KeyProvider) private readonly keyProvider: KeyProvider
    ) {

    }

    async handle(command: RegisterCommand):
        Promise<RegisterCommandResult | RegisterCommandErrorResult> {

        const encryptionkey = this.keyProvider.getKey("encr");
        const hash = this.hashingProvider.hash(command.pass, encryptionkey);

        // create user
        const user = await this.userRepository
            .getRepository(User)
            .insert({
                email: command.email,
                hash,
                verificationCompleted: false
            })
            .returning("userId");

        $log.info(user);

        if (user.length === 0) {
            throw new InternalServerError("Failed to create user");
        }

        // create role assignments
        const defaultRoles = ["user"];
        const defaultRoleIds = [];
        for (const defaultRole of defaultRoles) {
            const role = await this.roleRepository
                .getRepository(Role)
                .where("name", "=", defaultRole)
                .select("roleId");

            if (role.length === 0) {
                $log.fatal(`Default role, ${defaultRole}, not found`);
                throw new InternalServerError("Unexpected error");
            }

            defaultRoleIds.push(role[0].roleId);
        }

        const roleAssignments = defaultRoleIds.map(roleId => ({
            roleId,
            userId: user[0].userId,
        })) as RoleAssignment[];

        await this.roleAssignmentRepository
            .getRepository(RoleAssignment)
            .insert(roleAssignments);

        return {
            success: true,
            userId: user[0].userId
        };
    }
}
