import {
  isPlaceLookupIntent,
  PLACE_LOOKUP_REFUSAL,
} from "./guardrails";
import { formatNearbyPlacesReply } from "./formatReply";
import { getOpenRouterApiKey, openRouterChatCompletion } from "./openrouter";
import type { ChatMessage } from "./types";

export type { ChatMessage } from "./types";

const SYSTEM_PROMPT = `
You are a single-purpose assistant for motorcycle travelers on "Normad on two wheels".

Your ONLY job: when the user gives a place name (city, town, region, or landmark), suggest nearby places worth visiting—viewpoints, nature, heritage, markets, scenic routes, short day-trip stops.

Rules:
- If no place name is clear, ask for one specific location to anchor suggestions.
- Output 4–6 nearby places. Format each as one line: "Place name – distance/direction; short reason it is worth a stop."
- Put a blank line between every place (use double newlines). Do not use leading dashes or bullet lists.
- End with exactly one line: "Verify opening hours and road conditions locally before riding."
- Prefer realistic, well-known suggestions; do not invent exact addresses, prices, or opening hours—say to verify locally.
- Do NOT answer questions about this website, bookings, itineraries, coding, news, health, finance, or general chat.
- If the user goes off-topic, refuse in one sentence and remind them you only suggest nearby places from a named location.
- Stay under 180 words unless they explicitly ask for more options.
`.trim();

export async function generateChatReply(
  messages: ChatMessage[]
): Promise<string> {
  const lastUser =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (!isPlaceLookupIntent(lastUser, messages)) {
    return PLACE_LOOKUP_REFUSAL;
  }

  if (getOpenRouterApiKey()) {
    const { text, error } = await openRouterChatCompletion(
      messages,
      SYSTEM_PROMPT
    );
    if (text) {
      return formatNearbyPlacesReply(text);
    }
    if (error) {
      console.error("[chat] OpenRouter:", error);
    }
  }

  return localFallbackReply(lastUser);
}

function localFallbackReply(input: string): string {
  const place = extractPlaceHint(input);
  if (!getOpenRouterApiKey()) {
    return `Nearby-place suggestions need OPENROUTER_API_KEY in your environment (free models use a :free suffix on OpenRouter).${place ? ` You asked about ${place}—once configured, I can list stops worth riding to.` : ""}`;
  }

  return `I couldn't reach the model right now.${place ? ` For ${place}, check local tourism maps or OpenStreetMap for viewpoints and heritage sites nearby.` : " Try again in a moment."}`;
}

function extractPlaceHint(input: string): string | null {
  const near = input.match(/\bnear\s+(.+?)(?:[?.!]|$)/i);
  if (near?.[1]) {
    return near[1].trim().slice(0, 80);
  }
  const words = input.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 4) {
    return input.trim().slice(0, 80);
  }
  return null;
}
