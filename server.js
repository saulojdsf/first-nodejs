//import { createServer } from "node:http";

//const server = createServer((request, response) => {
//  response.write("Hello, World!");
//  return response.end();
//});

//server.listen(3000, () => {
//  console.log("Server is running on http://localhost:3000");
//});

import { fastify } from "fastify";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();
const database = new DatabasePostgres();

await database.connect();

server.post("/videos", async (request, reply) => {
  const { title, description, duration } = request.body;
  const video = await database.create({ title, description, duration });
  return reply.code(201).send({ message: "Video created successfully", video });
});

server.get("/videos", async (request, reply) => {
  const search = request.query.search || "";
  const videos = await database.list();
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );
  return reply.code(200).send(filteredVideos);
});

server.put("/videos/:id", async (request, reply) => {
  const { id } = request.params;
  const { title, description, duration } = request.body;
  const video = await database.update(id, { title, description, duration });
  return reply.code(200).send({ message: "Video updated successfully", video });
});

server.delete("/videos/:id", async (request, reply) => {
  const { id } = request.params;
  await database.delete(id);
  return reply.code(200).send({ message: "Video deleted successfully" });
});

server.get("/", async (request, reply) => {
  return "Hello, World!";
});

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is live now on ${address}`);
});
