import { Publisher, OrderCreatedEvent, Subjects } from "@hudeentickets/common-package";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
