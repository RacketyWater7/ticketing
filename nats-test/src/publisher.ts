import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  try {
    console.log("Publisher connected to NATS");

    const publisher = new TicketCreatedPublisher(stan);
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 30,
    });
  } catch (err) {
    console.log(err);
  }
});
