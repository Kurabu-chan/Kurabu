import "reflect-metadata";
import * as tsyringe from "tsyringe";
import { autoInjectable } from "tsyringe";
import { ICommandHandler } from "../commands/ICommand";
import { CreateUserCommand } from "../commands/Users/Create/CreateUserCommand";
import { CreateUserCommandHandler } from "../commands/Users/Create/CreateUserCommandHandler";
import { CreateUserCommandResult } from "../commands/Users/Create/CreateUserCommandResult";
import { UpdateUserTokensCommand } from "../commands/Users/UpdateTokens/UpdateUserTokensCommand";
import { UpdateUserTokensCommandHandler } from "../commands/Users/UpdateTokens/UpdateUserTokensCommandHandler";
import { UpdateUserTokensCommandResult } from "../commands/Users/UpdateTokens/UpdateUserTokensCommandResult";
import { IQueryHandler } from "../queries/IQuery";
import { UserEmailUsedQuery } from "../queries/Users/EmailUsed/UserEmailUsedQuery";
import { UserEmailUsedQueryHandler } from "../queries/Users/EmailUsed/UserEmailUsedQueryHandler";
import { UserEmailUsedQueryResult } from "../queries/Users/EmailUsed/UserEmailUsedQueryResult";
import { UserLoginQuery } from "../queries/Users/Login/UserLoginQuery";
import { UserLoginQueryHandler } from "../queries/Users/Login/UserLoginQueryHandler";
import { UserLoginQueryResult } from "../queries/Users/Login/UserLoginQueryResult";
import { UserTokensFromUUIDQuery } from "../queries/Users/TokensFromUUID/UserTokensFromUUIDQuery";
import { UserTokensFromUUIDQueryHandler } from "../queries/Users/TokensFromUUID/UserTokensFromUUIDQueryHandler";
import { UserTokensFromUUIDQueryResult } from "../queries/Users/TokensFromUUID/UserTokensFromUUIDQueryResult";

export default class ContainerManager {
    private container: tsyringe.DependencyContainer;
    constructor() {
        this.container = tsyringe.container; 
    }

    public get Container(){
        return this.container;
    }

    private static _instance: ContainerManager;
    public static getInstance(){
        if(!this._instance){
            this._instance = new ContainerManager();
        }
        return this._instance;
    }
}