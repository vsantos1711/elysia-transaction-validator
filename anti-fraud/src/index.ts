import { Elysia } from "elysia";
import { consumer, setupConsumers, setupProducers } from "./kafka";
import { verifyTransaction } from "./service/verify-transaction";

await setupConsumers();
await setupProducers();

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const transaction = JSON.parse(message.value?.toString() || "{}");
    await verifyTransaction(transaction);
  },
});

const app = new Elysia()
  .get("/", () => "ANTI-FRAUD SERVICE IS UP!")
  .listen(3333);

console.log(`
==================================================================================
🧊  Anti-fraud microservice is UP at ${app.server?.hostname}:${app.server?.port}
==================================================================================
`);
