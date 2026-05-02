import { NextRequest, NextResponse } from "next/server";
import { addComment, getComments } from "@/app/lib/comment-store";

type Params = Promise<{
  key: string;
}>;

function normalizeString(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeParentId(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric <= 0) return null;
  return numeric;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Params }
) {
  const { key } = await params;
  const comments = await getComments(key);

  return NextResponse.json({ comments });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  const { key } = await params;
  const body = await req.json().catch(() => ({}));

  const userId = normalizeString(body?.userId);
  const authorName = normalizeString(body?.authorName);
  const message = normalizeString(body?.message);
  const parentId = normalizeParentId(body?.parentId);

  if (!userId || !authorName || !message) {
    return NextResponse.json(
      { error: "Invalid comment payload" },
      { status: 400 }
    );
  }

  try {
    const comments = await addComment({
      keyRaw: key,
      userIdRaw: userId,
      authorNameRaw: authorName,
      messageRaw: message,
      parentId,
    });

    return NextResponse.json({ comments });
  } catch (error) {
    if (error instanceof Error && error.message === "PARENT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Parent comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Unable to save comment" },
      { status: 500 }
    );
  }
}