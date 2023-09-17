import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MAX_FREE_COUNTS = 5;

export const increaseUserApiLimit = mutation({
  args: { userId: v.string(), count: v.number() },
  handler: async (ctx, { userId, count }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated user!");
    }
    const userApiLimit = await ctx.db
      .query("userApiLimit")
      .withIndex("tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier!)
      )
      .unique();

    if (userApiLimit) {
      await ctx.db.patch(userApiLimit._id, {
        count: userApiLimit.count + 1,
        userId: userApiLimit.userId,
      });
    } else {
      await ctx.db.insert("userApiLimit", {
        tokenIdentifier: identity.tokenIdentifier,
        userId: userId,
        count: count,
      });
    }
  },
});

export const checkUserApiLimit = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    // console.log(identity);

    if (!identity) {
      // throw new Error("Unauthenticated user!");
      console.log("Unauthenticated user!");
    }
    console.log("authenticated successfully");

    const userApiLimit = await ctx.db
      .query("userApiLimit")
      .withIndex("tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity?.tokenIdentifier!)
      )
      .unique();

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
      return true;
    } else {
      return false;
    }
  },
});

export const getApiLimitCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      // throw new Error("Unauthenticated user!");
      console.log("Unauthenticated user!");
    }
    const userApiLimit = await ctx.db
      .query("userApiLimit")
      .withIndex("tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity?.tokenIdentifier!)
      )
      .unique();

    if (!userApiLimit) {
      return 0;
    }

    return userApiLimit.count;
  },
});
