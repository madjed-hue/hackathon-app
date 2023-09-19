"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import Stripe from "stripe";
import { internal } from "./_generated/api";

export const pay = action({
  args: { userId: v.string() },
  handler: async ({ runMutation, runQuery }, { userId }) => {
    const domain = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
      apiVersion: "2023-08-16",
    });

    const userSubscription = await runQuery(
      internal.payments.userSubsecriptionQuery
    );

    if (userSubscription && userSubscription.stripeCustomerId) {
      const session = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: domain,
      });
      return session.url;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "MindMelt Pro",
              description: "Unlimited AI Generations",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${domain}/settings`,
      cancel_url: `${domain}/settings`,
      payment_method_types: ["card"],
    });

    const paymentId = await runMutation(internal.payments.create, { userId });

    await runMutation(internal.payments.markPending, {
      paymentId,
      stripeId: session.id,
    });
    return session.url;
  },
});

export const fulfill = internalAction({
  args: { signature: v.string(), body: v.string() },
  handler: async ({ runMutation }, { signature, body }) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
      apiVersion: "2023-08-16",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

      const session = event.data.object as Stripe.Checkout.Session;

      if (event.type === "checkout.session.completed") {
        const stripeId = (event.data.object as { id: string }).id;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        await runMutation(internal.payments.fulfill, {
          stripeId,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ).toString(),
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
        });
      }

      if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await runMutation(internal.payments.update, {
          stripeSubscriptionId: subscription.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ).toString(),
          stripePriceId: subscription.items.data[0].price.id,
        });
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});
