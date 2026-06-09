// POST { token } → publish: merge the draft branch into production (main).
import type { APIRoute } from "astro";
import { verifyGoogle, listAccess } from "@/server/auth.js";
import { mergeBranches, PROD_BRANCH, DRAFT_BRANCH } from "@/server/github.js";
import { json, readBody } from "@/server/http.js";

export const prerender = false;

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
  // Only owners/admins may publish to production.
  if (!access.managerEmails.includes(user.email)) {
    return json({ error: "Зөвхөн эзэн/админ нийтэлнэ" }, 403);
  }

  try {
    const result = await mergeBranches(
      PROD_BRANCH(),
      DRAFT_BRANCH(),
      `Админ: ноорог нийтлэв (${user.email})`,
    );
    if (!result.merged) {
      return json({ ok: true, merged: false, message: "Нийтлэх шинэ өөрчлөлт алга." });
    }
    return json({ ok: true, merged: true, url: result.url });
  } catch (e: any) {
    return json({ error: "Нийтлэхэд алдаа", detail: String(e?.message || e) }, 500);
  }
};
