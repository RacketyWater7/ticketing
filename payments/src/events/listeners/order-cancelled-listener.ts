import { Subjects, OrderCancelledEvent, Listener, OrderStatus } from "@hudeentickets/common-package";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the order that the event is referring to
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    // If the order is not found, throw an error
    if (!order) {
      throw new Error("Order not found");
    }

    // Mark the order as cancelled
    order.set({ status: OrderStatus.Cancelled });

    // Save the order
    await order.save();

    // Ack the message
    msg.ack();
  }
}
