# 🐬 Building event-driven systems with Kafka and ElysiaJS

> ⚠️ This repository was created based on [this problem](https://github.com/yaperos/app-nodejs-codechallenge) with the idea to practice using Kafka.

<p align=center>
 <img src="https://github.com/elysiajs/elysia/assets/35027979/15653752-866c-4525-99f9-edde0aafc856" alt="ElysiaJS logo with word ElysiaJS on the left" width="340px" />
 <img src="assets/kafka-image.png" alt="Apache kafka image" width="410px" />
</p>

## Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status. For now, we have only three transaction statuses:

- pending
- approved
- rejected

Every transaction with a value greater than 1000 should be rejected.

<p align=center>
<img src="assets/diagram.png" width="700px"/>
</p>

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
   git clone https://github.com/vsantos/elysia-transaction-validate.git && cd elysia-transaction-validate
   ```

2. Start the Kafka using Docker Compose:

   ```bash
   docker compose up
   ```

3. Run the `messages` service:

   ```bash
   cd messages && bun install && bun run dev
   ```

4. Run the `notification` service:

   ```bash
   cd notification && bun install && bun run dev
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
