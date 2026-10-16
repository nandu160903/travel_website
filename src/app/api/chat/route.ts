import { NextRequest, NextResponse } from "next/server";
import { withSession } from "supertokens-node/nextjs";
import { z } from "zod";
import { ensureSuperTokensInit } from "@/lib/supertokens/backend";
import { checkRateLimit } from "@/lib/chat/rateLimit";
import { generateChatReply, type ChatMessage } from "@/lib/chat/responder";

ensureSuperTokensInit();

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(24),
});

export async function POST(request: NextRequest) {
  return withSession(
    request,
    async (_err, session) => {
      if (!session) {
        return NextResponse.json({ error: "Sign in to use the chat." }, { status: 401 });
      }

      const userId = session.getUserId();
      const rate = checkRateLimit(`chat:${userId}`, 30, 60_000);
      if (!rate.ok) {
        return NextResponse.json(
          { error: "Too many messages. Try again shortly." },
          {
            status: 429,
            headers: { "Retry-After": String(rate.retryAfterSec) },
          }
        );
      }

      let payload: z.infer<typeof bodySchema>;
      try {
        payload = bodySchema.parse(await request.json());
      } catch {
        return NextResponse.json({ error: "Invalid message payload." }, { status: 400 });
      }

      const messages = payload.messages as ChatMessage[];
      const reply = await generateChatReply(messages);

      return NextResponse.json({ reply });
    },
    { sessionRequired: false }
  );
}
