import Auth from "./Authenticate";
import * as Updates from "expo-updates";

export function handleError(jsonRes: any) {
    if (jsonRes.status !== "error") return;
    if (jsonRes.code === undefined)
        throw new Error("error result did not have a code!");

    switch (jsonRes.code) {
        case "023":
            //user didn't exist clear the cache and restart the app after a dialog box or something similar
            Auth.ClearAsync();
            Updates.reloadAsync();
            return;
        default:
            console.log(JSON.stringify(jsonRes));
    }
}
