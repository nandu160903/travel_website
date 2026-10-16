import { describe, expect, it } from "vitest";
import { isPlaceLookupIntent, PLACE_LOOKUP_REFUSAL } from "./guardrails";
import type { ChatMessage } from "./types";

describe("isPlaceLookupIntent", () => {
  it("accepts place names and nearby queries", () => {
    expect(isPlaceLookupIntent("Munnar", [])).toBe(true);
    expect(isPlaceLookupIntent("Places near Hampi", [])).toBe(true);
  });

  it("rejects greetings and off-topic prompts", () => {
    expect(isPlaceLookupIntent("hello", [])).toBe(false);
    expect(isPlaceLookupIntent("write python code", [])).toBe(false);
  });

  it("exports refusal copy", () => {
    expect(PLACE_LOOKUP_REFUSAL.length).toBeGreaterThan(20);
  });
});

describe("follow-up thread", () => {
  const messages: ChatMessage[] = [
    { role: "user", content: "Goa" },
    {
      role: "assistant",
      content: "Nearby places to visit within 50 km…",
    },
  ];

  it("allows short follow-ups in an active place thread", () => {
    expect(isPlaceLookupIntent("anything closer to the coast?", messages)).toBe(
      true
    );
  });
});
