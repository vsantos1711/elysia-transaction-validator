CREATE TABLE IF NOT EXISTS "transactions" (
	"account_external_id_debit" varchar NOT NULL,
	"account_external_id_credit" varchar NOT NULL,
	"transferTypeId" integer NOT NULL,
	"status" varchar NOT NULL,
	"value" integer NOT NULL,
	CONSTRAINT "transactions_account_external_id_debit_unique" UNIQUE("account_external_id_debit"),
	CONSTRAINT "transactions_account_external_id_credit_unique" UNIQUE("account_external_id_credit")
);
