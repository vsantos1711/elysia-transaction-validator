CREATE TABLE IF NOT EXISTS "transactions" (
	"account_external_id_debit" varchar,
	"account_external_id_credit" varchar,
	"transferTypeId" integer,
	"status" varchar,
	"value" integer,
	CONSTRAINT "transactions_account_external_id_debit_unique" UNIQUE("account_external_id_debit"),
	CONSTRAINT "transactions_account_external_id_credit_unique" UNIQUE("account_external_id_credit")
);
