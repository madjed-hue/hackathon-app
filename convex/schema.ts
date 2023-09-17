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
});
