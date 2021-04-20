import { basicTypes } from "./helpers/basicTypes.test";
import { hasher } from "./helpers/hasher.test";
import { randomCodes } from "./helpers/randomCodes.test";
import { refresher } from "./helpers/refresher.test";

describe("Helpers", () => {
	basicTypes();
	hasher();
	randomCodes();
	refresher();
});
