import type { NextConfig } from "next";

declare const process: {
  env: {
    APP_BASE_PATH: string | undefined;
  };
};

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath:
    process.env.APP_BASE_PATH && typeof process.env.APP_BASE_PATH === "string"
      ? process.env.APP_BASE_PATH
      : undefined,
};

export default nextConfig;
