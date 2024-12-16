import { Address } from "ton-core";
import type { AddressResult, AddressResultTableData } from "./types";

export function parseAndResult(raw: string) {
  // Split by new lines, spaces, tabs, commas, etc.
  const parts = raw.split(/[\s,]+/);

  const results: AddressResult[] = [];

  for (let partIndex = 0; partIndex < parts.length; partIndex++) {
    const raw = parts[partIndex].trim();
    if (!raw) {
      continue;
    }

    try {
      const parsed = Address.parse(raw);
      results.push({
        address: parsed,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // console.error(_e);
    }
  }

  return results;
}

export function addressResultsToTableData(
  results: AddressResult[]
): AddressResultTableData[] {
  return results.map((result, index) => {
    return {
      key: index,

      toStringBounceable: result.address?.toString(),
      toStringNonBounceable: result.address?.toString({ bounceable: false }),
      toRawString: result.address?.toRawString(),
      normalized: result.address
        ? Address.normalize(result.address)
        : undefined,
    };
  });
}
