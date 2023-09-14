import { mutation } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (
        user.name !== identity.name ||
        user.pictureUrl !== identity.pictureUrl
      ) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          pictureUrl: identity.pictureUrl,
        });
      }

      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name!,
      email: identity.email!,
      pictureUrl: identity.pictureUrl!,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});
