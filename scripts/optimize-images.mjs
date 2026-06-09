// Build-time image optimization.
//
// After the Astro build, every raster image in the build output gets a sibling
// .webp generated next to it — resized to a sane max width and re-encoded with
// WebP (~25-40% smaller than JPEG/PNG). Originals are kept as fallbacks. We only
// touch build output, never committed source, so the repo never fills with
// generated images. (Admin uploads are already WebP — see api/upload.)
import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Astro writes to dist/; the Vercel adapter mirrors static assets under
// .vercel/output/static. Scan whichever exist.
const ROOTS = ["dist", ".vercel/output/static"]
  .map((d) => path.resolve(process.cwd(), d))
  .filter((d) => existsSync(d));

const MAX_WIDTH = 1920;
const QUALITY = 80;
const RASTER = /\.(jpe?g|png)$/i; // SVG/GIF intentionally skipped

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (RASTER.test(e.name)) out.push(full);
  }
  return out;
}

async function convert(src) {
  const dest = src.replace(RASTER, ".webp");
  if (existsSync(dest)) {
    const [a, b] = await Promise.all([stat(src), stat(dest)]);
    if (b.mtimeMs >= a.mtimeMs) return null;
  }
  const before = (await stat(src)).size;
  await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(dest);
  const after = (await stat(dest)).size;
  return { rel: src, before, after };
}

async function main() {
  if (!ROOTS.length) {
    console.warn("[img] no build output found — run after `astro build`. Skipping.");
    return;
  }
  const files = (await Promise.all(ROOTS.map(walk))).flat();
  if (!files.length) {
    console.log("[img] no raster images to optimize.");
    return;
  }
  let count = 0, totalBefore = 0, totalAfter = 0;
  for (const src of files) {
    try {
      const r = await convert(src);
      if (!r) continue;
      count++;
      totalBefore += r.before;
      totalAfter += r.after;
      const pct = Math.round((1 - r.after / r.before) * 100);
      console.log(`[img] ${path.basename(r.rel)}: ${kb(r.before)} → ${kb(r.after)} (-${pct}%)`);
    } catch (e) {
      console.warn(`[img] ⚠ could not convert ${path.basename(src)}: ${e.message}`);
    }
  }
  if (count) {
    const pct = Math.round((1 - totalAfter / totalBefore) * 100);
    console.log(`[img] ✓ ${count} image(s) → webp · ${kb(totalBefore)} → ${kb(totalAfter)} (-${pct}% total)`);
  } else {
    console.log("[img] all images already optimized.");
  }
}

main().catch((e) => {
  console.error("[img] failed:", e);
  process.exit(0); // best-effort; never block a deploy
});
