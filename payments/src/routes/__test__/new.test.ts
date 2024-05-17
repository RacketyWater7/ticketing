import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@hudeentickets/common-package";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

// jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "token",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "token",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "token",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 400 bad request", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(400);

  // const stripeCharges = await stripe.charges.list({ limit: 50 });
  // const stripeCharge = stripeCharges.data.find((charge) => {
  //   return charge.amount === order.price * 100;
  // });

  // expect(stripeCharge).toBeDefined();
  // expect(stripeCharge!.currency).toEqual("usd");

  // const payment = await Payment.findOne({
  //   orderId: order.id,
  //   stripeId: stripeCharge!.id,
  // });
  // expect(payment).not.toBeNull();

  // const publishOptions = (natsWrapper.client.publish as jest.Mock).mock.calls[0];
  // expect(publishOptions[0]).toEqual("payment:created");
});
