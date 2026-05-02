import { NextRequest, NextResponse } from "next/server";
import { trackView } from "@/app/lib/rating-store";

type Params = Promise<{
  key: string;
}>;

function normalizeViewerId(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 120);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  const { key } = await params;
  const body = await req.json().catch(() => ({}));
  const viewerId = normalizeViewerId(body?.viewerId);

  const views = await trackView(key, viewerId || undefined);

  return NextResponse.json({ views });
}
