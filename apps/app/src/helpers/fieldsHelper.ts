import { MediaFields } from "@kurabu/api-sdk";

function fieldsToString(fields: undefined): undefined;
function fieldsToString(fields: string): string;
function fieldsToString(fields: MediaFields[]): string;
function fieldsToString(fields: MediaFields[] | string | undefined): string|undefined {
    if (fields === undefined) return undefined;
    if (typeof fields === "string") {
        return fields;
    }
    return fields.join(",");
}

export {fieldsToString};