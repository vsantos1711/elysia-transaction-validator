import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "ANTI-FRAUD MICROSERVICE").listen(3003);

console.log(
  `🪼  Anti-fraud microservice is UP at ${app.server?.hostname}:${app.server?.port}`
);
