<script>
  import { onMount } from "svelte";

  let { clientId = "" } = $props();

  // ---- auth + session ----
  let token = $state("");
  let user = $state(null);          // { email, name, picture, role, canManage, isOwner }
  let authError = $state("");
  let btnEl;

  // ---- content state ----
  let content = $state(null);
  let unpublished = $state(false);
  let loading = $state(false);
  let loadError = $state("");

  // ---- ui state ----
  let view = $state("text");
  let filter = $state("");
  let openGroups = $state({});
  let toast = $state(null);         // { kind: 'ok'|'bad', text }
  let busy = $state("");            // label of in-flight action

  // ---- side panels data ----
  let submissions = $state(null);
  let commits = $state(null);
  let accessUsers = $state([]);
  let owners = $state([]);

  const GROUP_LABELS = {
    nav: "Цэс", hero: "Hero", cta: "CTA товч", stat: "Статистик", scroll: "Scroll",
    trust: "Итгэл", cmp: "Харьцуулалт", feat: "Онцлог гарчиг", mod: "Модуль гарчиг",
    plat: "Платформ", dn: "Dashboard цэс", dash: "Dashboard", kpi: "KPI", chart: "График",
    leg: "Тайлбар", feed: "Feed", wf: "Workflow", pf: "Платформ онцлог", res: "Үр дүн",
    quote: "Ишлэл", how: "Хэрхэн", svc: "Үйлчилгээ гарчиг", stage: "Салбар stage",
    ind: "Салбар", price: "Үнэ гарчиг", per: "Үнэ нэгж", pr1: "Багц 1", pr2: "Багц 2",
    pr3: "Багц 3", demo: "Демо", dp1: "Демо цэг 1", dp2: "Демо цэг 2", dp3: "Демо цэг 3",
    f: "Форм", ok: "Амжилт", faq: "Асуулт", final: "Эцсийн CTA",
  };

  // ---------- Google Identity ----------
  function onCredential(resp) {
    token = resp.credential;
    loadSession();
  }
  onMount(() => {
    if (!clientId) { authError = "PUBLIC_GOOGLE_CLIENT_ID тохируулаагүй байна."; return; }
    let tries = 0;
    const init = () => {
      if (!window.google?.accounts?.id) {
        if (tries++ > 40) { authError = "Google Sign-In ачаалж чадсангүй."; return; }
        return setTimeout(init, 200);
      }
      window.google.accounts.id.initialize({ client_id: clientId, callback: onCredential });
      if (btnEl) window.google.accounts.id.renderButton(btnEl, { theme: "filled_blue", size: "large", text: "signin_with", shape: "pill" });
    };
    init();
  });

  function signOut() {
    token = ""; user = null; content = null;
    try { window.google?.accounts?.id?.disableAutoSelect(); } catch {}
  }

  // ---------- API ----------
  async function api(path, body) {
    const r = await fetch(`/api/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...body }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || data.detail || `HTTP ${r.status}`);
    return data;
  }
  function flash(text, kind = "ok") { toast = { kind, text }; setTimeout(() => (toast = null), 3500); }

  async function loadSession() {
    authError = "";
    try {
      const s = await api("session");
      if (!s.authorized) { authError = `${s.email}: танд хандах эрх алга.`; token = ""; return; }
      user = s;
      accessUsers = s.users || [];
      owners = s.owners || [];
      await loadContent();
    } catch (e) {
      authError = String(e.message || e);
    }
  }

  async function loadContent() {
    loading = true;
    loadError = "";
    try {
      const r = await api("content");
      content = r.content;
      unpublished = !!r.unpublished;
      if (!content) loadError = "GitHub дээр src/content/content.json олдсонгүй. GITHUB_REPO зөв эсэх + main branch дээр тэр файл байгаа эсэхийг шалгана уу.";
    } catch (e) {
      loadError = String(e.message || e);
      flash(loadError, "bad");
    } finally {
      loading = false;
    }
  }

  async function save() {
    busy = "save";
    try {
      await api("save", { content });
      unpublished = true;
      flash("Ноорогт хадгаллаа ✓");
    } catch (e) { flash(e.message, "bad"); }
    finally { busy = ""; }
  }

  async function publish() {
    if (!confirm("Ноорог өөрчлөлтийг production-д нийтлэх үү?")) return;
    busy = "publish";
    try {
      const r = await api("publish");
      unpublished = false;
      flash(r.merged ? "Нийтэллээ ✓ (Vercel rebuild эхэллээ)" : (r.message || "Шинэ өөрчлөлт алга."));
    } catch (e) { flash(e.message, "bad"); }
    finally { busy = ""; }
  }

  async function openSubmissions() {
    view = "submissions"; submissions = null;
    try { submissions = (await api("submissions")).submissions; }
    catch (e) { flash(e.message, "bad"); }
  }
  async function openHistory() {
    view = "history"; commits = null;
    try { commits = (await api("history")).commits; }
    catch (e) { flash(e.message, "bad"); }
  }
  async function saveAccess() {
    busy = "access";
    try { await api("save", { users: accessUsers }); flash("Хандалт хадгаллаа ✓"); }
    catch (e) { flash(e.message, "bad"); }
    finally { busy = ""; }
  }

  // ---------- image upload ----------
  let uploadingFor = $state("");
  let lastUpload = $state("");
  async function uploadImage(file, cb) {
    if (!file) return;
    uploadingFor = "x";
    try {
      const base64 = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(String(fr.result).split(",")[1]);
        fr.onerror = rej;
        fr.readAsDataURL(file);
      });
      const r = await api("upload", { filename: file.name, contentType: file.type, base64 });
      lastUpload = r.path;
      flash("Зураг орууллаа ✓ " + r.path);
      cb?.(r.path);
    } catch (e) { flash(e.message, "bad"); }
    finally { uploadingFor = ""; }
  }

  // ---------- list helpers ----------
  function move(arr, i, d) {
    const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  function removeAt(arr, i) { arr.splice(i, 1); }

  // ---------- derived: grouped i18n ----------
  let groups = $derived.by(() => {
    const g = {};
    if (!content?.i18n) return g;
    const f = filter.trim().toLowerCase();
    for (const k of Object.keys(content.i18n)) {
      const v = content.i18n[k];
      if (f && !k.toLowerCase().includes(f) && !(v[0] || "").toLowerCase().includes(f) && !(v[1] || "").toLowerCase().includes(f)) continue;
      const prefix = k.split("_")[0];
      (g[prefix] ||= []).push(k);
    }
    return g;
  });

  const SECTIONS = [
    { id: "text", label: "Текст (МН/EN)" },
    { id: "modules", label: "Модулиуд" },
    { id: "pricing", label: "Үнэ" },
    { id: "features", label: "Онцлог" },
    { id: "services", label: "Үйлчилгээ" },
    { id: "industries", label: "Салбарууд" },
    { id: "faq", label: "Асуулт хариулт" },
    { id: "trust", label: "Лого" },
    { id: "meta", label: "Холбоо / SEO" },
    { id: "preview", label: "Урьдчилж үзэх" },
    { id: "submissions", label: "Демо хүсэлт" },
    { id: "history", label: "Түүх" },
  ];
</script>

<svelte:head><title>Orinux — Админ</title></svelte:head>

{#if !user}
  <!-- ===== sign-in ===== -->
  <div class="gate">
    <div class="gate-card">
      <div class="brand"><span class="mark">O</span> orinux <span class="tag">админ</span></div>
      <p>Контент удирдахын тулд Google-ээр нэвтэрнэ үү.</p>
      <div bind:this={btnEl}></div>
      {#if authError}<div class="err">{authError}</div>{/if}
    </div>
  </div>
{:else if !content}
  <div class="gate">
    <div class="gate-card">
      {#if loading}
        <p>Ачааллаж байна…</p>
      {:else}
        <div class="brand sm"><span class="mark">O</span> orinux</div>
        <p>Контент уншиж чадсангүй.</p>
        {#if loadError}<div class="err">{loadError}</div>{/if}
        <p class="cfg">Шалгах зүйл: <b>GITHUB_TOKEN</b> (Contents: Read and write), <b>GITHUB_REPO</b> зөв эсэх, env нэмсний дараа Vercel дээр <b>Redeploy</b> хийсэн эсэх.</p>
        <button class="btn" onclick={loadContent}>↻ Дахин оролдох</button>
      {/if}
    </div>
  </div>
{:else}
  <!-- ===== app ===== -->
  <header class="top">
    <div class="brand sm"><span class="mark">O</span> orinux <span class="tag">админ</span></div>
    <div class="spacer"></div>
    {#if unpublished}<span class="pill warn">● Нийтлээгүй өөрчлөлт</span>{/if}
    <button class="btn" disabled={busy==="save"} onclick={save}>{busy==="save" ? "…" : "Хадгалах"}</button>
    {#if user.canManage}
      <button class="btn primary" disabled={busy==="publish"} onclick={publish}>{busy==="publish" ? "…" : "Нийтлэх"}</button>
    {/if}
    <a class="btn ghost" href="/preview?preview=1" target="_blank" rel="noopener">Сайт ↗</a>
    <div class="me">
      {#if user.picture}<img src={user.picture} alt="" />{/if}
      <div class="me-i"><b>{user.name || user.email}</b><span>{user.role}</span></div>
      <button class="link" onclick={signOut}>гарах</button>
    </div>
  </header>

  <div class="layout">
    <nav class="side">
      {#each SECTIONS as s}
        <button class:active={view===s.id} onclick={() => { view = s.id; if (s.id==="submissions") openSubmissions(); if (s.id==="history") openHistory(); }}>{s.label}</button>
      {/each}
      {#if user.canManage}
        <button class:active={view==="access"} onclick={() => view="access"}>Хандалт</button>
      {/if}
    </nav>

    <main class="main">
      {#if view === "text"}
        <div class="head"><h2>Текст агуулга</h2><input class="search" placeholder="Хайх…" bind:value={filter} /></div>
        <p class="hint">Бүх товч/гарчиг/тайлбар. Эхний нүд = Монгол, хоёр дахь = English.</p>
        {#each Object.keys(groups) as prefix}
          <div class="grp">
            <button class="grp-h" onclick={() => openGroups[prefix] = !openGroups[prefix]}>
              <span>{GROUP_LABELS[prefix] || prefix}</span>
              <span class="grp-n">{groups[prefix].length}</span>
            </button>
            {#if openGroups[prefix] || filter.trim()}
              <div class="grp-b">
                {#each groups[prefix] as key}
                  <div class="kv">
                    <code>{key}</code>
                    <textarea rows="1" bind:value={content.i18n[key][0]}></textarea>
                    <textarea rows="1" bind:value={content.i18n[key][1]}></textarea>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}

      {:else if view === "modules"}
        <div class="head"><h2>Модулиуд ({content.modules.length})</h2>
          <button class="btn" onclick={() => content.modules.push({ code:"NN", cat:"biz", name:"Шинэ модуль", nameEn:"New module", desc:"", descEn:"" })}>+ Нэмэх</button></div>
        {#each content.modules as m, i}
          <div class="card">
            <div class="row">
              <input class="w-code" placeholder="Код" bind:value={m.code} />
              <select bind:value={m.cat}><option value="biz">Бизнес</option><option value="ind">Салбар</option></select>
              <div class="rowsp"></div>
              <button class="ic" onclick={() => move(content.modules, i, -1)}>↑</button>
              <button class="ic" onclick={() => move(content.modules, i, 1)}>↓</button>
              <button class="ic bad" onclick={() => removeAt(content.modules, i)}>✕</button>
            </div>
            <div class="row2">
              <input placeholder="Нэр (МН)" bind:value={m.name} />
              <input placeholder="Name (EN)" bind:value={m.nameEn} />
            </div>
            <div class="row2">
              <input placeholder="Тайлбар (МН)" bind:value={m.desc} />
              <input placeholder="Desc (EN)" bind:value={m.descEn} />
            </div>
          </div>
        {/each}

      {:else if view === "pricing"}
        <div class="head"><h2>Үнийн багц</h2>
          <button class="btn" onclick={() => content.pricing.push({ name:"Шинэ", nameEn:"New", desc:"", descEn:"", price:"₮0", custom:false, note:"", noteEn:"", featured:false, cta:"price_try", features:[], featuresEn:[] })}>+ Нэмэх</button></div>
        {#each content.pricing as p, i}
          <div class="card">
            <div class="row">
              <input placeholder="Нэр (МН)" bind:value={p.name} />
              <input placeholder="Name (EN)" bind:value={p.nameEn} />
              <label class="chk"><input type="checkbox" bind:checked={p.featured} /> Онцлох</label>
              <label class="chk"><input type="checkbox" bind:checked={p.custom} /> Тусгай үнэ</label>
              <button class="ic bad" onclick={() => removeAt(content.pricing, i)}>✕</button>
            </div>
            <div class="row2"><input placeholder="Тайлбар (МН)" bind:value={p.desc} /><input placeholder="Desc (EN)" bind:value={p.descEn} /></div>
            <div class="row2"><input placeholder="Үнэ (₮599k)" bind:value={p.price} disabled={p.custom} /><input placeholder="CTA түлхүүр (price_try/price_try2/price_contact)" bind:value={p.cta} /></div>
            <div class="row2"><input placeholder="Тэмдэглэл (МН)" bind:value={p.note} /><input placeholder="Note (EN)" bind:value={p.noteEn} /></div>
            <div class="sub-list">
              <div class="sub-h">Боломжууд <button class="ic" onclick={() => { p.features.push(""); p.featuresEn.push(""); }}>+</button></div>
              {#each p.features as _, j}
                <div class="row2">
                  <input placeholder="МН" bind:value={p.features[j]} />
                  <input placeholder="EN" bind:value={p.featuresEn[j]} />
                  <button class="ic bad" onclick={() => { p.features.splice(j,1); p.featuresEn.splice(j,1); }}>✕</button>
                </div>
              {/each}
            </div>
          </div>
        {/each}

      {:else if view === "features"}
        <div class="head"><h2>Онцлогууд</h2>
          <button class="btn" onclick={() => content.features.push({ icon:"<circle cx='12' cy='12' r='9'/>", title:"", titleEn:"", desc:"", descEn:"" })}>+ Нэмэх</button></div>
        {#each content.features as f, i}
          <div class="card">
            <div class="row"><span class="svg-prev"><svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8">{@html f.icon}</svg></span>
              <input placeholder="Гарчиг (МН)" bind:value={f.title} /><input placeholder="Title (EN)" bind:value={f.titleEn} />
              <button class="ic" onclick={() => move(content.features,i,-1)}>↑</button><button class="ic" onclick={() => move(content.features,i,1)}>↓</button>
              <button class="ic bad" onclick={() => removeAt(content.features,i)}>✕</button></div>
            <div class="row2"><textarea rows="2" placeholder="Тайлбар (МН)" bind:value={f.desc}></textarea><textarea rows="2" placeholder="Desc (EN)" bind:value={f.descEn}></textarea></div>
            <input class="svg-in" placeholder="SVG icon (inner markup)" bind:value={f.icon} />
          </div>
        {/each}

      {:else if view === "services"}
        <div class="head"><h2>Үйлчилгээ</h2>
          <button class="btn" onclick={() => content.services.push({ pill:"", pillEn:"", title:"", titleEn:"", desc:"", descEn:"", points:[], pointsEn:[] })}>+ Нэмэх</button></div>
        {#each content.services as s, i}
          <div class="card">
            <div class="row"><input placeholder="Шошго (МН)" bind:value={s.pill} /><input placeholder="Pill (EN)" bind:value={s.pillEn} />
              <button class="ic bad" onclick={() => removeAt(content.services,i)}>✕</button></div>
            <div class="row2"><input placeholder="Гарчиг (МН)" bind:value={s.title} /><input placeholder="Title (EN)" bind:value={s.titleEn} /></div>
            <div class="row2"><textarea rows="2" placeholder="Тайлбар (МН)" bind:value={s.desc}></textarea><textarea rows="2" placeholder="Desc (EN)" bind:value={s.descEn}></textarea></div>
            <div class="sub-list">
              <div class="sub-h">Цэгүүд <button class="ic" onclick={() => { s.points.push(""); s.pointsEn.push(""); }}>+</button></div>
              {#each s.points as _, j}
                <div class="row2"><input placeholder="МН" bind:value={s.points[j]} /><input placeholder="EN" bind:value={s.pointsEn[j]} />
                  <button class="ic bad" onclick={() => { s.points.splice(j,1); s.pointsEn.splice(j,1); }}>✕</button></div>
              {/each}
            </div>
          </div>
        {/each}

      {:else if view === "industries"}
        <div class="head"><h2>Салбарууд</h2>
          <button class="btn" onclick={() => content.industries.push({ icon:"<rect x='4' y='4' width='16' height='16' rx='3'/>", title:"", titleEn:"", desc:"", descEn:"", tags:[] })}>+ Нэмэх</button></div>
        {#each content.industries as ind, i}
          <div class="card">
            <div class="row"><span class="svg-prev"><svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8">{@html ind.icon}</svg></span>
              <input placeholder="Гарчиг (МН)" bind:value={ind.title} /><input placeholder="Title (EN)" bind:value={ind.titleEn} />
              <button class="ic bad" onclick={() => removeAt(content.industries,i)}>✕</button></div>
            <div class="row2"><input placeholder="Тайлбар (МН)" bind:value={ind.desc} /><input placeholder="Desc (EN)" bind:value={ind.descEn} /></div>
            <input placeholder="Tag-ууд (зайгаар: mining inventory hrm)" value={ind.tags.join(' ')} oninput={(e) => ind.tags = e.currentTarget.value.split(/\s+/).filter(Boolean)} />
            <input class="svg-in" placeholder="SVG icon (inner markup)" bind:value={ind.icon} />
          </div>
        {/each}

      {:else if view === "faq"}
        <div class="head"><h2>Асуулт & Хариулт</h2>
          <button class="btn" onclick={() => content.faq.push({ q:"", qEn:"", a:"", aEn:"" })}>+ Нэмэх</button></div>
        {#each content.faq as item, i}
          <div class="card">
            <div class="row"><input placeholder="Асуулт (МН)" bind:value={item.q} /><input placeholder="Question (EN)" bind:value={item.qEn} />
              <button class="ic" onclick={() => move(content.faq,i,-1)}>↑</button><button class="ic" onclick={() => move(content.faq,i,1)}>↓</button>
              <button class="ic bad" onclick={() => removeAt(content.faq,i)}>✕</button></div>
            <div class="row2"><textarea rows="2" placeholder="Хариулт (МН)" bind:value={item.a}></textarea><textarea rows="2" placeholder="Answer (EN)" bind:value={item.aEn}></textarea></div>
          </div>
        {/each}

      {:else if view === "trust"}
        <div class="head"><h2>Итгэлийн лого</h2>
          <button class="btn" onclick={() => content.trust.push({ name:"Brand", svg:"<circle cx='12' cy='12' r='9'/>" })}>+ Нэмэх</button></div>
        {#each content.trust as b, i}
          <div class="card">
            <div class="row"><span class="svg-prev"><svg viewBox="0 0 24 24" fill="none" stroke="var(--text)" stroke-linecap="round" stroke-linejoin="round">{@html b.svg}</svg></span>
              <input placeholder="Нэр" bind:value={b.name} />
              <button class="ic" onclick={() => move(content.trust,i,-1)}>↑</button><button class="ic" onclick={() => move(content.trust,i,1)}>↓</button>
              <button class="ic bad" onclick={() => removeAt(content.trust,i)}>✕</button></div>
            <input class="svg-in" placeholder="SVG (inner markup)" bind:value={b.svg} />
          </div>
        {/each}

      {:else if view === "meta"}
        <div class="head"><h2>Холбоо & SEO</h2></div>
        <div class="card">
          <h3>Холбоо барих</h3>
          <div class="row2"><input placeholder="И-мэйл" bind:value={content.contact.email} /><input placeholder="Утас (харагдах)" bind:value={content.contact.phone} /></div>
          <input placeholder="Утас (tel: href, +97660034140)" bind:value={content.contact.phoneHref} />
        </div>
        <div class="card">
          <h3>SEO / Meta</h3>
          <input placeholder="Title" bind:value={content.meta.title} />
          <textarea rows="2" placeholder="Description (МН)" bind:value={content.meta.description}></textarea>
          <textarea rows="2" placeholder="Description (EN)" bind:value={content.meta.descriptionEn}></textarea>
          <input placeholder="OG image зам (/og-image.svg)" bind:value={content.meta.ogImage} />
        </div>
        <div class="card">
          <h3>Зураг оруулах → WebP</h3>
          <p class="hint">Зураг оруулаад буцаах замыг (/uploads/…) дээрх SEO/лого талбарт хуулна.</p>
          <input type="file" accept="image/*" onchange={(e) => uploadImage(e.currentTarget.files?.[0])} />
          {#if uploadingFor}<span class="pill">Илгээж байна…</span>{/if}
          {#if lastUpload}<code class="up">{lastUpload}</code>{/if}
        </div>

      {:else if view === "preview"}
        <div class="head"><h2>Урьдчилж үзэх</h2><button class="btn" onclick={() => { const f = document.getElementById('pv'); if (f) f.src = '/preview?preview=1&ts=' + Date.now(); }}>↻ Сэргээх</button></div>
        <p class="hint">Энэ нь <b>ноорог</b> branch-ийн агуулгыг харуулна. Эхлээд <b>Хадгалах</b> дарж дараа нь сэргээ.</p>
        <iframe id="pv" class="pv" title="preview" src="/preview?preview=1"></iframe>

      {:else if view === "submissions"}
        <div class="head"><h2>Демо хүсэлтүүд</h2><button class="btn" onclick={openSubmissions}>↻</button></div>
        {#if submissions === null}<p class="hint">Ачааллаж байна…</p>
        {:else if !submissions.length}<p class="hint">Хүсэлт алга.</p>
        {:else}
          {#each submissions as s}
            <div class="card sub">
              <div class="row"><b>{s.name}</b>{#if s.company}<span class="muted">· {s.company}</span>{/if}<div class="rowsp"></div><span class="muted">{new Date(s.at).toLocaleString()}</span></div>
              <div class="muted">{s.phone}{#if s.email} · {s.email}{/if}{#if s.industry} · {s.industry}{/if}</div>
              {#if s.message}<p>{s.message}</p>{/if}
            </div>
          {/each}
        {/if}

      {:else if view === "history"}
        <div class="head"><h2>Өөрчлөлтийн түүх</h2><button class="btn" onclick={openHistory}>↻</button></div>
        {#if commits === null}<p class="hint">Ачааллаж байна…</p>
        {:else if !commits.length}<p class="hint">Түүх алга.</p>
        {:else}
          <table class="hist"><tbody>
            {#each commits as c}
              <tr><td><code>{c.sha}</code></td><td>{c.message}</td><td class="muted">{c.email}</td><td class="muted">{c.date ? new Date(c.date).toLocaleString() : ''}</td><td>{#if c.url}<a href={c.url} target="_blank" rel="noopener">↗</a>{/if}</td></tr>
            {/each}
          </tbody></table>
        {/if}

      {:else if view === "access" && user.canManage}
        <div class="head"><h2>Хандалтын эрх</h2>
          <button class="btn" onclick={() => accessUsers.push({ email:"", role:"editor" })}>+ Хэрэглэгч</button></div>
        <p class="hint">Эзэд (env ADMIN_EMAILS) өөрчлөгдөхгүй. Админ = засах + хэрэглэгч удирдах, Эдитор = зөвхөн засах.</p>
        {#if owners.length}<div class="card"><h3>Эзэд</h3>{#each owners as o}<div class="muted">{o}</div>{/each}</div>{/if}
        {#each accessUsers as u, i}
          <div class="row card">
            <input placeholder="email@example.com" bind:value={u.email} />
            <select bind:value={u.role}><option value="admin">Админ</option><option value="editor">Эдитор</option></select>
            <button class="ic bad" onclick={() => removeAt(accessUsers, i)}>✕</button>
          </div>
        {/each}
        <button class="btn primary" disabled={busy==="access"} onclick={saveAccess}>{busy==="access" ? "…" : "Хандалт хадгалах"}</button>
      {/if}
    </main>
  </div>
{/if}

{#if toast}<div class="toast {toast.kind}">{toast.text}</div>{/if}

<style>
  .gate { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
  .gate-card { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; padding: 40px; text-align: center; max-width: 380px; }
  .gate-card p { color: var(--dim); margin: 8px 0 22px; }
  .brand { font-weight: 800; font-size: 22px; display: inline-flex; align-items: center; gap: 8px; }
  .brand.sm { font-size: 17px; }
  .brand .mark { width: 26px; height: 26px; display: grid; place-items: center; background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: #fff; border-radius: 8px; font-size: 15px; }
  .brand .tag { font-size: 11px; font-weight: 600; color: var(--faint); border: 1px solid var(--line); padding: 2px 7px; border-radius: 99px; }
  .err { margin-top: 16px; color: var(--bad); font-size: 13px; word-break: break-word; }
  .cfg { font-size: 12px; color: var(--faint); margin: 16px 0; line-height: 1.6; }
  .cfg b { color: var(--dim); }

  .top { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 10px; padding: 12px 18px; background: rgba(10,12,16,.85); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
  .spacer { flex: 1; }
  .me { display: flex; align-items: center; gap: 8px; margin-left: 6px; }
  .me img { width: 30px; height: 30px; border-radius: 50%; }
  .me-i { display: flex; flex-direction: column; line-height: 1.15; }
  .me-i b { font-size: 13px; } .me-i span { font-size: 11px; color: var(--faint); }
  .link { background: none; border: none; color: var(--faint); cursor: pointer; font-size: 12px; text-decoration: underline; }

  .layout { display: grid; grid-template-columns: 210px 1fr; min-height: calc(100vh - 56px); }
  .side { border-right: 1px solid var(--line); padding: 14px 10px; display: flex; flex-direction: column; gap: 2px; position: sticky; top: 56px; align-self: start; height: calc(100vh - 56px); overflow: auto; }
  .side button { text-align: left; background: none; border: none; color: var(--dim); padding: 9px 12px; border-radius: 9px; cursor: pointer; font-size: 14px; }
  .side button:hover { background: var(--panel); color: var(--text); }
  .side button.active { background: var(--panel-2); color: var(--text); font-weight: 600; }

  .main { padding: 22px 26px; max-width: 1000px; }
  .head { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
  .head h2 { font-size: 19px; margin: 0; flex: 1; }
  .hint { color: var(--faint); font-size: 13px; margin: 6px 0 16px; }
  .search { width: 220px; }

  .grp { border: 1px solid var(--line); border-radius: 11px; margin-bottom: 8px; overflow: hidden; }
  .grp-h { width: 100%; display: flex; justify-content: space-between; align-items: center; background: var(--panel); border: none; color: var(--text); padding: 11px 14px; cursor: pointer; font-size: 14px; font-weight: 600; }
  .grp-n { color: var(--faint); font-weight: 500; font-size: 12px; }
  .grp-b { padding: 6px 12px 12px; }
  .kv { display: grid; grid-template-columns: 120px 1fr 1fr; gap: 8px; align-items: start; padding: 6px 0; border-top: 1px solid var(--line); }
  .kv code { font-size: 11px; color: var(--faint); padding-top: 8px; word-break: break-all; }

  .card { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin-bottom: 12px; }
  .card h3 { margin: 0 0 10px; font-size: 14px; }
  .row, .row2 { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
  .row2 { display: grid; grid-template-columns: 1fr 1fr auto; }
  .row2 textarea { grid-column: auto; }
  .rowsp { flex: 1; }
  .sub-list { border-top: 1px solid var(--line); margin-top: 8px; padding-top: 8px; }
  .sub-h { font-size: 12px; color: var(--faint); display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }

  input, textarea, select { width: 100%; background: var(--bg); border: 1px solid var(--line); color: var(--text); border-radius: 8px; padding: 8px 10px; font-size: 13px; font-family: inherit; }
  textarea { resize: vertical; line-height: 1.4; }
  input:focus, textarea:focus, select:focus { outline: none; border-color: var(--accent); }
  input:disabled { opacity: .5; }
  .w-code { max-width: 90px; } select { max-width: 160px; }
  .chk { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; font-size: 12px; color: var(--dim); }
  .chk input { width: auto; }
  .svg-in { font-family: var(--mono, monospace); font-size: 11px; }
  .svg-prev { width: 34px; height: 34px; flex: 0 0 34px; display: grid; place-items: center; background: var(--bg); border: 1px solid var(--line); border-radius: 8px; }
  .svg-prev svg { width: 20px; height: 20px; }

  .btn { background: var(--panel-2); border: 1px solid var(--line); color: var(--text); border-radius: 9px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; }
  .btn:hover { border-color: var(--accent); }
  .btn.primary { background: linear-gradient(135deg, var(--accent), var(--accent-2)); border: none; color: #fff; }
  .btn.ghost { background: none; }
  .btn:disabled { opacity: .6; cursor: default; }
  .ic { background: var(--bg); border: 1px solid var(--line); color: var(--dim); width: 30px; height: 30px; border-radius: 7px; cursor: pointer; flex: 0 0 30px; }
  .ic:hover { color: var(--text); border-color: var(--accent); }
  .ic.bad:hover { color: var(--bad); border-color: var(--bad); }
  .pill { font-size: 12px; color: var(--dim); border: 1px solid var(--line); padding: 5px 10px; border-radius: 99px; }
  .pill.warn { color: var(--warn); border-color: color-mix(in srgb, var(--warn) 40%, transparent); }
  .muted { color: var(--faint); font-size: 12px; }
  .up { display: inline-block; margin-top: 8px; font-size: 12px; color: var(--ok); }

  .pv { width: 100%; height: 70vh; border: 1px solid var(--line); border-radius: 12px; background: #fff; }
  .sub p { margin: 6px 0 0; color: var(--dim); font-size: 13px; }
  .hist { width: 100%; border-collapse: collapse; font-size: 12px; }
  .hist td { padding: 7px 8px; border-bottom: 1px solid var(--line); }
  .hist code { color: var(--accent); }

  .toast { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); background: var(--panel-2); border: 1px solid var(--line); color: var(--text); padding: 11px 18px; border-radius: 11px; z-index: 50; font-size: 13px; box-shadow: 0 12px 40px rgba(0,0,0,.5); }
  .toast.ok { border-color: color-mix(in srgb, var(--ok) 50%, transparent); }
  .toast.bad { border-color: color-mix(in srgb, var(--bad) 50%, transparent); }

  @media (max-width: 720px) { .layout { grid-template-columns: 1fr; } .side { position: static; height: auto; flex-direction: row; flex-wrap: wrap; } .kv { grid-template-columns: 1fr; } }
</style>
