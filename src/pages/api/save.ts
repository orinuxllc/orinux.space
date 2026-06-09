// POST { token, content?, users? } → verify + authorize, then commit to GitHub.
//   • content → src/content/content.json on the DRAFT branch (any editor)
//   • users   → admins.json at repo root (owners/admins only)
import type { APIRoute } from "astro";
import { verifyGoogle, listAccess, ADMINS_PATH } from "@/server/auth.js";
import { putFile, ensureBranch, DRAFT_BRANCH } from "@/server/github.js";
import { json, readBody } from "@/server/http.js";

export const prerender = false;
const CONTENT_PATH = "src/content/content.json";

export const POST: APIRoute = async ({ request }) => {
  const { token, content, users } = await readBody(request);
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
    const commits: any[] = [];

    if (content) {
      if (typeof content !== "object" || !content.i18n || !Array.isArray(content.modules)) {
        return json({ error: "Агуулгын бүтэц буруу (i18n + modules байх ёстой)" }, 400);
      }
      await ensureBranch(DRAFT_BRANCH());
      const r = await putFile(
        CONTENT_PATH,
        JSON.stringify(content, null, 2) + "\n",
        `Админ: ноорог агуулга (${user.email})`,
        DRAFT_BRANCH(),
      );
      commits.push({ what: "content", url: r.commit?.html_url });
    }

    if (users) {
      if (!access.managerEmails.includes(user.email)) {
        return json({ error: "Зөвхөн эзэн/админ хандалтыг өөрчилнө" }, 403);
      }
      const owners = access.owners;
      const clean = (Array.isArray(users) ? users : [])
        .map((u: any) => ({
          email: String(u?.email || "").trim().toLowerCase(),
          role: u?.role === "admin" ? "admin" : "editor",
        }))
        .filter((u: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email) && !owners.includes(u.email));
      const seen = new Set();
      const list = clean.filter((u: any) => (seen.has(u.email) ? false : seen.add(u.email)));
      const r = await putFile(
        ADMINS_PATH,
        JSON.stringify({ users: list }, null, 2) + "\n",
        `Админ: хандалт шинэчлэв (${user.email})`,
      );
      commits.push({ what: "users", url: r.commit?.html_url });
    }

    return json({ ok: true, commits });
  } catch (e: any) {
    return json({ error: "Хадгалж чадсангүй", detail: String(e?.message || e) }, 500);
  }
};
