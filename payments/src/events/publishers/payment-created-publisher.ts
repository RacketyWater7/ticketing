import { Publisher, Subjects, PaymentCreatedEvent } from "@hudeentickets/common-package";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
