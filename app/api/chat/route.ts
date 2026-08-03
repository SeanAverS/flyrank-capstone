// Route handler for Chatbox AI responses

import { streamText, convertToModelMessages, createUIMessageStreamResponse } from "ai";
import { CHAT_MODEL, SYSTEM_PROMPT } from "@/lib/ai-config";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: CHAT_MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
}