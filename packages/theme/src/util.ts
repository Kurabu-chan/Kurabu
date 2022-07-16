export function indexWalk(obj: any, path: string[]|undefined): any {
    if(path === undefined || (path.length === 1 && path[0] === "") || path.length === 0) return obj;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let current = obj;
    for (const key of path) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        current = current[key];
    }
    return current;
}

export type Box<T extends string | number> = {
    width: T;
    height: T;
}

export function firstUpper(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}
