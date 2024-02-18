import { eq } from "drizzle-orm";
import { db } from "../../db";
import { Transaction, transactions } from "../../db/schema";

export async function updateTransaction(data: Transaction) {
  console.log("START UPDATING TRANSACTION");

  await db
    .update(transactions)
    .set({ transactionStatus: data.transactionStatus })
    .where(
      eq(transactions.accountExternalIdDebit, data.accountExternalIdDebit)
    );

  console.log(`TRANSACTION UPDATED WITH STATUS: ${data.transactionStatus}`);
}
