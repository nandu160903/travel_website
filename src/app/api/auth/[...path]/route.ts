import { getAppDirRequestHandler } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "@/lib/supertokens/backend";

ensureSuperTokensInit();

const handleCall = getAppDirRequestHandler();

function withNoCache(res: Response): Response {
  if (!res.headers.has("Cache-Control")) {
    res.headers.set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
  }
  return res;
}

export async function GET(request: Request) {
  return withNoCache(await handleCall(request));
}

export async function POST(request: Request) {
  return withNoCache(await handleCall(request));
}

export async function DELETE(request: Request) {
  return withNoCache(await handleCall(request));
}

export async function PUT(request: Request) {
  return withNoCache(await handleCall(request));
}

export async function PATCH(request: Request) {
  return withNoCache(await handleCall(request));
}

export async function HEAD(request: Request) {
  return withNoCache(await handleCall(request));
}
