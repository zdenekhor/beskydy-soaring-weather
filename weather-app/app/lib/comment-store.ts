import { Pool } from "pg";

export type CommentItem = {
  id: number;
  parentId: number | null;
  authorName: string;
  message: string;
  createdAt: string;
  replies: CommentItem[];
};

type StoredComment = Omit<CommentItem, "replies">;

const DB_URL = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

const globalForComments = globalThis as typeof globalThis & {
  __commentPool?: Pool;
  __commentInitPromise?: Promise<void>;
  __commentStore?: Map<string, StoredComment[]>;
  __commentSequence?: number;
};

const commentStore = globalForComments.__commentStore ?? new Map<string, StoredComment[]>();

if (!globalForComments.__commentStore) {
  globalForComments.__commentStore = commentStore;
}

if (!globalForComments.__commentSequence) {
  globalForComments.__commentSequence = 1;
}

function normalizeKey(raw: string) {
  return raw.trim().slice(0, 120);
}

function normalizeUserId(raw: string) {
  return raw.trim().slice(0, 120);
}

function normalizeAuthorName(raw: string) {
  const value = raw.trim().replace(/\s+/gu, " ");
  return value.slice(0, 48);
}

function normalizeMessage(raw: string) {
  const value = raw.trim().replace(/\r\n/gu, "\n").replace(/\n{3,}/gu, "\n\n");
  return value.slice(0, 1200);
}

function getDbPool() {
  if (!DB_URL) return null;

  if (!globalForComments.__commentPool) {
    globalForComments.__commentPool = new Pool({
      connectionString: DB_URL,
      max: 3,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 5000,
      ssl: DB_URL.includes("localhost") ? undefined : { rejectUnauthorized: false },
    });
  }

  return globalForComments.__commentPool;
}

async function ensureDbSchema() {
  const pool = getDbPool();
  if (!pool) return;

  if (!globalForComments.__commentInitPromise) {
    globalForComments.__commentInitPromise = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_comments (
          id BIGSERIAL PRIMARY KEY,
          app_key TEXT NOT NULL,
          parent_id BIGINT REFERENCES app_comments(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL,
          author_name TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_app_comments_key_created ON app_comments (app_key, created_at DESC)`
      );

      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_app_comments_parent ON app_comments (parent_id, created_at ASC)`
      );
    })();
  }

  await globalForComments.__commentInitPromise;
}

function nestComments(items: StoredComment[]) {
  const byId = new Map<number, CommentItem>();
  const roots: CommentItem[] = [];

  for (const item of items) {
    byId.set(item.id, {
      ...item,
      replies: [],
    });
  }

  for (const item of items) {
    const current = byId.get(item.id);
    if (!current) continue;

    if (item.parentId === null) {
      roots.push(current);
      continue;
    }

    const parent = byId.get(item.parentId);
    if (parent) {
      parent.replies.push(current);
    } else {
      roots.push(current);
    }
  }

  roots.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  for (const root of roots) {
    root.replies.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  }

  return roots;
}

function getInMemoryComments(key: string) {
  return nestComments(commentStore.get(key) ?? []);
}

export async function getComments(keyRaw: string) {
  const key = normalizeKey(keyRaw);
  const pool = getDbPool();

  if (!pool) {
    return getInMemoryComments(key);
  }

  await ensureDbSchema();

  const result = await pool.query<StoredComment>(
    `
      SELECT
        id,
        parent_id AS "parentId",
        author_name AS "authorName",
        message,
        created_at AS "createdAt"
      FROM app_comments
      WHERE app_key = $1
      ORDER BY created_at DESC, id DESC
      LIMIT 300
    `,
    [key]
  );

  return nestComments(result.rows);
}

export async function addComment(params: {
  keyRaw: string;
  userIdRaw: string;
  authorNameRaw: string;
  messageRaw: string;
  parentId?: number | null;
}) {
  const key = normalizeKey(params.keyRaw);
  const userId = normalizeUserId(params.userIdRaw);
  const authorName = normalizeAuthorName(params.authorNameRaw);
  const message = normalizeMessage(params.messageRaw);
  const parentId = typeof params.parentId === "number" ? params.parentId : null;

  if (!userId || !authorName || !message) {
    throw new Error("INVALID_COMMENT");
  }

  const pool = getDbPool();
  if (!pool) {
    const nextId = globalForComments.__commentSequence ?? 1;
    globalForComments.__commentSequence = nextId + 1;

    const next = {
      id: nextId,
      parentId,
      authorName,
      message,
      createdAt: new Date().toISOString(),
    } satisfies StoredComment;

    const current = commentStore.get(key) ?? [];
    if (parentId !== null && !current.some((item) => item.id === parentId)) {
      throw new Error("PARENT_NOT_FOUND");
    }

    commentStore.set(key, [next, ...current]);
    return getInMemoryComments(key);
  }

  await ensureDbSchema();

  if (parentId !== null) {
    const parent = await pool.query(
      `SELECT id FROM app_comments WHERE id = $1 AND app_key = $2 LIMIT 1`,
      [parentId, key]
    );

    if (parent.rowCount === 0) {
      throw new Error("PARENT_NOT_FOUND");
    }
  }

  await pool.query(
    `
      INSERT INTO app_comments (app_key, parent_id, user_id, author_name, message)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [key, parentId, userId, authorName, message]
  );

  return getComments(key);
}