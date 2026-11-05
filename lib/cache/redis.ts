import Redis from "ioredis";

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

// Cache lỗi thì bỏ qua, luôn fallback về nguồn dữ liệu gốc
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T | null>
): Promise<T | null> {
  const client = getClient();

  if (client) {
    try {
      const hit = await client.get(key);
      if (hit) return JSON.parse(hit) as T;
    } catch (err) {
      console.error("Redis get lỗi:", err);
    }
  }

  const value = await loader();

  if (client && value !== null && value !== undefined) {
    try {
      await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (err) {
      console.error("Redis set lỗi:", err);
    }
  }
  return value;
}
