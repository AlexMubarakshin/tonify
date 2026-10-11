/**
 * Builds one static QR per donation tier into `public/`.
 *
 * The address and the amounts never change between deploys, so the codes are
 * generated once and committed rather than drawn in the browser — that keeps
 * the QR library out of the bundle of a site that is a static export.
 *
 * Run after editing `src/features/donate/donate.config.json`:
 *   pnpm qr:generate
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import QRCode from "qrcode";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const configPath = join(repoRoot, "src/features/donate/donate.config.json");
const publicDir = join(repoRoot, "public");

const NANO_PER_TON = 1_000_000_000;

const { address, comment, tiers } = JSON.parse(await readFile(configPath, "utf8"));

function transferUrl(ton) {
  const params = new URLSearchParams({
    amount: Math.round(ton * NANO_PER_TON).toString(),
    text: comment,
  });

  return `https://app.tonkeeper.com/transfer/${address}?${params.toString()}`;
}

for (const ton of tiers) {
  const url = transferUrl(ton);

  // Fixed black-on-white: an inverted QR is less reliable to scan, so the code
  // keeps its own light background in dark mode instead of following the theme.
  // margin 4 is the quiet zone the QR spec requires.
  const svg = await QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 4,
    color: { dark: "#000000", light: "#ffffff" },
  });

  const out = join(publicDir, `donate-qr-${ton}.svg`);
  await writeFile(out, svg, "utf8");
  console.log(`donate-qr-${ton}.svg  ${svg.length} bytes  <- ${url}`);
}
