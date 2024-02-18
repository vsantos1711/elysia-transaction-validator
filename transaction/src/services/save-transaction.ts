import { db } from "../../db";
import { producer } from "../kafka";
import { NewTransaction, transactions } from "../../db/schema";

export async function saveTransaction(data: NewTransaction) {
  console.log("START SAVING TRANSACTION");
  await db.insert(transactions).values({
    ...data,
    transactionStatus: "pending",
  });

  await producer.send({
    topic: "transactions",
    messages: [{ value: JSON.stringify(data) }],
  });
}
