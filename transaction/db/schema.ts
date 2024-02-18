import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  accountExternalIdDebit: varchar("account_external_id_debit")
    .unique()
    .notNull(),
  accountExternalIdCredit: varchar("account_external_id_credit")
    .unique()
    .notNull(),
  transferTypeId: integer("transferTypeId").notNull(),
  transactionStatus: varchar("status", {
    enum: ["pending", "approved", "rejected"],
  }).notNull(),
  value: integer("value").notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = Omit<Transaction, "transactionStatus">;
