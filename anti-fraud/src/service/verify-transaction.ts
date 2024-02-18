import { producer } from "../kafka";

type TransactionData = {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  transactionStatus: "pending" | "approved" | "rejected";
  value: number;
};

export async function verifyTransaction(data: TransactionData) {
  data.transactionStatus = "approved";

  if (data.value > 1000) data.transactionStatus = "rejected";

  console.log(`TRANSACTION VERIFIED WITH STATUS: ${data.transactionStatus}`);

  await producer.send({
    topic: "anti-fraud",
    messages: [{ value: JSON.stringify(data) }],
  });
}
