const COINGECKO_PRICE =
  "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd";

/** CoinGecko's free tier is rate limited; one request a minute is plenty. */
const CACHE_TTL_MS = 60_000;

let cached: { promise: Promise<number>; at: number } | null = null;

async function requestPrice(): Promise<number> {
  const response = await fetch(COINGECKO_PRICE, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`price request failed: ${response.status}`);
  }

  const data = (await response.json()) as { "the-open-network"?: { usd?: number } };
  const price = data["the-open-network"]?.usd;

  if (typeof price !== "number" || !(price > 0)) {
    throw new Error("price missing from response");
  }

  return price;
}

/**
 * Current TON/USD price from CoinGecko's public API. Called straight from the
 * browser — there is no backend — so a failure is expected now and then
 * (rate limits, blockers) and the caller falls back to a manual price.
 *
 * The request is shared across mounts and client-side navigations for a
 * minute; a failed request is not cached, so the next visit retries.
 */
export function fetchTonUsdPrice(): Promise<number> {
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.promise;
  }

  const promise = requestPrice();
  cached = { promise, at: Date.now() };
  promise.catch(() => {
    if (cached?.promise === promise) {
      cached = null;
    }
  });

  return promise;
}
