/* ============================================================
   ORINUX — i18n (MN default in DOM, EN dictionary)
   ============================================================ */
(function () {
  "use strict";

  var DICT = {
    nav_platform: ["Платформ", "Platform"],
    nav_modules: ["Модулиуд", "Modules"],
    nav_pricing: ["Үнэ", "Pricing"],
    nav_industries: ["Салбарууд", "Industries"],
    nav_faq: ["Асуулт", "FAQ"],
    nav_login: ["Нэвтрэх", "Log in"],
    nav_cta: ["Демо авах", "Get a demo"],

    hero_eyebrow: ["Дараа үеийн ERP платформ", "The next-generation ERP platform"],
    hero_h1a: ["Agentic Resource", "Agentic Resource"],
    hero_h1b: ["Planning", "Planning"],
    hero_sub: ["AI Agent-ууд таны бизнес процессыг автомат удирддаг. Хүн зөвхөн шийдвэр батална.", "AI agents run your business processes automatically. People just approve decisions."],
    hero_sub_b: ["40+ модуль, 21 tool.", "40+ modules, 21 tools."],
    cta_demo: ["Демо авах", "Get a demo"],
    cta_explore: ["Платформ үзэх", "Explore the platform"],
    cta_contact: ["Холбоо барих", "Contact us"],
    stat_modules: ["Модуль", "Modules"],
    scroll: ["Доош гүйлгэ", "Scroll"],

    trust_label: ["Монголын тэргүүлэх байгууллагууд итгэдэг", "Trusted by leading Mongolian organizations"],

    cmp_eyebrow: ["Шинэ стандарт", "A new standard"],
    cmp_h2_html: ["ERP хуучирсан.<br /><span class=\"grad-text\">ARP шинэ стандарт.</span>", "ERP is outdated.<br /><span class=\"grad-text\">ARP is the new standard.</span>"],
    cmp_sub: ["Уламжлалт ERP системүүд хүнээс хамааралтай. ARP нь AI Agent-ууд ажлыг гүйцэтгэж, хүн зөвхөн стратеги, шийдвэрт анхаарна.", "Traditional ERP depends on people. With ARP, AI agents do the work and people focus only on strategy and decisions."],
    cmp_old: ["Хуучин ERP", "Legacy ERP"],
    cmp_new: ["ARP (orinux)", "ARP (orinux)"],

    feat_eyebrow: ["Яагаад ARP?", "Why ARP?"],
    feat_h2_html: ["Бизнесийн бүх процессыг нэг платформд, <span class=\"grad-text\">AI-ийн хүчээр.</span>", "Every business process on one platform, <span class=\"grad-text\">powered by AI.</span>"],

    mod_eyebrow: ["40+ модуль, нэг платформ", "40+ modules, one platform"],
    mod_h2_html: ["Хэрэгтэй модулиа сонгоод <span class=\"grad-text\">шууд эхэл.</span>", "Pick the modules you need and <span class=\"grad-text\">start instantly.</span>"],
    mod_sub: ["Бүгдийг нь авах шаардлагагүй. Хэзээ ч нэмж, хасч болно.", "No need to take them all. Add or remove anytime."],
    mod_all: ["Бүгд", "All"],
    mod_biz: ["Бизнес", "Business"],
    mod_ind: ["Салбарын шийдэл", "Industry"],

    plat_eyebrow: ["Платформ", "The platform"],
    plat_h2_html: ["Нэг дэлгэцэнд — <span class=\"grad-text\">бүх бизнес.</span>", "Your whole business — <span class=\"grad-text\">on one screen.</span>"],
    plat_sub: ["AI Agent-ууд бодит цагт ажиллаж, шийдвэр санал болгоно. Та зөвхөн нэг товч дарж батална.", "AI agents work in real time and propose decisions. You approve with a single click."],
    dn_overview: ["Хяналтын самбар", "Dashboard"],
    dn_inventory: ["Агуулах", "Inventory"],
    dn_sales: ["Борлуулалт", "Sales"],
    dn_hr: ["Хүний нөөц", "HR"],
    dn_finance: ["Санхүү", "Finance"],
    dn_agents: ["AI Agents", "AI Agents"],
    dash_title: ["Хяналтын самбар", "Dashboard"],
    dash_sub: ["Бодит цагийн тойм — өнөөдөр", "Real-time overview — today"],
    dash_live: ["6 AI Agent идэвхтэй", "6 AI agents active"],
    kpi_rev: ["Орлого", "Revenue"],
    kpi_orders: ["Захиалга", "Orders"],
    kpi_auto: ["Автоматжсан", "Automated"],
    kpi_tasks: ["AI даалгавар", "AI tasks"],
    chart_title: ["Орлого vs Автоматжуулалт", "Revenue vs Automation"],
    leg_rev: ["Орлого", "Revenue"],
    leg_auto: ["Авто", "Auto"],
    feed_title: ["AI Agent үйлдэл", "AI agent activity"],
    wf_title: ["Нэхэмжлэх батлах · Agent workflow", "Invoice approval · agent workflow"],
    wf1: ["Хүлээн авав", "Received"],
    wf2: ["AI шалгав", "AI checked"],
    wf2s: ["зөрчилгүй", "no issues"],
    wf3: ["Хүн баталгаажуулав", "Human approved"],
    wf4: ["Төлбөр хийгдэв", "Paid"],
    wf4s: ["e-Barimt", "e-Barimt"],
    pf1_t: ["Бодит цагийн", "Real-time"],
    pf1_p: ["Бүх өгөгдөл секунд тутамд шинэчлэгдэж, AI шууд хариу үйлдэл хийнэ.", "Every data point updates by the second and AI reacts instantly."],
    pf2_t: ["Хүн төвтэй", "Human-in-the-loop"],
    pf2_p: ["AI санал болгоно, эцсийн шийдвэрийг хүн нэг товчоор батална.", "AI proposes; a person approves the final decision in one click."],
    pf3_t: ["Аль ч төхөөрөмжид", "Any device"],
    pf3_p: ["Веб дээр суурилсан — утас, таблет, компьютер хаанаас ч хандана.", "Web-based — access from phone, tablet or desktop anywhere."],

    res_eyebrow: ["Хэмжигдэхүйц үр дүн", "Measurable results"],
    res_h2_html: ["Тоо өөрөө <span class=\"grad-text\">ярьдаг.</span>", "The numbers <span class=\"grad-text\">speak.</span>"],
    res_s1: ["Гар ажиллагаа цөөрсөн", "Less manual work"],
    res_s2: ["Процесс хурдассан", "Faster processes"],
    res_s3: ["Зардал хэмнэсэн", "Cost saved"],
    res_s4: ["Системийн тогтвортой байдал", "System uptime"],
    quote_text: ["Orinux-ийг нэвтрүүлснээр манай агуулах, борлуулалтын баг өдөрт хэдэн цаг хэмнэж эхэлсэн. AI Agent давтагдах ажлыг хийж, бид стратегид анхаарах боллоо.", "Since adopting Orinux, our warehouse and sales teams save hours every day. AI agents handle the repetitive work, so we can focus on strategy."],
    quote_name: ["Г. Энхбаяр", "G. Enkhbayar"],
    quote_role: ["Гүйцэтгэх захирал, Тэрэлж Групп", "CEO, Terelj Group"],

    how_eyebrow: ["Хэрхэн ажилладаг вэ?", "How it works"],
    how_h2_html: ["3 энгийн алхамаар <span class=\"grad-text\">бизнесээ автоматжуул.</span>", "Automate your business in <span class=\"grad-text\">3 simple steps.</span>"],
    how1_t: ["Бүртгүүлээд эхэл", "Sign up & start"],
    how1_p: ["Байгууллагаа бүртгүүлж, тусдаа орчин ав. 2 минутын дотор бэлэн.", "Register your organization and get a dedicated workspace. Ready in 2 minutes."],
    how2_t: ["Модуль сонго", "Choose modules"],
    how2_p: ["40+ модулиас хэрэгтэйгээ идэвхжүүл. Хэзээ ч нэмж, хасч болно.", "Activate what you need from 40+ modules. Add or remove anytime."],
    how3_t: ["AI Agent ажиллана", "AI agents go to work"],
    how3_p: ["Модуль бүрийн AI Agent бизнес процессыг автоматжуулж эхэлнэ. Та зөвхөн батална.", "Each module's AI agent starts automating your processes. You just approve."],

    svc_eyebrow: ["Мэргэжлийн үйлчилгээ", "Professional services"],
    svc_h2_html: ["AI Agent &amp; RAG <span class=\"grad-text\">Тохируулалт</span>", "AI Agent &amp; RAG <span class=\"grad-text\">Implementation</span>"],
    svc_sub: ["Танай байгууллагын үйл ажиллагааг AI-ээр автоматжуулж, мэдлэгийн санд суурилсан ухаалаг систем бүтээж өгнө.", "We automate your operations with AI and build intelligent systems grounded in your knowledge base."],

    stage_eyebrow: ["Салбарын трансформаци", "Industry transformation"],
    stage_h2_html: ["Нэг платформ.<br /><span class=\"grad-text\">Хязгааргүй салбар.</span>", "One platform.<br /><span class=\"grad-text\">Infinite industries.</span>"],
    stage_lede: ["Салбар бүрийн талбайн өгөгдлийг ARP-ийн AI Core бодит цагт боловсруулж, шийдвэр болгон удирдлагад дамжуулна. Сонгоод үзээрэй.", "ARP's AI Core processes each industry's field data in real time and turns it into decisions for management. Take a look."],

    ind_eyebrow: ["Салбар бүрийн шийдэл", "A solution for every industry"],
    ind_h2_html: ["ARP нь <span class=\"grad-text\">ямар ч салбарт</span> тохирно.", "ARP fits <span class=\"grad-text\">any industry.</span>"],
    ind_sub: ["Модулиудыг хослуулж өөрийн бизнест тохируулна.", "Combine modules to fit your own business."],

    price_eyebrow: ["Уян хатан үнэ", "Flexible pricing"],
    price_h2_html: ["Хэрэглэснээрээ <span class=\"grad-text\">төл.</span>", "Pay for <span class=\"grad-text\">what you use.</span>"],
    price_sub: ["Модулиар тоологддог — шаардлагагүй зүйлд төлөхгүй. Хэдийд ч өргөтгөнө.", "Billed per module — never pay for what you don't need. Scale up anytime."],
    per_mo: ["/ сар", "/ mo"],
    price_popular: ["Хамгийн эрэлттэй", "Most popular"],
    price_custom: ["Тусгай", "Custom"],
    price_try: ["Эхлүүлэх", "Start now"],
    price_try2: ["Демо авах", "Get a demo"],
    price_contact: ["Холбоо барих", "Contact us"],
    pr1_t: ["Эхлэл", "Starter"],
    pr1_d: ["Шинэ болон жижиг бизнест.", "For new and small businesses."],
    pr1_n: ["3 хүртэл модуль · 10 хэрэглэгч", "Up to 3 modules · 10 users"],
    pr1_f1: ["Үндсэн 3 модуль", "3 core modules"],
    pr1_f2: ["AI Agent (үндсэн)", "AI agent (basic)"],
    pr1_f3: ["e-Barimt, QPay интеграц", "e-Barimt, QPay integration"],
    pr1_f4: ["Имэйл дэмжлэг", "Email support"],
    pr2_t: ["Бизнес", "Business"],
    pr2_d: ["Өсөн нэмэгдэж буй компанид.", "For growing companies."],
    pr2_n: ["10 хүртэл модуль · 50 хэрэглэгч", "Up to 10 modules · 50 users"],
    pr2_f1: ["10 хүртэл модуль", "Up to 10 modules"],
    pr2_f2: ["Бүх AI Agent + workflow", "All AI agents + workflows"],
    pr2_f3: ["Бүх 21 tool интеграц", "All 21 tool integrations"],
    pr2_f4: ["Тэргүүлэх дэмжлэг 24/7", "Priority support 24/7"],
    pr3_t: ["Корпораци", "Enterprise"],
    pr3_d: ["Том байгууллага, олон салбарт.", "For large, multi-branch organizations."],
    pr3_n: ["Хязгааргүй модуль · хэрэглэгч", "Unlimited modules · users"],
    pr3_f1: ["Бүх 40+ модуль", "All 40+ modules"],
    pr3_f2: ["Custom AI Agent & RAG", "Custom AI agents & RAG"],
    pr3_f3: ["On-premise / тусгай дата", "On-premise / dedicated data"],
    pr3_f4: ["Зориулалтын менежер", "Dedicated manager"],

    demo_eyebrow: ["Демо захиалах", "Request a demo"],
    demo_h2_html: ["Бизнестээ <span class=\"grad-text\">ARP-г</span> туршаарай", "Try <span class=\"grad-text\">ARP</span> in your business"],
    demo_sub: ["Хувийн демо захиалаарай. Танай салбарт тохирсон AI Agent шийдлийг 30 минутын дотор үзүүлнэ.", "Book a personal demo. We'll show an AI agent solution tailored to your industry in 30 minutes."],
    dp1_t: ["Танай салбарт тохирсон", "Tailored to your industry"],
    dp1_p: ["Уул уурхай, эрүүл мэнд, худалдаа — танай процесст яаж тохирохыг харуулна.", "Mining, healthcare, retail — we'll show how it fits your process."],
    dp2_t: ["30 минутын танилцуулга", "30-minute walkthrough"],
    dp2_p: ["Шууд бүтээгдэхүүн дээр, бодит жишээгээр. Үүрэг хүлээлгэхгүй.", "Live in the product, with real examples. No obligation."],
    dp3_t: ["Үнэгүй зөвлөгөө", "Free consultation"],
    dp3_p: ["Танай одоогийн системийг хэрхэн шилжүүлэх төлөвлөгөө гаргаж өгнө.", "We'll map out a plan to migrate from your current system."],
    f_name: ["Нэр <span class=\"req\">*</span>", "Name <span class=\"req\">*</span>"],
    f_name_ph: ["Таны нэр", "Your name"],
    f_name_err: ["Нэрээ оруулна уу", "Please enter your name"],
    f_company: ["Байгууллага <span class=\"req\">*</span>", "Company <span class=\"req\">*</span>"],
    f_company_ph: ["Компанийн нэр", "Company name"],
    f_company_err: ["Байгууллагаа оруулна уу", "Please enter your company"],
    f_email: ["Имэйл <span class=\"req\">*</span>", "Email <span class=\"req\">*</span>"],
    f_email_err: ["Зөв имэйл оруулна уу", "Please enter a valid email"],
    f_phone: ["Утас <span class=\"req\">*</span>", "Phone <span class=\"req\">*</span>"],
    f_phone_err: ["Зөв дугаар оруулна уу", "Please enter a valid number"],
    f_industry: ["Салбар", "Industry"],
    f_industry_ph: ["Салбараа сонгоно уу", "Select your industry"],
    ind_mining: ["Уул уурхай", "Mining"],
    ind_health: ["Эрүүл мэнд", "Healthcare"],
    ind_edu: ["Боловсрол", "Education"],
    ind_factory: ["Үйлдвэрлэл", "Manufacturing"],
    ind_retail: ["Худалдаа", "Retail"],
    ind_other: ["Бусад", "Other"],
    f_msg: ["Нэмэлт мэдээлэл", "Additional details"],
    f_msg_ph: ["Юуг автоматжуулахыг хүсэж байна вэ?", "What would you like to automate?"],
    f_submit: ["Демо хүсэлт илгээх", "Send demo request"],
    ok_t: ["Баярлалаа! 🎉", "Thank you! 🎉"],
    ok_p: ["Таны хүсэлтийг хүлээн авлаа. Манай баг 24 цагийн дотор холбогдоно.", "We've received your request. Our team will reach out within 24 hours."],

    faq_eyebrow: ["Түгээмэл асуулт", "FAQ"],
    faq_h2: ["Асуумаар байсан зүйлс", "Questions you might have"],
    faq_q1: ["ARP гэж юу вэ? ERP-ээс юугаараа ялгаатай вэ?", "What is ARP? How is it different from ERP?"],
    faq_a1: ["ARP (Agentic Resource Planning) нь уламжлалт ERP-ийн дараагийн үе. ERP-д хүн бүх өгөгдлийг гараар оруулдаг бол ARP-д AI Agent-ууд процессыг автоматаар гүйцэтгэж, хүн зөвхөн шийдвэрийг батална.", "ARP (Agentic Resource Planning) is the next generation of ERP. Where ERP needs people to enter all data manually, ARP has AI agents run the processes automatically while people only approve decisions."],
    faq_q2: ["Нэвтрүүлэхэд хэр хугацаа шаардагдах вэ?", "How long does onboarding take?"],
    faq_a2: ["Үндсэн модулиудыг 2 минутын дотор идэвхжүүлж эхэлнэ. Бүрэн тохиргоо, дата шилжүүлэг танай хэмжээнээс хамаарч 1-4 долоо хоног үргэлжилнэ. Манай баг бүх шатанд дэмжинэ.", "You can activate core modules within 2 minutes. Full setup and data migration takes 1–4 weeks depending on your size. Our team supports you at every step."],
    faq_q3: ["Миний өгөгдөл хаана хадгалагдах вэ? Аюулгүй юу?", "Where is my data stored? Is it secure?"],
    faq_a3: ["Байгууллага бүр тусдаа, тусгаарлагдсан орчинд (multi-tenant) ажиллана. Өгөгдөл шифрлэгдэж, тогтмол нөөцлөгдөнө. Шаардлагатай бол on-premise буюу танай дотоод серверт байршуулах боломжтой.", "Each organization runs in its own isolated multi-tenant environment. Data is encrypted and backed up regularly. If needed, it can be deployed on-premise on your own servers."],
    faq_q4: ["e-Barimt, QPay, банкны системтэй холбогдох уу?", "Does it connect to e-Barimt, QPay and banks?"],
    faq_a4: ["Тийм. e-Barimt, QPay, SocialPay, дотоодын банкуудын API бүгд бэлэн интеграцитай. Нэмэлт интеграц хэрэгтэй бол манай баг хийж өгнө.", "Yes. e-Barimt, QPay, SocialPay and local bank APIs all come with ready integrations. We can build additional integrations on request."],
    faq_q5: ["Зөвхөн хэрэгтэй модулиа авч болох уу?", "Can I take only the modules I need?"],
    faq_a5: ["Мэдээж. ARP бүхэлдээ модульчлагдсан. Эхэндээ 2-3 модулиар эхлээд, шаардлага гарах бүрд нэмж болно. Хэрэглэснээрээ л төлнө.", "Of course. ARP is fully modular. Start with 2–3 modules and add more whenever you need. You only pay for what you use."],

    final_eyebrow: ["Бэлэн үү?", "Ready?"],
    final_h2_html: ["Бизнесээ <span class=\"grad-text\">дараа үед</span> аваач", "Take your business <span class=\"grad-text\">into the future</span>"],
    final_sub: ["AI Agent-ууд таны бизнес процессыг 24/7 автоматжуулна. Демо авч, ARP-ийн хүчийг мэдрээрэй.", "AI agents automate your processes 24/7. Get a demo and feel the power of ARP."]
  };

  // CMS override: content.json supplies the live dictionary via this global.
  // The embedded DICT above is only a build-time fallback.
  if (window.__ORINUX_I18N__) DICT = Object.assign(DICT, window.__ORINUX_I18N__);

  var lang = "mn";
  try { lang = localStorage.getItem("orinux-lang") || "mn"; } catch (e) {}
  // A ?lang= URL param wins (used by the admin preview iframe + shareable links).
  try {
    var qlang = new URLSearchParams(location.search).get("lang");
    if (qlang === "mn" || qlang === "en") lang = qlang;
  } catch (e) {}

  function apply(l) {
    var idx = l === "en" ? 1 : 0;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var v = DICT[key];
      if (!v) return;
      var s = v[idx];
      if (s.indexOf("<") !== -1) el.innerHTML = s;
      else el.textContent = s;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var v = DICT[el.getAttribute("data-i18n-ph")];
      if (v) el.setAttribute("placeholder", v[idx]);
    });
    // Inline bilingual nodes (list items rendered server-side from content.json).
    // Each carries data-mn (+ optional data-en); we swap text on toggle.
    document.querySelectorAll("[data-bi]").forEach(function (el) {
      var s = idx === 1 ? (el.getAttribute("data-en") || el.getAttribute("data-mn")) : el.getAttribute("data-mn");
      if (s == null) return;
      if (s.indexOf("<") !== -1) el.innerHTML = s;
      else el.textContent = s;
    });
    document.documentElement.setAttribute("lang", l);
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === l ? "true" : "false");
    });
    lang = l;
    try { localStorage.setItem("orinux-lang", l); } catch (e) {}
    window.dispatchEvent(new Event("orinux:lang"));
  }

  document.querySelectorAll(".lang-toggle button").forEach(function (b) {
    b.addEventListener("click", function () { apply(b.getAttribute("data-lang")); });
  });

  if (lang === "en") apply("en");
  else apply("mn");
})();
