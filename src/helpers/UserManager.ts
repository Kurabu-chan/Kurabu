import { Logger } from '@overnightjs/logger';
import { singleton } from 'tsyringe';

/*
Manage all user data
*/
//#region types
export type DictData = {
    token: string,
    RefreshToken: string,
    email: string
}

export type RegisterData = {
    email: string,
    pass: string,
    verifier: string,
    redirect?: string
}

export type VerifData = {
    email: string,
    pass: string,
    code: string,
    attempt: number
}

export type DictEntry = {
    state: "done" | "pending" | "errored" | "canceled" | "verif",
    data?: DictData | RegisterData | VerifData
}
//#endregion types
@singleton()
export class UserManager {
    public codeDict: Map<string, DictEntry>;

    constructor() {
        this.codeDict = new Map<string, DictEntry>();
    }

    //#region functions
    /** Log the codeDict */
    public LogDict() {
        let strRep = "";
        this.codeDict.forEach((value, key) => {
            strRep += `${key}: ${JSON.stringify(value)}\n`;
        });
        Logger.Info(strRep);
    }

    /** Set the state for a uuid to errored */
    public SetErrored(uuid: string) {
        this.codeDict.set(uuid, {
            state: "errored"
        });

        setTimeout(() => {
            let dictEntry = <DictEntry>this.codeDict.get(uuid);
            if (dictEntry.state == "errored") {
                this.codeDict.delete(uuid);
            }
        }, 10 * 60 * 1000);
    }

    /** Set the state for a uuid to canceled */
    public SetCanceled(uuid: string) {
        this.codeDict.set(uuid, {
            state: "canceled"
        })

        setTimeout(() => {
            let dictEntry = <DictEntry>this.codeDict.get(uuid);
            if (dictEntry.state == "canceled") {
                this.codeDict.delete(uuid);
            }
        }, 10 * 60 * 1000);
    }
}