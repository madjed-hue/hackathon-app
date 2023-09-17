import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const sendPictureMessage = action({
  args: {
    prompt: v.string(),
    amount: v.string(),
    resolution: v.union(
      v.literal("256x256"),
      v.literal("512x512"),
      v.literal("1024x1024")
    ),
  },
  handler: async (ctx, { prompt, amount, resolution }) => {
    const completion = await openai.images.generate({
      prompt: prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    return completion;
  },
});
