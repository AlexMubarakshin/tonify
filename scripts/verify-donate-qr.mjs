/**
 * Decodes the generated donation QR codes and checks each one against the URL
 * it is supposed to carry.
 *
 * These codes move money: a wrong one sends a donation to the wrong address or
 * silently does nothing, and nobody would find out. So the output of the
 * generator is read back with a different library than the one that wrote it,
 * rather than trusted.
 *
 * Runs automatically as part of `pnpm qr:generate`.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import jsQR from "jsqr";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");

const NANO_PER_TON = 1_000_000_000;

const { address, comment, tiers } = JSON.parse(
  await readFile(join(repoRoot, "src/features/donate/donate.config.json"), "utf8")
);

/**
 * Rebuilds the module grid from the SVG's own path data, so no rasterizer is
 * needed. `qrcode` writes one stroke path per image, as runs of dark modules:
 * "M4 4.5h7m1 0h2" is a run of 7 on row 4, a gap of 1, then a run of 2.
 */
function matrixFromSvg(svg) {
  const size = Number(svg.match(/viewBox="0 0 (\d+) /)[1]);
  const grid = Array.from({ length: size }, () => new Uint8Array(size));
  const path = svg.match(/stroke="#000000" d="([^"]+)"/)[1];

  let x = 0;
  let y = 0;

  for (const [, cmd, a, b] of path.matchAll(/([MmhH])\s*(-?[\d.]+)(?:[ ,]+(-?[\d.]+))?/g)) {
    if (cmd === "M") {
      x = Number(a);
      y = Number(b);
    } else if (cmd === "m") {
      x += Number(a);
      y += Number(b);
    } else {
      const len = cmd === "h" ? Number(a) : Number(a) - x;
      for (let i = 0; i < len; i++) grid[Math.floor(y)][Math.floor(x) + i] = 1;
      x += len;
    }
  }

  return { grid, size };
}

function toRgba({ grid, size }, scale = 4) {
  const width = size * scale;
  const data = new Uint8ClampedArray(width * width * 4);

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < width; x++) {
      const value = grid[(y / scale) | 0][(x / scale) | 0] ? 0 : 255;
      const i = (y * width + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = value;
      data[i + 3] = 255;
    }
  }

  return { data, width };
}

let failures = 0;

for (const ton of tiers) {
  const svg = await readFile(join(repoRoot, `public/donate-qr-${ton}.svg`), "utf8");
  const { data, width } = toRgba(matrixFromSvg(svg));
  const decoded = jsQR(data, width, width);

  const expected = `https://app.tonkeeper.com/transfer/${address}?amount=${ton * NANO_PER_TON}&text=${comment}`;
  const ok = decoded?.data === expected;

  if (!ok) {
    failures++;
    console.error(`FAIL donate-qr-${ton}.svg`);
    console.error(`     decoded:  ${decoded ? decoded.data : "<no QR found>"}`);
    console.error(`     expected: ${expected}`);
  } else {
    console.log(`ok   donate-qr-${ton}.svg -> ${expected}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} QR code(s) do not carry the expected transfer URL.`);
  process.exit(1);
}

console.log(`\nAll ${tiers.length} QR codes decode to the expected transfer URL.`);
