import { fromNano } from "ton-core";

const TONAPI_ACCOUNTS = "https://tonapi.io/v2/accounts/";

export type OnChainAccount = {
  /** `active`, `uninit`, `frozen`, or whatever else the API reports. */
  status: string;
  /** Balance in TON, already formatted for display. */
  balance: string;
  isWallet: boolean;
  isScam: boolean;
  /** Contract interfaces, e.g. `wallet_v4r2`, `jetton_master`. */
  interfaces: string[];
  /** Human label when the account is a known entity. */
  name?: string;
  lastActivity?: number;
};

export type OnChainErrorCode = "rateLimited" | "notFound" | "network";

export class OnChainError extends Error {
  readonly code: OnChainErrorCode;

  constructor(code: OnChainErrorCode) {
    super(code);
    this.name = "OnChainError";
    this.code = code;
  }
}

/**
 * The API reports the balance in nanotons as a JSON number, which loses
 * precision above ~9M TON. Pulling the digits out of the raw body keeps large
 * exchange and foundation balances exact.
 */
function readExactBalance(body: string): string {
  const match = body.match(/"balance"\s*:\s*"?(\d+)"?/);

  return match ? match[1] : "0";
}

function formatTon(nano: string): string {
  const exact = fromNano(nano);
  const [whole, fraction = ""] = exact.split(".");
  const trimmed = fraction.slice(0, 4).replace(/0+$/, "");
  const grouped = Number(whole).toLocaleString("en-US");

  return trimmed ? `${grouped}.${trimmed}` : grouped;
}

/**
 * Looks the account up on tonapi.io. This is the only part of the checker that
 * touches the network, and it runs only when the user asks for it — there is no
 * backend, the request goes straight from the browser to the public API.
 */
export async function fetchAccount(
  address: string,
  signal?: AbortSignal
): Promise<OnChainAccount> {
  let response: Response;

  try {
    response = await fetch(`${TONAPI_ACCOUNTS}${encodeURIComponent(address)}`, {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new OnChainError("network");
  }

  if (response.status === 429) {
    throw new OnChainError("rateLimited");
  }
  if (response.status === 404) {
    throw new OnChainError("notFound");
  }
  if (!response.ok) {
    throw new OnChainError("network");
  }

  const body = await response.text();

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(body);
  } catch {
    throw new OnChainError("network");
  }

  return {
    status: typeof data.status === "string" ? data.status : "unknown",
    balance: formatTon(readExactBalance(body)),
    isWallet: data.is_wallet === true,
    isScam: data.is_scam === true,
    interfaces: Array.isArray(data.interfaces) ? (data.interfaces as string[]) : [],
    name: typeof data.name === "string" ? data.name : undefined,
    lastActivity:
      typeof data.last_activity === "number" ? data.last_activity : undefined,
  };
}

/** `wallet_v4r2` -> `Wallet v4R2`, `jetton_master` -> `Jetton master`. */
export function formatInterface(value: string): string {
  const words = value.split("_");
  const head = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  const rest = words
    .slice(1)
    .map((word) => (/^v\d/.test(word) ? word.replace(/r(\d)$/, "R$1") : word));

  return [head, ...rest].join(" ");
}
