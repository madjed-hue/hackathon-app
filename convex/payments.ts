import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const create = internalMutation({
  handler: async (ctx, { userId }: { userId: string }) => {
    return await ctx.db.insert("payments", {
      userId: userId,
    });
  },
});

export const markPending = internalMutation({
  args: {
    paymentId: v.id("payments"),
    stripeId: v.string(),
    // stripeCurrentPeriodEnd: v.string(),
    // stripeCustomerId: v.string(),
    // stripeSubscriptionId: v.string(),
    // stripePriceId: v.string(),
  },
  handler: async (
    ctx,
    {
      paymentId,
      stripeId,
      // stripeCurrentPeriodEnd,
      // stripeCustomerId,
      // stripeSubscriptionId,
      // stripePriceId,
    }
  ) => {
    await ctx.db.patch(paymentId, {
      stripeId,
      // stripeCurrentPeriodEnd,
      // stripeCustomerId,
      // stripeSubscriptionId,
      // stripePriceId,
    });
  },
});

export const fulfill = internalMutation({
  args: {
    stripeId: v.string(),
    stripeCurrentPeriodEnd: v.any(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
  },
  handler: async (
    ctx,
    {
      stripeId,
      stripeCurrentPeriodEnd,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
    }
  ) => {
    const { _id: paymentId } = (await ctx.db
      .query("payments")
      .withIndex("stripeId", (q) => q.eq("stripeId", stripeId))
      .unique())!;
    await ctx.db.patch(paymentId, {
      stripeCurrentPeriodEnd,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
    });
  },
});

export const update = internalMutation({
  args: {
    stripeCurrentPeriodEnd: v.any(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
  },
  handler: async (
    ctx,
    { stripeCurrentPeriodEnd, stripeSubscriptionId, stripePriceId }
  ) => {
    const { _id: paymentId } = (await ctx.db
      .query("payments")
      .withIndex("stripeSubscriptionId", (q) =>
        q.eq("stripeSubscriptionId", stripeSubscriptionId)
      )
      .unique())!;
    await ctx.db.patch(paymentId, {
      stripeCurrentPeriodEnd,
      stripePriceId,
    });
  },
});

export const userSubsecriptionQuery = internalQuery({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      // throw new Error("Unauthenticated user!");
      console.log("Unauthenticated user!");
    }

    console.log(identity);

    const userSubscription = await ctx.db
      .query("payments")
      .withIndex("userId", (q) => q.eq("userId", identity?.subject!))
      .unique();

    if (!userSubscription) {
      return;
    }

    return userSubscription;
  },
});
