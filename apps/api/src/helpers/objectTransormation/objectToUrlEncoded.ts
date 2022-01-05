/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function serialize(obj: any, prefix: any): string {
    const str = [];
    for (const p in obj) {
        if (obj.hasOwnProperty(p) && obj[p] !== undefined) {
            const k = prefix ? prefix + "[" + p + "]" : p;
            const v = obj[p];
            str.push(
                v !== null && typeof v === "object"
                    ? serialize(v, k)
                    : encodeURIComponent(k) + "=" + encodeURIComponent(v)
            );
        }
    }
    return str.join("&");
}

export default serialize;
