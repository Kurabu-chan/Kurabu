import { expect } from "chai";
import { PlatformTest } from "@tsed/common";
import SuperTest from "supertest";
import { HelloWorldController } from "./HelloWorldController";
import { Server } from "../../Server";

describe("HelloWorldController", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server, {
    mount: {
      "/": HelloWorldController
    }
  }));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it("should call GET /hello-world", async () => {
     const response = await request.get("/hello-world").expect(200);

     expect(response.text).to.eq("hello");
  });
});
