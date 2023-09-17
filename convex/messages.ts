import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const sendMessage = action({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
    });

    return completion;
  },
});
