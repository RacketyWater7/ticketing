import { Publisher, Subjects, TicketUpdatedEvent } from "@hudeentickets/common-package";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
