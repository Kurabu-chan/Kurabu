import { PlatformTest } from "@tsed/common";
import SuperTest from "supertest";
import {expect} from "chai";
import { Server } from "./Server";

describe("Server", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it("should call GET /rest", async () => {
     const response = await request.get("/rest").expect(404);

     expect(response.body).to.deep.equal({
       errors: [],
       message: 'Resource "/rest" not found',
       name: "NOT_FOUND",
       status: 404,
     });
  });
});
