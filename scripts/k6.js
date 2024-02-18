import http from "k6/http";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

export const options = {
  vus: 25,
  duration: "15s",
};

export default function () {
  const payload = JSON.stringify({
    accountExternalIdDebit: uuidv4(),
    accountExternalIdCredit: uuidv4(),
    transferTypeId: 1,
    value: Math.floor(Math.random() * 2000),
  });

  const headers = { "Content-Type": "application/json" };
  http.post("http://localhost:3000/transaction", payload, {
    headers,
  });
}
