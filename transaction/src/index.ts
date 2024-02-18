import { Elysia } from "elysia";
import { consumer, producer, setupConsumers, setupProducers } from "./kafka";

await setupConsumers();
await setupProducers();

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      value: message.value?.toString(),
      text: "AQUI EU ATUALIZO A TRANSACTION NO DB!",
    });
  },
});

const app = new Elysia()
  .get("/", () => "TRANSACTION SERVICE")
  .post("/transaction", async () => {
    console.log("AQUI EU SALVO A TRANSACTION NO DB");
    await producer.send({
      topic: "transactions",
      messages: [{ value: "TRANSAÇÃO XXXX" }],
    });
  })
  .listen(3000);

console.log(`
  ==================================================================================
  🧊  Transaction service is running at ${app.server?.hostname}:${app.server?.port}
  ==================================================================================
  `);
