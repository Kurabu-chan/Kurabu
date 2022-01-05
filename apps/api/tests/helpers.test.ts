import "reflect-metadata";
import { basicTypes } from "./helpers/basicTypes.test";
import { hasher } from "./helpers/hasher.test";
import { objectTransformation } from "./helpers/objectTransformation.test";
import { randomCodes } from "./helpers/randomCodes.test";
import { refresher } from "./helpers/refresher.test";

describe("Helpers", () => {
    basicTypes();
    hasher();
    randomCodes();
    refresher();
    objectTransformation();
});
