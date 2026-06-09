// POST { token, filename, contentType, base64 } → commit an image to
// public/uploads/ on the DRAFT branch and return its public path. Raster images
// (jpg/png/…) are converted to WebP via sharp at upload time so every file in
// the repo is already optimized. SVG/GIF are kept as-is.
import type { APIRoute } from "astro";
import sharp from "sharp";
import { verifyGoogle, listAccess } from "@/server/auth.js";
import { putBase64, ensureBranch, DRAFT_BRANCH } from "@/server/github.js";
import { json, readBody } from "@/server/http.js";

export const prerender = false;

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB (input)
const WEBP_MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;
const PASSTHROUGH = new Set(["svg+xml", "gif"]);

export const POST: APIRoute = async ({ request }) => {
  const { token, filename, contentType, base64 } = await readBody(request);
  if (!token || !base64) return json({ error: "token + base64 шаардлагатай" }, 400);

  let user, access;
  try {
    user = await verifyGoogle(token);
    access = await listAccess();
  } catch (e: any) {
    return json({ error: "нэвтрэлт буруу", detail: String(e?.message || e) }, 401);
  }
  if (!access.allEmails.includes(user.email)) {
    return json({ error: "Танд хандах эрх алга" }, 403);
  }

  if (!/^image\//.test(contentType || "")) {
    return json({ error: "Зөвхөн зураг файл оруулна" }, 400);
  }
  const bytes = Math.ceil((base64.length * 3) / 4);
  if (bytes > MAX_BYTES) {
    return json({ error: "Зураг хэт том (5MB-ээс бага байх ёстой)" }, 413);
  }

  const subtype = (contentType.split("/")[1] || "").toLowerCase();
  const stem =
    (filename || "image").toLowerCase().replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "image";

  let finalBase64 = base64;
  let finalExt;

  if (PASSTHROUGH.has(subtype)) {
    finalExt = subtype === "svg+xml" ? "svg" : subtype;
  } else {
    try {
      const input = Buffer.from(base64, "base64");
      const out = await sharp(input)
        .rotate()
        .resize({ width: WEBP_MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      finalBase64 = out.toString("base64");
      finalExt = "webp";
    } catch (e: any) {
      return json({ error: "Зургийг боловсруулж чадсангүй", detail: String(e?.message || e) }, 400);
    }
  }

  const name = `${Date.now().toString(36)}-${stem}.${finalExt}`;
  const path = `public/uploads/${name}`;

  try {
    await ensureBranch(DRAFT_BRANCH());
    const r = await putBase64(
      path, finalBase64, `Админ: зураг нэмэв ${name} (${user.email})`, DRAFT_BRANCH(),
    );
    return json({ ok: true, path: `/uploads/${name}`, commit: r.commit?.html_url });
  } catch (e: any) {
    return json({ error: "Зураг хадгалж чадсангүй", detail: String(e?.message || e) }, 500);
  }
};
