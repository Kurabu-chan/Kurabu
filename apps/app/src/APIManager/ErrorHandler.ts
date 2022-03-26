import { GeneralError } from "@kurabu/api-sdk";

type Listeners = {
    [code: string]: (() => void)[] | undefined;
};

const listeners: Listeners = {};

export function listenError(code: string, func: (() => void) | (() => Promise<void>)) {
    if (listeners[code] === undefined) listeners[code] = [];

    listeners[code]?.push(func);
}

export function handleError(jsonRes: unknown) {
    if (!isGeneralError(jsonRes)) return;

    if (jsonRes.status !== "error") return;
    if (jsonRes.code === undefined) throw new Error("error result did not have a code!");
    if (listeners[jsonRes.code] !== undefined) {
        listeners[jsonRes.code]?.forEach((x) => x());
        return;
    } else {
        console.log(JSON.stringify(jsonRes));
    }
}


function isGeneralError(value: unknown): value is GeneralError {
    if (value === undefined || value === null) return false;

    const asGeneralError = (value as GeneralError);
    return asGeneralError.status !== undefined && asGeneralError.status === "error";
}
