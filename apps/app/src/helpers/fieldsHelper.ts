import { MediaFields } from "@kurabu/api-sdk";

export function fieldsToString(fields: MediaFields[] | string | undefined) {
    if (fields === undefined) return undefined;
    if (typeof fields === "string") {
        return fields;
    }
    return fields.join(",");
}