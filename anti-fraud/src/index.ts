import { Elysia } from "elysia";
import { consumer, producer, setupConsumers, setupProducers } from "./kafka";

await setupConsumers();
await setupProducers();

async function send() {
  await producer.send({
    topic: "anti-fraud",
    messages: [{ value: "AQUI EU RETORNO O NOVO STATUS DA TRANSACTION" }],
  });
}

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      value: message.value?.toString(),
      text: "AQUI EU VERIFICO A TRANSACTION!",
    });
    await send();
  },
});

const app = new Elysia().get("/", () => "ANTI-FRAUD SERVICE").listen(3333);

console.log(`
==================================================================================
🪼  Anti-fraud microservice is UP at ${app.server?.hostname}:${app.server?.port}
==================================================================================
`);
