# 🐬 Building event-driven systems with Kafka and ElysiaJS

_⚠️ This repository was created with the idea to practice using Kafka._
![Frame](https://raw.githubusercontent.com/vsantos1711/elysia-transaction-validator/main/assets/tech.png)

## Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status. For now, we have only three transaction statuses:

- pending
- approved
- rejected

Every transaction with a value greater than **1000** should be rejected.

![Frame](https://raw.githubusercontent.com/vsantos1711/elysia-transaction-validator/main/assets/diagram.png)

## Technologies Used

- **[Bun:](https://bun.sh/)** A fast JavaScript runtime that is used for running the `anti-fraud` and `transaction` services.
- **[Elysia:](https://elysiajs.com/)** A framework used for building the application's web services.
- **[Apache Kafka:](https://kafka.apache.org/)** The event streaming platform used to handle messaging between services.
- **[Drizzle:](https://orm.drizzle.team/)** An ORM (Object-Relational Mapping) tool used for interacting with the database.
- **[PostgreSQL:](https://www.postgresql.org/)** The relational database used for storing transaction data.

## How to run

<details open><summary> Pre-requisites </summary> <br />
To be able to start development the application make sure that you have the following pre-requisites installed:
  
- Bun
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
- Docker and Docker Compose installed
- [K6 (optional)](https://k6.io/docs/get-started/installation/)

---
</details>

<details open><summary> Running the app </summary> <br />
To be able to start development the application make sure that you have the following pre-requisites installed:

1. Clone repository:

   ```shell
   git clone https://github.com/vsantos1711/elysia-transaction-validate.git && cd elysia-transaction-validate
   ```
2. Start the Kafka using Docker Compose:

   ```shell
   docker compose up
   ```
3. Run the `anti-fraud` service:

   ```shell
   cd anti-fraud && bun install && bun run dev
   ```
4. Run the `transaction` service:

   ```js
   cd transaction && bun install && bun run dev
   ```
</details>

## API Endpoint

### Create Transaction

- **URL:** `/transaction`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
    "accountExternalIdDebit": "string",
    "accountExternalIdCredit": "string",
    "tranferTypeId": 1,
    "value": 1
  }
  ```

## Run k6 test

```bash
k6 run scripts/k6.js
```
