import Redis from "ioredis";
import { gunzipSync, gzipSync } from "node:zlib";

const globalForRedis = globalThis as unknown as { redis?: Redis | null };

function getClient(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (globalForRedis.redis === undefined) {
    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      enableOfflineQueue: false,
    });
    client.on("error", (err) => console.error("Redis error:", err.message));
    globalForRedis.redis = client;
  }
  return globalForRedis.redis;
}

const GZ_PREFIX = "gz:";

// HTML bài viết rất lớn nên nén gzip để tiết kiệm bộ nhớ Redis
const encode = (value: unknown): string => {
  const json = JSON.stringify(value);
  return json.length > 1024 ? GZ_PREFIX + gzipSync(json).toString("base64") : json;
};

const decode = <T,>(raw: string): T | null =>
  JSON.parse(raw.startsWith(GZ_PREFIX) ? gunzipSync(Buffer.from(raw.slice(GZ_PREFIX.length), "base64")).toString() : raw);

let lastWriteWarn = 0;
function warnWrite(err: unknown) {
  // Redis đầy bộ nhớ sẽ lỗi liên tục; chỉ log tối đa 1 lần/phút
  if (Date.now() - lastWriteWarn < 60_000) return;
  lastWriteWarn = Date.now();
  console.warn("Redis set lỗi:", err instanceof Error ? err.message : err);
}

// Cache lỗi thì bỏ qua, luôn fallback về nguồn dữ liệu gốc
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T | null>,
  options: { negativeTtl?: number } = {}
): Promise<T | null> {
  const client = getClient();

  if (client) {
    try {
      const hit = await client.get(key);
      if (hit !== null) return decode<T>(hit);
    } catch (err) {
      console.error("Redis get lỗi:", err);
    }
  }

  const value = await loader();
  const isEmpty = value === null || value === undefined;

  // Kết quả rỗng chỉ được lưu (dạng "null") khi có negativeTtl
  if (client && (!isEmpty || options.negativeTtl)) {
    try {
      await client.set(
        key,
        encode(isEmpty ? null : value),
        "EX",
        isEmpty ? options.negativeTtl! : ttlSeconds
      );
    } catch (err) {
      warnWrite(err);
    }
  }
  return isEmpty ? null : value;
}

const SLUG_MAP_KEY = "suviet:slugmap:v1";

// Ánh xạ slug -> tiêu đề Wikipedia gốc (slug bỏ dấu nên không thể suy ngược bằng tìm kiếm)
export async function getSlugTitle(slug: string): Promise<string | null> {
  const client = getClient();
  if (!client) return null;
  try {
    return await client.hget(SLUG_MAP_KEY, slug);
  } catch {
    return null;
  }
}

export async function saveSlugTitles(entries: Record<string, string>): Promise<void> {
  const client = getClient();
  if (!client || Object.keys(entries).length === 0) return;
  try {
    await client.hset(SLUG_MAP_KEY, entries);
  } catch (err) {
    warnWrite(err);
  }
}
