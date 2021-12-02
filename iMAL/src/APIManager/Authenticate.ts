import * as Linking from "expo-linking";
import { Alert } from "react-native";
import { Config } from "#config/Config";
import { handleError, listenError } from "./ErrorHandler";
import { isUUID } from "#helpers/FormatChecker";
import * as Updates from "expo-updates";
import { WHEN_UNLOCKED_THIS_DEVICE_ONLY, SecureStoreOptions, deleteItemAsync, getItemAsync, setItemAsync} from "expo-secure-store";

type JsonType = {
    status: "success" | "error";
    message: string;
};

const secureStoreOptions: SecureStoreOptions = {
    keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY
}

class Authentication {
    private static instance: Authentication;
    private stateCode?: string;
    private loaded: boolean = false;
    public static devMode = false;

    private static root: string;

    private constructor() {
        console.log("Starting Authenticator...");

        listenError("023", () => {
            Authentication.ClearAsync();
            Updates.reloadAsync();
        })

        if (this.stateCode) {
            this.loaded = true;
            return;
        }
    }

    private async LoadStorage(): Promise<boolean> {
            //try to load stateCode from local storage
        
        var token = await getItemAsync("token", secureStoreOptions)
        if (token == null) {
            return false;
        }

        this.loaded = true;
        this.stateCode = token;

        return true;
    }

    public async ClearCode() {
        this.loaded = false;
        this.stateCode = undefined;
        await deleteItemAsync("token", secureStoreOptions);
    }

    private async SetCode(uuid: string) {
        this.loaded = true;
        this.stateCode = uuid;
        await setItemAsync("token", uuid, secureStoreOptions);
    }

    public getLoaded(): boolean {
        return this.loaded;
    }

    public setCode(uuid: string) {
        if (isUUID(uuid)) {
            this.loaded = true;
            this.stateCode = uuid;
        } else {
            throw new Error("param uuid is not correct format");
        }
    }

    public async GetStateCode(): Promise<string | undefined> {
        if (this.stateCode == undefined) {
            await this.LoadStorage()
        }
        return this.stateCode;
    }

    /** make request to MAL, check status and save stateCode */
    public async Trylogin(email: string, password: string): Promise<boolean> {
        //url to make request to
        let url = `${Authentication.root}authed/login`;
        //the body of the request
        let body = {
            email: email.replace(" ", ""),
            pass: password.replace(" ", ""),
        };
        //make the request
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        //is the response an error !?!?!?
        let json: JsonType = await res.json();
        handleError(json);
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened", json.message);
            return false;
        }

        //we good
        if (isUUID(json.message)) {
            await this.SetCode(json.message);
            return true;
        }

        //oh no we not
        return false;
    }

    public async TryRegister(email: string, password: string): Promise<string> {
        //url to make request to
        let url = `${Authentication.root}authed/register`;
        //the body of the request

        let body = {
            email: email.replace(" ", ""),
            pass: password.replace(" ", ""),
        };
        //make the request
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        //is the response an error !?!?!?
        let json: JsonType = await res.json();
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened", json.message);
            return "";
        }

        return json.message;
    }

    public async TryCancelRegister(uuid: string): Promise<boolean> {
        let url = `${Authentication.root}authed/cancelRegister`;

        let body = {
            uuid: uuid,
        };

        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        let json: JsonType = await res.json();
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened", json.message);
            return false;
        }

        return true;
    }

    public async TryVerif(uuid: string, code: string): Promise<JsonType> {
        //url to make request to
        let url = `${Authentication.root}authed/verif`;
        //the body of the request

        let body = {
            uuid: uuid,
            code: code,
            redirect: this.MakeRedirect(),
        };
        //make the request
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        //is the response an error !?!?!?
        let json: JsonType = await res.json();
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened", json.message);
            return json;
        }

        return json;
    }

    private MakeRedirect(): string {
        const expoScheme = "imal://";
        // Technically you need to pass the correct redirectUrl to the web browser.
        let redir = Linking.makeUrl();
        if (redir.startsWith("exp://1")) {
            // handle simulator(localhost) and device(Lan)
            redir = redir + "/--/";
        } else if (redir === expoScheme) {
            // dont do anything
        } else {
            // handle the expo client
            redir = redir + "/";
        }

        return redir + "auth/";
    }

    static async getInstance(): Promise<Authentication> {
        if (!Authentication.instance) {
            Authentication.instance = new Authentication();
            if (!this.devMode) {
                await Authentication.instance.LoadStorage();
            }
        }

        if (!Authentication.root) {
            let config = await Config.GetInstance();
            Authentication.root = config.GetApiRoot();
        }

        return Authentication.instance;
    }

    public static async ClearAsync() {
        await deleteItemAsync("token", secureStoreOptions);
    }
}

export default Authentication;
