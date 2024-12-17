import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath:
    process.env.APP_BASE_PATH && typeof process.env.APP_BASE_PATH === "string"
      ? process.env.APP_BASE_PATH
      : undefined,
};

export default withNextIntl(nextConfig);
