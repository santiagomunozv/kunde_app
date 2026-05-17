export function endpoint(path: string, params: Record<string, string | number>) {
  return Object.keys(params).reduce((current, key) => {
    return current.replace(`:${key}`, String(params[key]));
  }, path);
}
