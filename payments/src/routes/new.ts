import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  OrderStatus,
  NotFoundError,
} from "@hudeentickets/common-package";
import { Order } from "../models/order";
import { stripe } from "../stripe";
// import {Payment} from "../models/payment"
import { natsWrapper } from "../nats-wrapper";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
// import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher.ts";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order has been cancelled");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });
    // using updated stripe api instead of the above
    // const charge = await stripe.paymentIntents.create({
    //   amount: order.price * 100,
    //   currency: "usd",
    //   // payment_method: token,
    //   confirm: true,
    //   automatic_payment_methods: {
    //     enabled: true,
    //     allow_redirects: "never",
    //   },
    //   return_url: "https://example.com/return",
    //   // payment_method: "pm_card_visa",
    // });
    // console.info("charge", charge);
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
