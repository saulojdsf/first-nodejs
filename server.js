//import { createServer } from "node:http";

//const server = createServer((request, response) => {
//  response.write("Hello, World!");
//  return response.end();
//});

//server.listen(3000, () => {
//  console.log("Server is running on http://localhost:3000");
//});

import { fastify } from "fastify";
import { DatabaseMemory } from "./database-memory.js";

const server = fastify();
const database = new DatabaseMemory();

server.post("/videos", async (request, reply) => {
  const { title, description, duration } = request.body;
  database.create({ title, description, duration });
  return reply.code(201).send({ message: "Video  1 created successfully" });
});

server.get("/videos", async (request, reply) => {
  const search = request.query.search || "";
  const videos = database
    .list()
    .filter((video) =>
      video.title.toLowerCase().includes(search.toLowerCase())
    );
  return reply.code(200).send(videos);
});

server.put("/videos/:id", async (request, reply) => {
  const { id } = request.params;
  const { title, description, duration } = request.body;
  database.update(id, { title, description, duration });
  return reply.code(200).send({ message: "Video updated successfully" });
});

server.delete("/videos/:id", async (request, reply) => {
  const { id } = request.params;
  database.delete(id);
  return reply.code(200).send({ message: "Video deleted successfully" });
});

server.get("/", async (request, reply) => {
  return "Hello, World!";
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
