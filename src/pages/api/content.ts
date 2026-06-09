// POST { token } → current shared DRAFT content for the editor (collaborative).
// Falls back to production when no draft exists. `unpublished` reports whether
// the draft differs from what's live on production.
import type { APIRoute } from "astro";
import { verifyGoogle, listAccess } from "@/server/auth.js";
import { getJson, PROD_BRANCH, DRAFT_BRANCH } from "@/server/github.js";
import { getEnv } from "@/server/env.js";
import { json, readBody } from "@/server/http.js";

export const prerender = false;
const CONTENT_PATH = "src/content/content.json";

export const POST: APIRoute = async ({ request }) => {
  const { token } = await readBody(request);
  if (!token) return json({ error: "token шаардлагатай" }, 400);

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

  // Distinguish "GitHub not configured" from "content.json missing" so the
  // admin shows a precise reason instead of a bare "no content".
  if (!getEnv("GITHUB_REPO") || !getEnv("GITHUB_TOKEN")) {
    return json(
      { error: "GITHUB_REPO / GITHUB_TOKEN тохируулагдаагүй байна. Vercel env дээр нэмээд Redeploy хийнэ үү." },
      500,
    );
  }

  try {
    const [draft, prod] = await Promise.all([
      getJson(CONTENT_PATH, DRAFT_BRANCH()).catch(() => null),
      getJson(CONTENT_PATH, PROD_BRANCH()).catch(() => null),
    ]);
    const content = draft?.json || prod?.json || null;
    const unpublished = !!(
      draft?.json && prod?.json && JSON.stringify(draft.json) !== JSON.stringify(prod.json)
    );
    return json({ ok: true, content, unpublished });
  } catch (e: any) {
    return json({ error: "Агуулга уншиж чадсангүй", detail: String(e?.message || e) }, 500);
  }
};
