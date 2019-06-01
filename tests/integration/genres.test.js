const request = require("supertest");
const { Genre } = require("../../models/genre");
const mongoose = require("mongoose");

let server;
describe("/api/genres", () => {
  beforeEach(async () => {
    server = await require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" }
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
  });
});
