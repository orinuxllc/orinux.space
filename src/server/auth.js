// Google ID-token verification + role-based access.
//   • Owners  — from the ADMIN_EMAILS env var. Always allowed, can't be removed.
//   • Admins  — in admins.json (role:'admin'). Edit content + manage users.
//   • Editors — in admins.json (role:'editor'). Edit content only.
import { OAuth2Client } from "google-auth-library";
import { getJson } from "./github.js";
import { getEnv } from "./env.js";

const client = new OAuth2Client();

export const ADMINS_PATH = "admins.json";

export async function verifyGoogle(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: getEnv("GOOGLE_CLIENT_ID"),
  });
  const p = ticket.getPayload();
  if (!p?.email || !p.email_verified) throw new Error("и-мэйл баталгаажаагүй");
  return { email: p.email.toLowerCase(), name: p.name, picture: p.picture };
}

export function ownerEmails() {
  return getEnv("ADMIN_EMAILS")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// Resolve the full access list (owners from env + users from admins.json).
export async function listAccess() {
  const owners = ownerEmails();
  let users = [];
  try {
    const file = await getJson(ADMINS_PATH);
    const j = file?.json;
    if (Array.isArray(j?.users)) {
      users = j.users.map((u) => ({
        email: String(u.email || "").trim().toLowerCase(),
        role: u.role === "admin" ? "admin" : "editor",
      }));
    } else if (Array.isArray(j?.emails)) {
      users = j.emails.map((e) => ({ email: String(e).trim().toLowerCase(), role: "admin" }));
    }
  } catch {
    // admins.json missing or GitHub not configured — owners only.
  }
  users = users.filter((u) => u.email && !owners.includes(u.email));
  const allEmails = [...new Set([...owners, ...users.map((u) => u.email)])];
  const managerEmails = [
    ...new Set([...owners, ...users.filter((u) => u.role === "admin").map((u) => u.email)]),
  ];
  return { owners, users, allEmails, managerEmails };
}
