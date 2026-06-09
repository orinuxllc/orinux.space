// Minimal GitHub Contents API client (server-side only — uses GITHUB_TOKEN).
// Staging workflow: edits/uploads commit to the draft branch, then "publish"
// merges the draft branch into the production (main) branch.
import { getEnv } from "./env.js";

const API = "https://api.github.com";

function cfg() {
  const repo = getEnv("GITHUB_REPO"); // "owner/name"
  const token = getEnv("GITHUB_TOKEN");
  if (!repo || !token) {
    throw new Error("GITHUB_REPO / GITHUB_TOKEN тохируулагдаагүй байна.");
  }
  return { repo, token };
}

export const PROD_BRANCH = () => getEnv("GITHUB_BRANCH", "main");
export const DRAFT_BRANCH = () => getEnv("GITHUB_DRAFT_BRANCH", "cms-draft");
// Form submissions live on their own branch so they never trigger a production
// rebuild (disable its deploys in vercel.json git.deploymentEnabled).
export const FORM_BRANCH = () => getEnv("GITHUB_FORM_BRANCH", "form");

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "orinux-admin",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// Encode each path segment but keep "/" as real separators.
const enc = (p) => p.split("/").map(encodeURIComponent).join("/");

async function refSha(branch) {
  const { repo, token } = cfg();
  const res = await fetch(`${API}/repos/${repo}/git/ref/heads/${enc(branch)}`, {
    headers: headers(token),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ref ${branch}: ${res.status}`);
  return (await res.json()).object.sha;
}

// Create `branch` from the production branch if it doesn't exist yet.
export async function ensureBranch(branch) {
  const { repo, token } = cfg();
  if (await refSha(branch)) return;
  const baseSha = await refSha(PROD_BRANCH());
  if (!baseSha) {
    const chk = await fetch(`${API}/repos/${repo}`, { headers: headers(token) });
    if (chk.status === 404) {
      throw new Error(
        `"${repo}" repo олдсонгүй эсвэл token-д энэ repo-ийн эрх алга. ` +
          `GITHUB_REPO зөв эсэх + token-ы Repository access дотор энэ repo + Contents: Read and write эрхтэй эсэхийг шалгана уу.`,
      );
    }
    if (chk.status === 403) {
      throw new Error(`Token-д "${repo}" repo дээр эрх хүрэлцэхгүй (403). Contents: Read and write эрх олгоно уу.`);
    }
    let def = "";
    try { def = (await chk.json()).default_branch; } catch {}
    throw new Error(
      `"${PROD_BRANCH()}" branch олдсонгүй. Энэ repo-ийн үндсэн branch нь "${def || "?"}" байна — ` +
        `GITHUB_BRANCH-ийг түүнтэй тааруулна уу.`,
    );
  }
  const res = await fetch(`${API}/repos/${repo}/git/refs`, {
    method: "POST",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
  });
  if (!res.ok) {
    throw new Error(`Branch үүсгэж чадсангүй ${branch}: ${res.status} ${await res.text()}`);
  }
}

export async function getFile(path, branch = PROD_BRANCH()) {
  const { repo, token } = cfg();
  const res = await fetch(
    `${API}/repos/${repo}/contents/${enc(path)}?ref=${enc(branch)}`,
    { headers: headers(token) },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path}: ${res.status}`);
  const data = await res.json();
  return {
    content: Buffer.from(data.content, "base64").toString("utf8"),
    sha: data.sha,
  };
}

export async function getJson(path, branch) {
  const f = await getFile(path, branch);
  return f ? { json: JSON.parse(f.content), sha: f.sha } : null;
}

export async function putFile(path, contentStr, message, branch = PROD_BRANCH()) {
  return putRaw(path, Buffer.from(contentStr).toString("base64"), message, branch);
}

// Commit raw bytes given as a base64 string (for binary files like images).
export async function putBase64(path, base64, message, branch = PROD_BRANCH()) {
  return putRaw(path, base64, message, branch);
}

async function putRaw(path, base64, message, branch) {
  const { repo, token } = cfg();
  const existing = await getFile(path, branch).catch(() => null);
  const res = await fetch(`${API}/repos/${repo}/contents/${enc(path)}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: base64,
      branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub PUT ${path}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// Recent commits touching `path` on `branch`, with the editor email parsed out
// of the commit message ("… (editor@email)").
export async function listCommits(path, branch = PROD_BRANCH(), perPage = 30) {
  const { repo, token } = cfg();
  const res = await fetch(
    `${API}/repos/${repo}/commits?path=${encodeURIComponent(path)}&sha=${enc(branch)}&per_page=${perPage}`,
    { headers: headers(token) },
  );
  if (res.status === 404 || res.status === 409) throw new Error(`branch ${branch} unavailable`);
  if (!res.ok) throw new Error(`GitHub commits: ${res.status}`);
  const data = await res.json();
  return data.map((c) => {
    const message = (c.commit?.message || "").split("\n")[0];
    const m = message.match(/\(([^()\s]+@[^()\s]+)\)/);
    return {
      sha: c.sha?.slice(0, 7),
      message,
      email: m ? m[1] : c.commit?.author?.email || "",
      date: c.commit?.author?.date || c.commit?.committer?.date || "",
      url: c.html_url,
    };
  });
}

// Append an item to a JSON-array file on a branch (get → push → put), with one
// retry on a 409 sha conflict. Creates the file/branch if missing.
export async function appendJsonArray(path, item, message, branch) {
  await ensureBranch(branch);
  for (let attempt = 0; attempt < 2; attempt++) {
    const existing = await getJson(path, branch).catch(() => null);
    const arr = Array.isArray(existing?.json) ? existing.json : [];
    arr.push(item);
    try {
      return await putFile(path, JSON.stringify(arr, null, 2) + "\n", message, branch);
    } catch (e) {
      if (attempt === 0 && /:\s*409/.test(String(e.message || e))) continue;
      throw e;
    }
  }
}

// Merge `head` into `base` (e.g. draft → main). Returns merge info.
export async function mergeBranches(base, head, message) {
  const { repo, token } = cfg();
  const res = await fetch(`${API}/repos/${repo}/merges`, {
    method: "POST",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ base, head, commit_message: message }),
  });
  if (res.status === 204) return { merged: false, reason: "up-to-date" };
  if (res.status === 409) {
    throw new Error("Merge conflict — GitHub дээр гараар шийдэх шаардлагатай.");
  }
  if (!res.ok) throw new Error(`GitHub merge: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return { merged: true, url: data.html_url };
}
