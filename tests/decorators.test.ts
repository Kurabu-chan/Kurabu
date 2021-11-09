import "reflect-metadata";
import { paramDecorator } from "./decorators/param.test";
import { requestHandler } from "./decorators/requestHandler.test";
import { state } from "./decorators/state.test";

describe("Decorators", () => {
	paramDecorator();
	requestHandler();
	state();
});
