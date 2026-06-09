// POST { token } → recent change history (commits touching content.json).
import type { APIRoute } from "astro";
import { verifyGoogle, listAccess } from "@/server/auth.js";
import { listCommits, DRAFT_BRANCH, PROD_BRANCH } from "@/server/github.js";
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

  try {
    let commits = await listCommits(CONTENT_PATH, DRAFT_BRANCH(), 30).catch(() => null);
    if (!commits) commits = await listCommits(CONTENT_PATH, PROD_BRANCH(), 30);
    return json({ ok: true, commits });
  } catch (e: any) {
    return json({ error: "Түүх ачааллаж чадсангүй", detail: String(e?.message || e) }, 500);
  }
};
