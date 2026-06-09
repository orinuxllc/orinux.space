// Env accessor that works both on Vercel (process.env) and in `astro dev`
// (Vite loads .env into import.meta.env, not process.env).
export function getEnv(key, fallback = "") {
  let v;
  try {
    if (typeof process !== "undefined" && process.env) v = process.env[key];
  } catch {}
  if (v == null || v === "") {
    try {
      v = import.meta.env?.[key];
    } catch {}
  }
  return v == null || v === "" ? fallback : v;
}
