import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

export const consumer = kafka.consumer({ groupId: "anti-fraud-service" });
export const producer = kafka.producer();

export async function setupConsumers() {
  await consumer.connect();
  await consumer.subscribe({ topic: "anti-fraud" });
}

export async function setupProducers() {
  await producer.connect();
}
