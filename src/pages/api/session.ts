// POST { token } → verify Google login and report the user's role + access list.
import type { APIRoute } from "astro";
import { verifyGoogle, listAccess, ownerEmails } from "@/server/auth.js";
import { json, readBody } from "@/server/http.js";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { token } = await readBody(request);
  if (!token) return json({ error: "token шаардлагатай" }, 400);

  let user;
  try {
    user = await verifyGoogle(token);
  } catch (e: any) {
    return json({ error: "нэвтрэлт буруу", detail: String(e?.message || e) }, 401);
  }

  let access;
  try {
    access = await listAccess();
  } catch {
    const owners = ownerEmails();
    access = { owners, users: [], allEmails: owners, managerEmails: owners };
  }

  const authorized = access.allEmails.includes(user.email);
  const canManage = access.managerEmails.includes(user.email);
  const isOwner = access.owners.includes(user.email);
  const role = isOwner ? "owner" : canManage ? "admin" : authorized ? "editor" : null;

  return json({
    email: user.email,
    name: user.name,
    picture: user.picture,
    authorized,
    canManage,
    isOwner,
    role,
    owners: canManage ? access.owners : [],
    users: canManage ? access.users : [],
  });
};
