import { Publisher, OrderCancelledEvent, Subjects } from "@hudeentickets/common-package";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
