import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Inline into client bundles too: `getAssetPath` runs in client components,
  // where a non-NEXT_PUBLIC env var is otherwise `undefined` and asset URLs
  // lose the basePath after client-side navigation (e.g. switching locale).
  env: {
    APP_BASE_PATH: process.env.APP_BASE_PATH ?? "",
  },
  basePath:
    process.env.APP_BASE_PATH && typeof process.env.APP_BASE_PATH === "string"
      ? process.env.APP_BASE_PATH
      : undefined,
};

export default withNextIntl(nextConfig);
