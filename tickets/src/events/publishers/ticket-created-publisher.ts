import { Publisher, Subjects, TicketCreatedEvent } from "@hudeentickets/common-package";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
