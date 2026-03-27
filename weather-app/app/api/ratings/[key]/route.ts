import { NextRequest, NextResponse } from "next/server";
import {
  getRatingStats,
  removeRating,
  upsertRating,
} from "@/app/lib/rating-store";

type Params = Promise<{
  key: string;
}>;

function normalizeRating(value: unknown) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  if (num < 1 || num > 5) return 0;
  return Math.round(num);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Params }
) {
  const { key } = await params;
  const stats = getRatingStats(key);

  return NextResponse.json(stats);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  const { key } = await params;
  const body = await req.json().catch(() => ({}));

  const previousRating = normalizeRating(body?.previousRating);
  const newRating = normalizeRating(body?.newRating);

  if (newRating < 1 || newRating > 5) {
    return NextResponse.json(
      { error: "Invalid newRating" },
      { status: 400 }
    );
  }

  const stats = upsertRating(key, previousRating, newRating);

  return NextResponse.json({
    ...stats,
    userRating: newRating,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  const { key } = await params;
  const body = await req.json().catch(() => ({}));

  const previousRating = normalizeRating(body?.previousRating);
  const stats = removeRating(key, previousRating);

  return NextResponse.json({
    ...stats,
    userRating: 0,
  });
}