export function getAppBasePath() {
  return process.env.APP_BASE_PATH &&
    typeof process.env.APP_BASE_PATH === "string"
    ? process.env.APP_BASE_PATH
    : undefined;
}

export function getAssetPath(src: string) {
  const basePath = getAppBasePath();
  const normalizedSrc = src.replace(/^\//, "");

  return basePath ? `${basePath}/${normalizedSrc}` : src;
}

export function normilizeURL(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function joinURL(...parts: string[]) {
  return normilizeURL(parts.map(normilizeURL).join("/"));
}
