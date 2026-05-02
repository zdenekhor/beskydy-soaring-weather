import { Pool } from "pg";

type RatingStats = {
  count: number;
  average: number;
  views: number;
};

// Supports both generic DATABASE_URL and Vercel Postgres POSTGRES_URL
const DB_URL = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

const globalForRatings = globalThis as typeof globalThis & {
  __ratingPool?: Pool;
  __ratingInitPromise?: Promise<void>;
  __ratingStore?: Map<string, Map<string, number>>;
  __viewStore?: Map<string, number>;
};

const ratingStore =
  globalForRatings.__ratingStore ?? new Map<string, Map<string, number>>();
const viewStore = globalForRatings.__viewStore ?? new Map<string, number>();

if (!globalForRatings.__ratingStore) {
  globalForRatings.__ratingStore = ratingStore;
}

if (!globalForRatings.__viewStore) {
  globalForRatings.__viewStore = viewStore;
}

function normalizeKey(raw: string) {
  return raw.trim().slice(0, 120);
}

function normalizeUserId(raw: string) {
  return raw.trim().slice(0, 120);
}

function getDbPool() {
  if (!DB_URL) return null;

  if (!globalForRatings.__ratingPool) {
    globalForRatings.__ratingPool = new Pool({
      connectionString: DB_URL,
      // max 3 connections — safe for Vercel serverless (multiple concurrent invocations)
      max: 3,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 5000,
      ssl: DB_URL.includes("localhost") ? undefined : { rejectUnauthorized: false },
    });
  }

  return globalForRatings.__ratingPool;
}

async function ensureDbSchema() {
  const pool = getDbPool();
  if (!pool) return;

  if (!globalForRatings.__ratingInitPromise) {
    globalForRatings.__ratingInitPromise = (async () => {
      // Current rating per user (one row per user, updated on change)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_ratings (
          app_key TEXT NOT NULL,
          user_id TEXT NOT NULL,
          rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (app_key, user_id)
        )
      `);

      // Full history — every rating change with timestamp
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_rating_history (
          id BIGSERIAL PRIMARY KEY,
          app_key TEXT NOT NULL,
          user_id TEXT NOT NULL,
          rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_rating_history_key ON app_rating_history (app_key, created_at DESC)`
      );

      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_views (
          id BIGSERIAL PRIMARY KEY,
          app_key TEXT NOT NULL,
          viewer_id TEXT,
          viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_app_views_key ON app_views (app_key)`
      );
    })();
  }

  await globalForRatings.__ratingInitPromise;
}

function getInMemoryStats(key: string): RatingStats {
  const users = ratingStore.get(key) ?? new Map<string, number>();
  const count = users.size;

  let sum = 0;
  for (const value of users.values()) {
    sum += value;
  }

  return {
    count,
    average: count > 0 ? sum / count : 0,
    views: viewStore.get(key) ?? 0,
  };
}

export async function getRatingStats(keyRaw: string): Promise<RatingStats> {
  const key = normalizeKey(keyRaw);

  const pool = getDbPool();
  if (!pool) {
    return getInMemoryStats(key);
  }

  await ensureDbSchema();

  const [ratingAgg, viewAgg] = await Promise.all([
    pool.query(
      `
        SELECT COUNT(*)::int AS count, COALESCE(AVG(rating), 0)::float AS average
        FROM app_ratings
        WHERE app_key = $1
      `,
      [key]
    ),
    pool.query(
      `
        SELECT COUNT(*)::int AS views
        FROM app_views
        WHERE app_key = $1
      `,
      [key]
    ),
  ]);

  return {
    count: ratingAgg.rows[0]?.count ?? 0,
    average: ratingAgg.rows[0]?.average ?? 0,
    views: viewAgg.rows[0]?.views ?? 0,
  };
}

export async function upsertRating(
  keyRaw: string,
  userIdRaw: string,
  newRating: number
): Promise<RatingStats> {
  const key = normalizeKey(keyRaw);
  const userId = normalizeUserId(userIdRaw);

  const pool = getDbPool();
  if (!pool) {
    const byUser = ratingStore.get(key) ?? new Map<string, number>();
    byUser.set(userId, newRating);
    ratingStore.set(key, byUser);
    return getInMemoryStats(key);
  }

  await ensureDbSchema();

  // Update current rating (upsert — one row per user)
  await pool.query(
    `
      INSERT INTO app_ratings (app_key, user_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (app_key, user_id)
      DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW()
    `,
    [key, userId, newRating]
  );

  // Log to history — every change is preserved with timestamp
  await pool.query(
    `
      INSERT INTO app_rating_history (app_key, user_id, rating)
      VALUES ($1, $2, $3)
    `,
    [key, userId, newRating]
  );

  return getRatingStats(key);
}

export async function trackView(
  keyRaw: string,
  viewerIdRaw?: string
): Promise<number> {
  const key = normalizeKey(keyRaw);
  const viewerId = viewerIdRaw ? normalizeUserId(viewerIdRaw) : null;

  const pool = getDbPool();
  if (!pool) {
    const next = (viewStore.get(key) ?? 0) + 1;
    viewStore.set(key, next);
    return next;
  }

  await ensureDbSchema();

  await pool.query(
    `
      INSERT INTO app_views (app_key, viewer_id)
      VALUES ($1, $2)
    `,
    [key, viewerId]
  );

  const result = await pool.query(
    `
      SELECT COUNT(*)::int AS views
      FROM app_views
      WHERE app_key = $1
    `,
    [key]
  );

  return result.rows[0]?.views ?? 0;
}