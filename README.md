# 🐬 Building event-driven systems with Kafka and ElysiaJS

_⚠️ This repository was created with the idea to practice using Kafka._
![Frame](https://raw.githubusercontent.com/vsantos1711/elysia-transaction-validator/main/assets/tech.png)

## Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status. For now, we have only three transaction statuses:

- pending
- approved
- rejected

Every transaction with a value greater than 1000 should be rejected.

<p align=center>
<img src="https://raw.githubusercontent.com/vsantos1711/elysia-transaction-validator/main/assets/diagram.png" width="700px"/>
</p>

## Tools

[<img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" />](https://bun.sh/)
[<img src="https://img.shields.io/badge/Elysia-565656?style=for-the-badge" />](https://elysiajs.com/)
[<img src="https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka" />](https://kafka.apache.org/)
[<img src="https://img.shields.io/badge/drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" />](https://orm.drizzle.team/)
[<img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" />](https://www.postgresql.org/)

## How to run

<details open>
<summary>
Pre-requisites
</summary> <br />
To be able to start development the application make sure that you have the following pre-requisites installed:

###

- Bun

  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

- Docker and Docker Compose installed
- [K6 (optional)](https://k6.io/docs/get-started/installation/)

##

</details>

<details open>
<summary>
Running the app
</summary> <br />
To be able to start development the application make sure that you have the following pre-requisites installed:

###

1. Clone repository:

   ```bash
   git clone https://github.com/vsantos1711/elysia-transaction-validate.git && cd elysia-transaction-validate
   ```

2. Start the Kafka using Docker Compose:

   ```bash
   docker compose up
   ```

3. Run the `anti-fraud` service:

   ```bash
   cd anti-fraud && bun install && bun run dev
   ```

4. Run the `transaction` service:

   ```bash
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
