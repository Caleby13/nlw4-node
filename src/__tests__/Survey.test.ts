import request from "supertest";
import { app } from "../app";

import createConnection from "../database";

describe("Surveys", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });
  it("Shold be able to crete a new survey", async () => {
    const response = await request(app).post("/surveys").send({
      title: "Diga sua opnião",
      description: "Qual notta você daria para esse teste?",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });
  it("Shold be able to get all survey", async () => {
    await request(app).post("/surveys").send({
      title: "Diga sua opnião2",
      description: "Qual notta você daria para esse teste?2",
    });
    const response = await request(app).get("/surveys");
    expect(response.body.length).toBe(2);
    expect(response.status).toBe(200);
  });
});
