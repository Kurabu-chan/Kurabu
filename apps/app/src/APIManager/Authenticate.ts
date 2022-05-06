import * as Linking from "expo-linking";
import { Alert } from "react-native";
import { Config } from "#config/Config";
import { handleError, listenError } from "./ErrorHandler";
import { isJWT } from "#helpers/FormatChecker";
import * as Updates from "expo-updates";
import {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    SecureStoreOptions,
    deleteItemAsync,
    getItemAsync,
    setItemAsync,
} from "expo-secure-store";

type JsonType = {
    status: "success" | "error";
    message: string;
};

const secureStoreOptions: SecureStoreOptions = {
    keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

class Authentication {
    private static instance: Authentication;
    private token?: string;
    private loaded = false;
    public static devMode = false;

    private static root: string;

    private constructor() {
        console.log("Starting Authenticator...");

        listenError("023", async () => {
            await Authentication.ClearAsync();
            await Updates.reloadAsync();
        });

        listenError("012", async () => {
            await Authentication.ClearAsync();
            await Updates.reloadAsync();
        });

        if (this.token) {
            this.loaded = true;
            return;
        }
    }

    private async LoadStorage(): Promise<boolean> {
        //try to load token from local storage

        const token = await getItemAsync("token", secureStoreOptions);
        if (token == null) {
            return false;
        }

        this.loaded = true;
        this.token = token;

        return true;
    }

    public async ClearToken() {
        this.loaded = false;
        this.token = undefined;
        await deleteItemAsync("token", secureStoreOptions);
    }

    private async SetToken(token: string) {
        this.loaded = true;
        this.token = token;
        await setItemAsync("token", token, secureStoreOptions);
    }

    public getLoaded(): boolean {
        return this.loaded;
    }

    public setToken(token: string) {
        if (isJWT(token)) {
            this.loaded = true;
            this.token = token;
        } else {
            throw new Error("param token is not correct format");
        }
    }

    public async GetToken(): Promise<string | undefined> {
        if (this.token == undefined) {
            await this.LoadStorage();
        }
        return this.token;
    }

    /** make request to MAL, check status and save token */
    public async Trylogin(email: string, password: string): Promise<boolean> {
        //url to make request to
        const url = `${Authentication.root}/authed/jwt/login`;
        //the body of the request
        const body = {
            email: email.replace(" ", ""),
            pass: password.replace(" ", ""),
        };
        //make the request
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        //is the response an error !?!?!?
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: JsonType = await res.json();
        handleError(json);
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened", json.message);
            return false;
        }

        //we good
        if (isJWT(json.message)) {
            await this.SetToken(json.message);
            return true;
        }

        //oh no we not
        return false;
    }

    public async TryRegister(email: string, password: string): Promise<string> {
        //url to make request to
        const url = `${Authentication.root}/authed/jwt/register`;
        //the body of the request

        const body = {
            email: email.replace(" ", ""),
            pass: password.replace(" ", ""),
        };
        //make the request
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        //is the response an error !?!?!?
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: JsonType = await res.json();
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened", json.message);
            return "";
        }

        return json.message;
    }

    public async TryCancelRegister(token: string): Promise<boolean> {
        const url = `${Authentication.root}/authed/jwt/cancelRegister`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: JsonType = await res.json();
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened", json.message);
            return false;
        }

        return true;
    }

    public async TryVerif(token: string, code: string): Promise<JsonType> {
        //url to make request to
        const url = `${Authentication.root}/authed/jwt/verif`;
        //the body of the request

        const body = {
            code: code,
            redirect: this.MakeRedirect(),
        };
        //make the request
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        //is the response an error !?!?!?
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: JsonType = await res.json();
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened", json.message);
            return json;
        }

        return json;
    }

    private MakeRedirect(): string {
        const expoScheme = "kurabu://";
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
            const config = Config.GetInstance();
            Authentication.root = config.GetApiRoot();
        }

        return Authentication.instance;
    }

    public static async ClearAsync() {
        await deleteItemAsync("token", secureStoreOptions);
    }
}

export default Authentication;
