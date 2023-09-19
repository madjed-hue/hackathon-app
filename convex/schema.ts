import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    text: v.any(),
  }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    email: v.string(),
    pictureUrl: v.string(),
  }).index("email", ["email"]),
  pictures: defineTable({
    prompt: v.string(),
    num: v.string(),
    resolution: v.any(),
  }),
  userApiLimit: defineTable({
    userId: v.string(),
    count: v.number(),
    tokenIdentifier: v.string(),
  }).index("tokenIdentifier", ["tokenIdentifier"]),
  payments: defineTable({
    userId: v.string(),
    stripeId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeCurrentPeriodEnd: v.optional(v.any()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
  })
    .index("stripeId", ["stripeId"])
    .index("userId", ["userId"])
    .index("stripeSubscriptionId", ["stripeSubscriptionId"]),
});
