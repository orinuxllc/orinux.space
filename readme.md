# orinux.space

Orinux ARP (Agentic Resource Planning) маркетинг вэбсайт — **админ удирдлагатай** (өгөгдлийн
сангүй, контент нь GitHub branch дээр хадгалагдаж, админ самбараас засагдана).

**Tech stack:** Astro 5 (static + serverless API routes), Svelte 5 (админ), өөрийн дизайн CSS.

**Deploy:** Vercel.

## Ажиллуулах

```bash
npm install
npm run dev       # хөгжүүлэлт → http://localhost:4321
npm run build     # production build + зураг → WebP
npm run preview   # build-ийг урьдчилан үзэх
```

## Админ

- `/admin` — Google-ээр нэвтэрч контент засна (текст МН/EN, модуль, үнэ, FAQ, үйлчилгээ,
  салбар, лого, зураг). **Хадгалах** → `cms-draft` branch, **Нийтлэх** → `main`-д merge → Vercel
  дахин build хийнэ.
- `/preview?preview=1` — ноорог (cms-draft) агуулгыг Astro-гоор render хийж урьдчилж үзүүлнэ.

Тохиргоо (env), архитектур, branch загварыг `CLAUDE.md` болон `.env.example`-аас үз.
