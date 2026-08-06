// Route handler for Chatbox AI responses

import { streamText, convertToModelMessages, createUIMessageStreamResponse, toUIMessageStream, tool } from "ai";
import { z } from "zod";
import { CHAT_MODEL, SYSTEM_PROMPT } from "@/lib/ai-config";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: CHAT_MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    // ZOD schema
    tools: {
      suggestPedalPreset: tool({
        description: 'Suggests a pedalboard preset (boost, filter, and delay settings) based on a requested guitar tone or genre.',
        inputSchema: z.object({
          styleName: z.string().describe('The name of the tone or genre, e.g. "Ambient Shoegaze", "Heavy Metal Lead"'),
          boostEngaged: z.boolean().describe('Whether Chrono Boost is turned on'),
          gainLevel: z.number().min(0).max(1).describe('Gain knob value between 0 and 1'),
          filterEngaged: z.boolean().describe('Whether Neon Pulse filter is turned on'),
          cutoffFreq: z.number().min(0).max(1).describe('Cutoff frequency knob value between 0 and 1'),
          delayEngaged: z.boolean().describe('Whether Echo Cavern delay is turned on'),
          delayTime: z.number().min(0).max(1).describe('Delay time knob value between 0 and 1'),
        }),
        execute: async (args: {
          styleName: string;
          boostEngaged: boolean;
          gainLevel: number;
          filterEngaged: number | boolean;
          cutoffFreq: number;
          delayEngaged: boolean;
          delayTime: number;
        }) => {
          return {
            success: true,
            preset: args,
          };
        },
      }),
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}