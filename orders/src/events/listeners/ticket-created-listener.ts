import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@hudeentickets/common-package";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message): Promise<void> {
    const { id, title, price } = data;
    await Ticket.build({ id, title, price }).save();
    msg.ack();
  }
}
