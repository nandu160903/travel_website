import type { ChatMessage } from "./types";

const OFF_TOPIC_PATTERN =
  /\b(code|programming|python|javascript|essay|homework|crypto|stock|invest|recipe|medical|diagnos|legal|lawyer|politics|election|relationship advice)\b/i;

const GREETING_OR_SITE_ONLY =
  /^(hi|hello|hey|thanks|thank you|ok|okay|help|journeys?|photos?|about|map|blog)[!.?\s]*$/i;

const ON_TOPIC_PATTERN =
  /\b(near|nearby|around|close to|visit|attraction|places?\s+to|things to do|day trip|weekend|stopover|within\s+\d+\s*(km|mi|miles|hour)|from\s+[A-Za-z])/i;

const PLACE_THREAD_PATTERN =
  /\b(nearby|places to visit|within|day trip|viewpoint|attraction|worth a stop)\b/i;

export const PLACE_LOOKUP_REFUSAL =
  "I only help with nearby places to visit when you name a location. Try “Places near Manali” or send a city or town name.";

export function isPlaceLookupIntent(
  text: string,
  messages: ChatMessage[]
): boolean {
  const t = text.trim();
  if (!t || t.length > 2000) {
    return false;
  }
  if (OFF_TOPIC_PATTERN.test(t) || GREETING_OR_SITE_ONLY.test(t)) {
    return false;
  }
  if (ON_TOPIC_PATTERN.test(t)) {
    return true;
  }

  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.content;
  if (
    lastAssistant &&
    PLACE_THREAD_PATTERN.test(lastAssistant) &&
    t.length < 800 &&
    !OFF_TOPIC_PATTERN.test(t)
  ) {
    return true;
  }

  const words = t.split(/\s+/).filter(Boolean);
  if (words.length <= 5 && t.length <= 80 && !OFF_TOPIC_PATTERN.test(t)) {
    return true;
  }

  return false;
}
