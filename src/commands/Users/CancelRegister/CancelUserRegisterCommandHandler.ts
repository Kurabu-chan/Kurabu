import { autoInjectable } from "tsyringe";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import StateStatusError from "../../../errors/Authentication/StateStatusError";
import { UserManager } from "../../../helpers/UserManager";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand"
import { CancelUserRegisterCommand } from "./CancelUserRegisterCommand";
import { CancelUserRegisterCommandResult } from "./CancelUserRegisterCommandResult";

@autoInjectable()
export class CancelUserRegisterCommandHandler implements ICommandHandler<CancelUserRegisterCommand, CancelUserRegisterCommandResult>{
    private _userManager: UserManager;
    constructor(
        userManager: UserManager) {
        this._userManager = userManager;
    }

    async handle(command: CancelUserRegisterCommand): Promise<CancelUserRegisterCommandResult> {
        if (this._userManager.codeDict.has(command.uuid)) {
            let current = this._userManager.codeDict.get(command.uuid);
            if (current?.state == "verif") {
                this._userManager.SetCanceled(command.uuid);
                return {
                    success: ICommandResultStatus.SUCCESS
                };
            } else {
                throw new StateStatusError("State had wrong status during cancel");
            }
        } else {
            throw new MissingStateError("State missing during cancel");
        }
    }
}