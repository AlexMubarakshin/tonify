import { Address } from "ton-core";

/** A user-friendly TON address is always exactly 48 base64 characters. */
const FRIENDLY_LENGTH = 48;
const BOUNCEABLE_TAG = 0x11;
const NON_BOUNCEABLE_TAG = 0x51;
const TEST_FLAG = 0x80;

const BASE64_STD =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/** Zero-width and non-breaking characters that survive a copy/paste unnoticed. */
const INVISIBLE_CHARS = /[\u00AD\u200B-\u200F\u2060\uFEFF]/g;

/** Explorer and deep links people paste instead of the bare address. */
const URL_LIKE = /^(?:https?:\/\/|ton(?:keeper)?:\/\/|[a-z0-9-]+(?:\.[a-z0-9-]+)+\/)/i;

const EVM_RE = /^0x[0-9a-fA-F]{40}$/;
const TRON_RE = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
const BITCOIN_RE = /^(?:bc1[02-9ac-hj-np-z]{11,71}|[13][1-9A-HJ-NP-Za-km-z]{25,34})$/;
const SOLANA_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const DNS_RE = /\.(?:ton|t\.me)$/i;

export type IssueCode =
  | "chainEvm"
  | "chainBitcoin"
  | "chainTron"
  | "chainSolana"
  | "dnsName"
  | "friendlyLength"
  | "friendlyCharset"
  | "friendlyChecksum"
  | "friendlyTag"
  | "rawShape"
  | "rawWorkchain"
  | "rawHexLength"
  | "rawHexCharset";

/** Interpolation values handed straight to next-intl for the issue message. */
export type IssueParams = Record<string, string | number>;

export type CheckIssue = {
  code: IssueCode;
  params?: IssueParams;
};

/**
 * A valid address that still deserves a remark — testnet-only, masterchain,
 * bounceable when the user probably wants the deposit form, and so on.
 */
export type NoteCode =
  | "cleaned"
  | "testnet"
  | "masterchain"
  | "bounceable"
  | "nonBounceable"
  | "standardBase64"
  | "rawInput";

export type AddressForms = {
  bounceable: string;
  nonBounceable: string;
  raw: string;
  testnetBounceable: string;
  testnetNonBounceable: string;
};

export type CheckResult =
  | { status: "empty" }
  | { status: "invalid"; cleaned: string; issue: CheckIssue }
  | {
      status: "valid";
      cleaned: string;
      inputFormat: "raw" | "friendly";
      network: "mainnet" | "testnet";
      bounceable: boolean;
      workchain: number;
      accountId: string;
      forms: AddressForms;
      notes: NoteCode[];
      /** Mainnet non-bounceable form — what the on-chain lookup and explorer use. */
      lookup: string;
    };

/**
 * CRC-16/XMODEM over the first 34 bytes of a user-friendly address.
 *
 * `ton-core` exports an equivalent `crc16`, but it is typed for `Buffer`; this
 * one works on the `Uint8Array` we decode ourselves, which is what lets us
 * report "bad checksum" separately from "bad characters".
 */
function crc16Xmodem(data: Uint8Array): [number, number] {
  const poly = 0x1021;
  let reg = 0;

  for (let i = 0; i < data.length + 2; i++) {
    const byte = i < data.length ? data[i] : 0;

    for (let mask = 0x80; mask > 0; mask >>= 1) {
      reg <<= 1;
      if (byte & mask) {
        reg += 1;
      }
      if (reg > 0xffff) {
        reg &= 0xffff;
        reg ^= poly;
      }
    }
  }

  return [Math.floor(reg / 256), reg % 256];
}

/**
 * Strips whitespace and invisible characters, and pulls the address out of an
 * explorer or deep link. URL extraction is gated behind a scheme/host prefix on
 * purpose: standard base64 addresses contain `/`, so splitting on it blindly
 * would mangle them.
 */
export function cleanInput(raw: string): string {
  const compact = raw.replace(INVISIBLE_CHARS, "").replace(/\s+/g, "");

  if (!URL_LIKE.test(compact)) {
    return compact;
  }

  const path = compact.split(/[?#]/)[0];
  const segments = path.split("/").filter(Boolean);

  return segments[segments.length - 1] ?? compact;
}

type DecodeResult =
  | { bytes: Uint8Array }
  | { badChar: string; position: number };

/** Decodes 48 base64 characters into exactly 36 bytes, accepting both alphabets. */
function decodeFriendly(value: string): DecodeResult {
  const bytes = new Uint8Array(36);
  let acc = 0;
  let accBits = 0;
  let out = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    let sextet = BASE64_STD.indexOf(char);

    if (sextet < 0) {
      // URL-safe alphabet: `-` and `_` stand in for `+` and `/`.
      sextet = char === "-" ? 62 : char === "_" ? 63 : -1;
    }

    if (sextet < 0) {
      return { badChar: char, position: i + 1 };
    }

    acc = (acc << 6) | sextet;
    accBits += 6;

    if (accBits >= 8) {
      accBits -= 8;
      bytes[out++] = (acc >> accBits) & 0xff;
    }
  }

  return { bytes };
}

function invalid(cleaned: string, code: IssueCode, params?: IssueParams): CheckResult {
  return { status: "invalid", cleaned, issue: { code, params } };
}

function buildForms(address: Address): AddressForms {
  return {
    bounceable: address.toString(),
    nonBounceable: address.toString({ bounceable: false }),
    raw: address.toRawString(),
    testnetBounceable: address.toString({ testOnly: true }),
    testnetNonBounceable: address.toString({ testOnly: true, bounceable: false }),
  };
}

/** Detects addresses from other chains so the user gets a useful answer, not "invalid". */
function detectForeignChain(value: string): IssueCode | undefined {
  if (EVM_RE.test(value)) return "chainEvm";
  if (TRON_RE.test(value)) return "chainTron";
  if (BITCOIN_RE.test(value)) return "chainBitcoin";
  // Checked last: base58 is broad, and a TON address is 48 chars so it cannot
  // collide with the 32-44 character range.
  if (SOLANA_RE.test(value)) return "chainSolana";

  return undefined;
}

function checkRaw(cleaned: string, notes: NoteCode[]): CheckResult {
  const parts = cleaned.split(":");

  if (parts.length !== 2) {
    return invalid(cleaned, "rawShape");
  }

  const [workchainPart, hashPart] = parts;

  if (!/^-?\d+$/.test(workchainPart)) {
    return invalid(cleaned, "rawWorkchain", { workchain: workchainPart || "—" });
  }

  if (hashPart.length !== 64) {
    return invalid(cleaned, "rawHexLength", { length: hashPart.length });
  }

  const badIndex = hashPart.search(/[^0-9a-fA-F]/);
  if (badIndex >= 0) {
    return invalid(cleaned, "rawHexCharset", {
      char: hashPart[badIndex],
      position: badIndex + 1,
    });
  }

  const address = Address.parse(`${workchainPart}:${hashPart.toLowerCase()}`);
  const forms = buildForms(address);

  if (address.workChain === -1) {
    notes.push("masterchain");
  }
  notes.push("rawInput");

  return {
    status: "valid",
    cleaned,
    inputFormat: "raw",
    network: "mainnet",
    bounceable: true,
    workchain: address.workChain,
    accountId: address.hash.toString("hex"),
    forms,
    notes,
    lookup: forms.nonBounceable,
  };
}

function checkFriendly(cleaned: string, notes: NoteCode[]): CheckResult {
  if (cleaned.length !== FRIENDLY_LENGTH) {
    return invalid(cleaned, "friendlyLength", {
      length: cleaned.length,
      expected: FRIENDLY_LENGTH,
    });
  }

  const decoded = decodeFriendly(cleaned);

  if ("badChar" in decoded) {
    return invalid(cleaned, "friendlyCharset", {
      char: decoded.badChar,
      position: decoded.position,
    });
  }

  const { bytes } = decoded;
  const [crcHigh, crcLow] = crc16Xmodem(bytes.subarray(0, 34));

  if (crcHigh !== bytes[34] || crcLow !== bytes[35]) {
    return invalid(cleaned, "friendlyChecksum");
  }

  let tag = bytes[0];
  const isTestOnly = (tag & TEST_FLAG) !== 0;
  if (isTestOnly) {
    tag ^= TEST_FLAG;
  }

  if (tag !== BOUNCEABLE_TAG && tag !== NON_BOUNCEABLE_TAG) {
    return invalid(cleaned, "friendlyTag", {
      tag: `0x${bytes[0].toString(16).padStart(2, "0")}`,
    });
  }

  const bounceable = tag === BOUNCEABLE_TAG;
  const address = Address.parseFriendly(cleaned).address;
  const forms = buildForms(address);

  if (isTestOnly) {
    notes.push("testnet");
  }
  if (address.workChain === -1) {
    notes.push("masterchain");
  }
  notes.push(bounceable ? "bounceable" : "nonBounceable");
  if (/[+/]/.test(cleaned)) {
    notes.push("standardBase64");
  }

  return {
    status: "valid",
    cleaned,
    inputFormat: "friendly",
    network: isTestOnly ? "testnet" : "mainnet",
    bounceable,
    workchain: address.workChain,
    accountId: address.hash.toString("hex"),
    forms,
    notes,
    lookup: forms.nonBounceable,
  };
}

/**
 * Validates a single TON address entirely in the browser: format, character
 * set, CRC-16 checksum, flag byte and workchain. No network access.
 */
export function checkAddress(raw: string): CheckResult {
  const cleaned = cleanInput(raw);

  if (!cleaned) {
    return { status: "empty" };
  }

  const notes: NoteCode[] = [];
  if (cleaned !== raw.trim()) {
    notes.push("cleaned");
  }

  if (DNS_RE.test(cleaned)) {
    return invalid(cleaned, "dnsName", { name: cleaned });
  }

  const foreignChain = detectForeignChain(cleaned);
  if (foreignChain) {
    return invalid(cleaned, foreignChain);
  }

  if (cleaned.includes(":")) {
    return checkRaw(cleaned, notes);
  }

  return checkFriendly(cleaned, notes);
}

/** tonviewer.com URL for a checked address. */
export function explorerUrl(address: string): string {
  return `https://tonviewer.com/${address}`;
}

/** TON Foundation's wallet — the same account the converter uses as its example. */
export const EXAMPLE_ADDRESS = "UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI";
