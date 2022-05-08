import { expect } from "chai";
import { PlatformTest } from "@tsed/common";
import { HelloWorldController } from "./HelloWorldController";

describe("HelloWorldController", () => {
  beforeEach(async () => {
    await PlatformTest.create();
  });
  afterEach(async () => {
    await PlatformTest.reset();
  });

  it("should do something", () => {
    const instance = PlatformTest.get<HelloWorldController>(HelloWorldController);
    // const instance = PlatformTest.invoke<HelloWorldController>(HelloWorldController); // get fresh instance

    expect(instance).to.be.instanceof(HelloWorldController);
  });
});
