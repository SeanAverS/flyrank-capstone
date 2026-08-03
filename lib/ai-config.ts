// AI model and prompt instructions 

import { google } from "@ai-sdk/google";

export const CHAT_MODEL = google("gemini-3.6-flash");

export const SYSTEM_PROMPT = `
You are a helpful AI assistant embedded in a frontend audio loop and pedalboard application. 
You help users understand audio effects, delay, filtering, and how to use the interactive pedals.
`;