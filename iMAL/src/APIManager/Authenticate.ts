import { AsyncStorage, Alert } from 'react-native';
import { isUUID } from './helper/FormatChecker';
import * as Linking from 'expo-linking';

type JsonType = {
    status: "success" | "error",
    message: string
}

class Authentication {
    private static instance: Authentication;
    private stateCode?: string;// = "12ac8766-cc54-4360-b7c4-91cd1374daec";
    private loaded: boolean = false;
    public static devMode = false;

    private constructor() {
        console.log("Starting Authenticator...");
        if (this.stateCode) {
            this.loaded = true;
            return;
        }
    }

    private async LoadStorage(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            //try to load stateCode from local storage
            AsyncStorage.getItem("stateCode").then((value) => {
                if (value != null && isUUID(value)) {
                    //value was in localstorage so put it in the variable
                    this.loaded = true;
                    this.stateCode = value;
                    console.log(value);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });        
    }

    private SetCode(uuid: string) {
        this.loaded = true;
        this.stateCode = uuid;
        AsyncStorage.setItem("stateCode", uuid);
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

    public GetStateCode(): string | undefined {
        return this.stateCode;
    }

    /** make request to MAL, check status and save stateCode */
    public async Trylogin(email: string, password: string): Promise<boolean> {
        //url to make request to
        let url = `http://api.imal.ml/authed/login`;
        //the body of the request
        let body = {
            email: email.replace(' ',''),
            pass: password.replace(' ','')
        }
        //make the request
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        //is the response an error !?!?!?
        let json: JsonType = await res.json();
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened",json.message);
            return false;
        }

        //we good
        if (isUUID(json.message)) {
            this.SetCode(json.message);
            return true;
        }
        
        //oh no we not
        return false;
    }

    public async TryRegister(email: string, password: string) : Promise<string> {
        //url to make request to
        let url = `http://api.imal.ml/authed/register`;
        //the body of the request

        let body = {
            email: email.replace(' ',''),
            pass: password.replace(' ','')
        }
        //make the request
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        //is the response an error !?!?!?
        let json: JsonType = await res.json();
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened",json.message);
            return "";
        }

        return json.message;
    }

    public async TryVerif(uuid:string,code: string) : Promise<JsonType>{
        //url to make request to
        let url = `http://api.imal.ml/authed/verif`;
        //the body of the request

        let body = {
            uuid: uuid,
            code: code,
            redirect: this.MakeRedirect()
        }
        //make the request
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        //is the response an error !?!?!?
        let json: JsonType = await res.json();
        if (json.status == "error") {
            //oh fuck
            Alert.alert("Something bad happened",json.message);
            return json;
        }

        return json;
    }

    private MakeRedirect(): string{
        const expoScheme = "imal://"
        // Technically you need to pass the correct redirectUrl to the web browser.
        let redir = Linking.makeUrl();
        if (redir.startsWith('exp://1')) {
            // handle simulator(localhost) and device(Lan)
            redir = redir + '/--/';
        } else
        if (redir === expoScheme) {
            // dont do anything
        } else {
            // handle the expo client
            redir = redir + '/';
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

        return Authentication.instance;
    }

    public static async ClearAsync() {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem("stateCode", () => {
                resolve();
            });
        });        
    }
}

export default Authentication;