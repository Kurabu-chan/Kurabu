import * as crypto from "crypto";

function base64URLEncode(str : Buffer) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export function isUUID(uuid : string) : boolean {
    const stateRe = /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/;
    return uuid.match(stateRe) != null;
}

export function getUUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export function getPKCE(length: number) : string {
    var l = Math.floor(length / (4 / 3));
    return base64URLEncode(crypto.randomBytes(l));
}