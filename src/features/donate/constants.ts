import config from "./donate.config.json";

/**
 * Author's mainnet wallet, non-bounceable (UQ) so a transfer lands even when
 * the receiving wallet has never been deployed — the bounceable (EQ) form
 * would send the coins straight back in that case.
 *
 * Changing it means regenerating the QR assets: `pnpm qr:generate`.
 */
export const DONATE_ADDRESS = config.address;

/** Attached to every transfer so donations are tellable apart in an explorer. */
export const DONATE_COMMENT = config.comment;

/**
 * Preset amounts, in GRAM. There is deliberately no free-form amount field: a
 * text input is the step most likely to lose someone mid-donation, and a
 * preset lets the amount travel in the link so the wallet opens already filled.
 */
export const DONATE_TIERS: readonly number[] = config.tiers;

/** The middle tier, pre-selected so the desktop QR is never blank. */
export const DEFAULT_DONATE_TIER = config.tiers[Math.floor(config.tiers.length / 2)];

const NANO_PER_TON = 1_000_000_000;

/**
 * Tonkeeper universal link: `https://app.tonkeeper.com/transfer/<address>?amount=<nanotons>&text=<comment>`.
 *
 * The `https` form is used rather than the `ton://` scheme on purpose. A
 * `ton://` link fails silently on a device with no wallet registered for the
 * scheme, leaving the visitor with a dead tap; the universal link is caught by
 * the installed app and otherwise falls back to Tonkeeper's own web page.
 *
 * `amount` is in nanotons — 1 GRAM is 1e9. The on-chain unit is still called
 * a nanoton: the June 2026 rename covered the coin (Toncoin -> Gram), not the
 * protocol or the network, both of which are still TON.
 */
export function donateHref(ton: number) {
  const amount = Math.round(ton * NANO_PER_TON).toString();
  const params = new URLSearchParams({ amount, text: DONATE_COMMENT });

  return `https://app.tonkeeper.com/transfer/${DONATE_ADDRESS}?${params.toString()}`;
}

/**
 * Public path of the pre-generated QR for `ton`. The codes are built once by
 * `scripts/generate-donate-qr.mjs` instead of in the browser: the address and
 * the amounts are fixed, so a runtime QR library would add weight to every
 * page for an image that never changes. Wrap in `getAssetPath` before use.
 */
export function donateQrSrc(ton: number) {
  return `/donate-qr-${ton}.svg`;
}
