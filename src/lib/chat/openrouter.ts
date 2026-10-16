import type { ChatMessage } from "./types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Free-tier model on OpenRouter; override if a :free model is retired. */
const DEFAULT_OPENROUTER_MODEL = "nvidia/nemotron-3.5-super-vl:free";

export function getOpenRouterApiKey(): string | undefined {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  return key || undefined;
}

export function getOpenRouterModel(): string {
  return (
    process.env.OPENROUTER_MODEL?.trim() ??
    process.env.OPENROUTER_CHAT_MODEL?.trim() ??
    DEFAULT_OPENROUTER_MODEL
  );
}

type OpenRouterMessage = {
  content?: string | null;
  reasoning?: string | null;
  reasoning_details?: { type?: string; text?: string }[];
};

type OpenRouterResponse = {
  choices?: {
    message?: OpenRouterMessage;
    finish_reason?: string | null;
  }[];
  error?: { message?: string };
};

function extractAssistantText(message: OpenRouterMessage | undefined): string {
  if (!message) {
    return "";
  }
  const content = message.content?.trim();
  if (content) {
    return content;
  }
  const reasoning = message.reasoning?.trim();
  if (reasoning) {
    return reasoning;
  }
  for (const part of message.reasoning_details ?? []) {
    const text = part.text?.trim();
    if (text) {
      return text;
    }
  }
  return "";
}

/** Fetch header values must be ByteStrings (Latin-1); strip non-ASCII. */
function asciiHeaderValue(value: string): string {
  return value.replace(/[^\x00-\xff]/g, "-");
}

export async function openRouterChatCompletion(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<{ text: string | null; error?: string }> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    return { text: null, error: "OpenRouter API key is not configured." };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ??
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    "http://localhost:3000";

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": asciiHeaderValue(siteUrl),
        "X-Title": asciiHeaderValue("Normad on two wheels - nearby places"),
      },
      body: JSON.stringify({
        model: getOpenRouterModel(),
        messages: [
          { role: "system", content: systemPrompt.trim() },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 800,
        temperature: 0.5,
        // Reasoning models (e.g. nvidia/nemotron-*:free) otherwise fill the budget with
        // `reasoning` and return null `content` → "Empty response from the model."
        reasoning: { effort: "none" },
      }),
    });

    const raw = await res.text();
    let data: OpenRouterResponse;
    try {
      data = JSON.parse(raw) as OpenRouterResponse;
    } catch {
      return { text: null, error: "Invalid response from OpenRouter." };
    }

    if (!res.ok) {
      const msg =
        data.error?.message ||
        raw.slice(0, 240) ||
        `OpenRouter error (${res.status}).`;
      return { text: null, error: msg };
    }

    const choice = data.choices?.[0];
    const text = extractAssistantText(choice?.message);
    if (!text) {
      const finish = choice?.finish_reason ?? "unknown";
      return {
        text: null,
        error: `Empty response from the model (finish_reason=${finish}). Try OPENROUTER_MODEL=nvidia/nemotron-3.5-super-vl:free or another :free model.`,
      };
    }

    return { text };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Request failed.";
    return { text: null, error: message };
  }
}
