import { ExpirationCompleteEvent, Publisher, Subjects } from "@hudeentickets/common-package";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
