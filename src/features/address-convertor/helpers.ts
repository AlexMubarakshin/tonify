import { Address } from "ton-core";
import type { AddressResult, AddressResultTableData } from "./types";

export type ParseSummary = {
  results: AddressResult[];
  /** Number of non-empty tokens that failed to parse as a TON address. */
  invalidCount: number;
};

export function parseAndResult(raw: string): ParseSummary {
  // Split by new lines, spaces, tabs, commas, etc.
  const parts = raw.split(/[\s,]+/);

  const results: AddressResult[] = [];
  let invalidCount = 0;

  for (let partIndex = 0; partIndex < parts.length; partIndex++) {
    const token = parts[partIndex].trim();
    if (!token) {
      continue;
    }

    try {
      const parsed = Address.parse(token);
      results.push({
        address: parsed,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      invalidCount++;
    }
  }

  return { results, invalidCount };
}

export function addressResultsToTableData(
  results: AddressResult[]
): AddressResultTableData[] {
  return results.map((result, index) => {
    const address = result.address;

    return {
      key: index,

      toStringBounceable: address?.toString(),
      toStringNonBounceable: address?.toString({ bounceable: false }),
      toRawString: address?.toRawString(),
      normalized: address ? Address.normalize(address) : undefined,
      testnetBounceable: address?.toString({ testOnly: true }),
      testnetNonBounceable: address?.toString({ testOnly: true, bounceable: false }),
    };
  });
}

/** tonviewer.com explorer URL for a user-friendly address. */
export function explorerUrl(friendlyAddress: string | undefined): string | undefined {
  if (!friendlyAddress) return undefined;
  return `https://tonviewer.com/${friendlyAddress}`;
}

/** A well-known example TON address (TON Foundation) for the "load example" action. */
export const EXAMPLE_ADDRESS =
  "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N";
