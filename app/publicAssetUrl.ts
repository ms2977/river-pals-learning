// GitHub project sites live below /repository/, unlike a domain-root preview.
export function publicAssetUrl(base: string, path: string): string {
  return `${base.replace(/\/?$/, "/")}${path.replace(/^\/+/, "")}`;
}
