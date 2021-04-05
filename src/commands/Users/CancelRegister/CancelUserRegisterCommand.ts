import { User } from "../../../models/User"
import { ICommand } from "../../ICommand"

export class CancelUserRegisterCommand extends ICommand {
    user!: User
}