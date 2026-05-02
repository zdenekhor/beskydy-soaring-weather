import { NextRequest, NextResponse } from "next/server";
import { getRatingStats, upsertRating } from "@/app/lib/rating-store";

type Params = Promise<{
  key: string;
}>;

function normalizeRating(value: unknown) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  if (num < 1 || num > 5) return 0;
  return Math.round(num);
}

function normalizeUserId(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 120);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Params }
) {
  const { key } = await params;
  const stats = await getRatingStats(key);

  return NextResponse.json(stats);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  const { key } = await params;
  const body = await req.json().catch(() => ({}));

  const userId = normalizeUserId(body?.userId);
  const newRating = normalizeRating(body?.newRating);

  if (!userId) {
    return NextResponse.json(
      { error: "Invalid userId" },
      { status: 400 }
    );
  }

  if (newRating < 1 || newRating > 5) {
    return NextResponse.json(
      { error: "Invalid newRating" },
      { status: 400 }
    );
  }

  const stats = await upsertRating(key, userId, newRating);

  return NextResponse.json({
    ...stats,
    userRating: newRating,
  });
}