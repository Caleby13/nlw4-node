import request from "supertest";
import { app } from "../app";

import createConnection from "../database";

describe("Users", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });
  it("Shold be able to crete a new user", async () => {
    const response = await request(app).post("/users").send({
      email: "user@exampe.com",
      name: "User Example",
    });
    expect(response.status).toBe(201);
  });

  it("Shold not be able to crete a user with exists email", async () => {
    const response = await request(app).post("/users").send({
      email: "user@exampe.com",
      name: "User Example",
    });

    expect(response.status).toBe(400);
  });
});
