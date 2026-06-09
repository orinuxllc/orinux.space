// POST { token } → admin reads demo-request submissions from the FORM branch.
import type { APIRoute } from "astro";
import { verifyGoogle, listAccess } from "@/server/auth.js";
import { getJson, FORM_BRANCH } from "@/server/github.js";
import { json, readBody } from "@/server/http.js";

export const prerender = false;
const SUBS_PATH = "submissions/demo.json";

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
    const f = await getJson(SUBS_PATH, FORM_BRANCH()).catch(() => null);
    const list = Array.isArray(f?.json) ? f.json : [];
    return json({ ok: true, submissions: list.slice().reverse() }); // newest first
  } catch (e: any) {
    return json({ error: "Уншиж чадсангүй", detail: String(e?.message || e) }, 500);
  }
};
