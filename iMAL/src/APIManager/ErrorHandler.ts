type Listeners = {
    [code: string]: (() => void)[] | undefined
}

let listeners: Listeners = {}

export function listenError(code: string, func: () => void) {
    if (listeners[code] === undefined) listeners[code] = []

    listeners[code]?.push(func);
}

export function handleError(jsonRes: any) {
    if (jsonRes.status !== "error") return;
    if (jsonRes.code === undefined)
        throw new Error("error result did not have a code!");
    
    if (listeners[jsonRes.code] !== undefined) {
        listeners[jsonRes.code]?.forEach(x => x());
        return;
    } else {
        console.log(JSON.stringify(jsonRes));
    }
}
