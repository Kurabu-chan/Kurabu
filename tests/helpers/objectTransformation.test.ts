import "reflect-metadata";
import { deepRename } from "./objectTransformation/deepRename.test";

export function objectTransformation():void {
    describe("objectTransformation", () => {
        deepRename();
    });
}

