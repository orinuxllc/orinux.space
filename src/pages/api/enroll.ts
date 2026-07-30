// POST demo-request form (public). Stores the submission on the FORM branch (no
// production rebuild) and optionally emails admins via Resend.
import type { APIRoute } from "astro";
import { appendJsonArray, FORM_BRANCH } from "@/server/github.js";
import { getEnv } from "@/server/env.js";
import { json, readBody } from "@/server/http.js";

export const prerender = false;
const SUBS_PATH = "submissions/demo.json";

const esc = (s: any) =>
  String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
const clip = (s: any, n: number) => String(s ?? "").trim().slice(0, n);

export const POST: APIRoute = async ({ request }) => {
  const body = await readBody(request);
  if (body.website) return json({ ok: true }); // honeypot → silent ok

  const name = clip(body.name, 120);
  const phone = clip(body.phone, 40);
  const email = clip(body.email, 160);
  if (!name || (!phone && !email)) {
    return json({ error: "Нэр болон утас/имэйл шаардлагатай" }, 400);
  }
  const sub = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    at: new Date().toISOString(),
    name,
    company: clip(body.company, 160),
    phone,
    email,
    industry: clip(body.industry, 80),
    message: clip(body.message, 2000),
  };

  let stored = false;
  let mailed = false;

  try {
    await appendJsonArray(SUBS_PATH, sub, `Демо хүсэлт: ${sub.name} (${sub.phone || sub.email})`, FORM_BRANCH());
    stored = true;
  } catch (e) {
    console.error("[enroll] store failed", e);
  }

  const key = getEnv("RESEND_API_KEY");
  const to = (getEnv("DEMO_NOTIFY") || getEnv("ADMIN_EMAILS"))
    .split(",").map((s) => s.trim()).filter(Boolean);
  if (key && to.length) {
    try {
      const html = `<h2>Шинэ демо хүсэлт</h2>
<table cellpadding="6" style="font:14px sans-serif">
<tr><td><b>Нэр</b></td><td>${esc(sub.name)}</td></tr>
<tr><td><b>Байгууллага</b></td><td>${esc(sub.company)}</td></tr>
<tr><td><b>Утас</b></td><td>${esc(sub.phone)}</td></tr>
<tr><td><b>И-мэйл</b></td><td>${esc(sub.email)}</td></tr>
<tr><td><b>Салбар</b></td><td>${esc(sub.industry)}</td></tr>
<tr><td><b>Мэдээлэл</b></td><td>${esc(sub.message)}</td></tr>
</table>
<p style="color:#888;font:12px sans-serif">${sub.at}</p>`;
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: getEnv("DEMO_FROM") || "Orinux Demo <onboarding@resend.dev>",
          to,
          subject: `Демо хүсэлт — ${sub.name}`,
          html,
          ...(sub.email ? { reply_to: sub.email } : {}),
        }),
      });
      mailed = r.ok;
      if (!r.ok) console.error("[enroll] resend", r.status, await r.text());
    } catch (e) {
      console.error("[enroll] mail failed", e);
    }
  }

  // Best-effort: also land this as a lead in the orinux platform's own
  // marketing module, so sales can work it from Contacts like any other
  // lead — not the site's only record of the submission (submissions/demo.json
  // + email above already are), so a failure here must never affect the
  // user-facing response.
  const marketingBase = getEnv("MARKETING_PUBLIC_BASE_URL");
  if (marketingBase) {
    try {
      await fetch(`${marketingBase}/api/v1/public/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sub.name,
          company: sub.company,
          email: sub.email,
          phone: sub.phone,
          industry: sub.industry,
          message: sub.message,
          source: "orinux.space",
        }),
      });
    } catch (e) {
      console.error("[enroll] marketing lead forward failed", e);
    }
  }

  if (!stored && !mailed) {
    return json({ error: "Хүсэлтийг хадгалж/илгээж чадсангүй" }, 500);
  }
  return json({ ok: true, stored, mailed });
};
