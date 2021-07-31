/* eslint-disable @typescript-eslint/no-unsafe-return */
export class CamelToSnakeCase {
    /** Changes a camelCaseString to a snake_case_string */
    public single(camel: string): string {
        let str = "";
        for (let i = 0; i < camel.length; i++) {
            const c = camel.charAt(i);
            if (isUpperCase(c)) {
                str += "_" + c.toLowerCase();
            } else {
                str += c;
            }
        }

        return str;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public fullObject(camel: any): any {
        if (camel === undefined || camel === null || camel === {}) return camel;

        // check if camel is an array
        if (Array.isArray(camel)) {
            return camel.map(x => this.fullObject(x));
        }

        // check if camel is an object
        if (typeof camel === "object") {
            const obj: {[key:string]: any} = {};
            for (const prop of Object.keys(camel)) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                obj[this.single(prop)] = this.fullObject(camel[prop]);
            }
            return obj;
        }

        return camel;
    }
}

/* function isLowerCase(char: string): boolean {
    return char.toUpperCase() !== char;
} */

function isUpperCase(char: string): boolean {
    return char.toLowerCase() !== char;
}