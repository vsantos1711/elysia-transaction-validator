import { Elysia, t } from "elysia";
import { consumer, setupConsumers, setupProducers } from "./kafka";
import { saveTransaction } from "./services/save-transaction";
import { updateTransaction } from "./services/update-transaction";

await setupConsumers();
await setupProducers();

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const transaction = JSON.parse(message.value?.toString() || "{}");
    updateTransaction(transaction);
  },
});

const app = new Elysia()
  .get("/", () => "TRANSACTION SERVICE")
  .post(
    "/transaction",
    async ({ body }) => {
      await saveTransaction(body);
    },
    {
      body: t.Object({
        accountExternalIdDebit: t.String(),
        accountExternalIdCredit: t.String(),
        transferTypeId: t.Number(),
        value: t.Number(),
      }),
    }
  )
  .listen(3000);

console.log(`
==================================================================================
🪼  Transaction service is running at ${app.server?.hostname}:${app.server?.port}
==================================================================================
`);
