import React, { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Single-file React landing page (Canvas preview ready)
// Robust against undefined data by defensive mapping + smoke tests
// Sections: Services, Hospitals, Process, 240h TWOV Policy (+official links + eligible countries toggle), Case Studies (+timeline & charts), Pricing, Travel, FAQ, Contact (+TWOV checkbox)

export default function MediBridgeGlobal() {
  const [lang, setLang] = useState("zh");
  const [showCountries, setShowCountries] = useState(false); // default hidden

  // --- Contact form state (controlled) ---
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    need: "",
    twov: false,
    hp: "", // honeypot
  });
  const [submitting, setSubmitting] = useState(false);

  // Helper: safely coerce to array for .map
  const A = (v) => (Array.isArray(v) ? v : []);

  // i18n dictionaries (stable, synchronous)
  const locales = useMemo(() => {
    const zh = {
      brand: "MediBridge Global",
      tagline: "海外来华就医一站式服务",
      subTagline: "更快预约 · 透明价格 · 专业翻译 · 医疗合规 · 全程陪同",
      ctaPrimary: "获取方案与报价",
      ctaSecondary: "了解服务流程",
      ctaPolicy: "查看240小时免签",
      nav: {
        services: "服务",
        hospitals: "合作医院",
        process: "流程",
        pricing: "价格",
        travel: "签证与行程",
        policy: "240小时免签",
        cases: "客户案例",
        faq: "常见问题",
        contact: "联系我们",
      },
      ribbons: [
        "72小时内给出就医方案*",
        "真实排期与估价",
        "全程中文/英文/日文翻译",
        "平台不提供诊疗，仅做协调与陪护",
      ],
      trustBlurb:
        "我们与多家中国三甲医院与国际部合作，聚焦影像检查、体检套餐、专科会诊与术后复评等高需求服务。",
      servicesTitle: "我们能帮您什么",
      services: [
        { title: "加速预约与排期", desc: "影像（CT/MRI/超声）、实验室检测、专科门诊体检等优先协调，减少往返等待。" },
        { title: "多语种医疗翻译", desc: "专业医学口译与病历笔译（英/中/日），会议记录与术前/术后沟通全覆盖。" },
        { title: "方案与费用预估", desc: "根据初步资料给出多医院可行方案与区间报价，透明不捆绑。" },
        { title: "行程与陪护", desc: "落地签证指导、接送机、就医陪同、药事咨询与随访问答。" },
        { title: "术后复评·第二诊疗意见", desc: "影像/化验单复核与多学科（MDT）远程会诊协调。" },
        { title: "数据与合规", desc: "遵循隐私合规与数据最小化原则，签署保密协议（NDA）。" },
      ],
      hospitalTitle: "合作与对接（示例）",
      hospitalNote: "以下为常见就诊科室示例，实际以当期医院名额与资质为准。我们不对医疗结果做任何承诺。",
      hospitalDepts: [
        "影像中心：CT · MRI · PET/CT · 超声",
        "体检中心：基础/高端体检套餐",
        "内科/外科/肿瘤科/心内科/骨科/消化科/妇儿",
        "国际医疗部：外籍与港澳台人士接待",
      ],
      processTitle: "标准流程",
      process: [
        { step: "1", title: "免费初聊与资料收集", text: "了解诉求，收集既往病历/影像/检验单（复印或电子件）。" },
        { step: "2", title: "多方案与区间报价", text: "1–3个可行医院/科室方案与预计时间/费用范围。" },
        { step: "3", title: "签订服务与隐私协议", text: "明确服务边界（非医疗机构）、费用与取消条款。" },
        { step: "4", title: "预约排期与签证/行程", text: "出具邀请材料要点、航班与酒店建议、城市内交通。" },
        { step: "5", title: "落地陪同与就医协调", text: "现场报到、缴费引导、翻译陪同、必要时加验项目协调。" },
        { step: "6", title: "结果翻译与随访", text: "报告翻译与解读，复诊/远程MDT转介（如需）。" },
      ],
      pricingTitle: "价格与计费",
      pricingNote: "以下为服务费参考，不含医院官方收费与第三方签证机票酒店等费用。",
      plans: [
        { name: "体检·影像加速", price: "$299 起", items: ["体检/影像排期与陪同（单城市）", "报告翻译（最多3份）", "结果解读与随访1次"] },
        { name: "专科就医协调", price: "$699 起", items: ["门诊预约与现场陪同", "病历笔译与口译（至多半天）", "多方案报价与行程指引"] },
        { name: "MDT/第二意见", price: "$499 起", items: ["多学科资料整理与提交", "书面意见翻译与说明", "必要时追加问询1次"] },
      ],
      travelTitle: "签证与行程指引",
      travelBullets: [
        "签证：根据国籍选择旅游/就医相关类型并准备材料。",
        "航班：建议直飞或2次以内转机，携带纸质病历与电子备份。",
        "住宿：医院周边步行/地铁15分钟优先，支持家庭陪护房。",
        "保险：建议购买含境外医疗/行程变更的保险产品。",
      ],
      policyLinksTitle: "官方政策与口岸信息（示例合集）",
      policyLinksDesc: "以下链接为示例入口，实际以各地出入境/边检与官方公告为准。",
      policyLinksGroups: [
        { city: "北京", links: [{ name: "首都口岸边检信息", href: "#" }] },
        { city: "上海", links: [{ name: "浦东/虹桥口岸边检信息", href: "#" }] },
        { city: "广东（广州/深圳）", links: [{ name: "广东出入境与口岸公告", href: "#" }] },
        { city: "四川（成都）", links: [{ name: "成都口岸边检信息", href: "#" }] },
        { city: "福建（厦门）", links: [{ name: "厦门口岸边检信息", href: "#" }] },
        { city: "山东（青岛）", links: [{ name: "青岛口岸边检信息", href: "#" }] },
      ],
      policyEligibleTitle: "240小时过境免签适用国家（55国，默认隐藏）",
      policyEligibleBtnShow: "查看国家",
      policyEligibleBtnHide: "收起国家",
      policyEligibleNote: "* 信息由客户提供，具体以中国移民管理部门/口岸执行为准。",
      eligibleGroups: [
        {
          region: "欧洲（40国）",
          countries: [
            "奥地利","比利时","捷克","丹麦","爱沙尼亚","芬兰","法国","德国","希腊","匈牙利","冰岛","意大利","拉脱维亚","立陶宛","卢森堡","马耳他","荷兰","波兰","葡萄牙","斯洛伐克","斯洛文尼亚","西班牙","瑞典","瑞士","摩纳哥","俄罗斯","英国","爱尔兰","塞浦路斯","保加利亚","罗马尼亚","乌克兰","塞尔维亚","克罗地亚","波黑","黑山","北马其顿","阿尔巴尼亚","白俄罗斯","挪威"
          ]
        },
        {
          region: "美洲（6国）",
          countries: ["美国","加拿大","巴西","墨西哥","阿根廷","智利"]
        },
        {
          region: "大洋洲（2国）",
          countries: ["澳大利亚","新西兰"]
        },
        {
          region: "亚洲（7国）",
          countries: ["韩国","日本","新加坡","文莱","阿联酋","卡塔尔","印度尼西亚"]
        }
      ],
      policyCTA: "一键咨询免签方案",
      casesTitle: "真实客户案例（经同意匿名展示）",
      contactTitle: "联系我们",
      contactBlurb: "提交表单后，顾问会在72小时内通过邮件/WhatsApp与您确认需求并安排初步沟通。",
      form: { name: "姓名", email: "邮箱", phone: "WhatsApp/电话（可选）", country: "所在国家/地区", need: "就医需求简述（科室/检查/病情）", twov: "需要240小时免签方案评估", submit: "提交咨询" },
      legal: "重要声明：本平台不是医疗机构，不提供诊断、治疗或处方。本文所涉时效、费用与资源为参考，实际以医院为准。请遵循当地法律法规并就重大医疗决策咨询持证医生。",
      footer: "© " + new Date().getFullYear() + " MediBridge Global. All rights reserved.",
      switch: "EN",
      submitOk: "提交成功，我们会尽快联系您。",
      submitFail: "提交失败，请稍后再试或通过邮箱与我们联系。",
    };

    const en = {
      brand: "MediBridge Global",
      tagline: "One‑stop Care Coordination in China",
      subTagline: "Faster Scheduling · Transparent Costs · Pro Interpreting · Compliance‑first · End‑to‑End Support",
      ctaPrimary: "Get Plan & Quote",
      ctaSecondary: "See How It Works",
      ctaPolicy: "Learn about 240h TWOV",
      nav: {
        services: "Services",
        hospitals: "Hospitals",
        process: "Process",
        pricing: "Pricing",
        travel: "Visa & Travel",
        policy: "144/240h TWOV",
        cases: "Case Studies",
        faq: "FAQ",
        contact: "Contact",
      },
      ribbons: [
        "Proposed plan within 72h*",
        "Real scheduling & estimates",
        "EN/ZH/JP medical interpreting",
        "We coordinate, not diagnose or treat",
      ],
      trustBlurb:
        "We partner with leading Chinese hospitals/international centers, focusing on imaging, checkups, specialty visits and second opinions.",
      servicesTitle: "What We Do",
      services: [
        { title: "Accelerated Scheduling", desc: "Priority coordination for CT/MRI/Ultrasound, lab tests, checkups and specialist clinics." },
        { title: "Medical Interpreting", desc: "Professional on‑site & written translation (EN/ZH/JP), including consult notes and follow‑ups." },
        { title: "Plan & Cost Estimates", desc: "Multiple hospital options with timeframe and budget ranges—no bundling." },
        { title: "Travel & Care Escort", desc: "Visa guidance, airport pickup, clinic escort, pharmacy and after‑visit support." },
        { title: "Second Opinion / MDT", desc: "Case curation for multidisciplinary reviews and structured written opinions." },
        { title: "Privacy & Compliance", desc: "Data minimization, NDA, encrypted transfer and clear consent workflows." },
      ],
      hospitalTitle: "Affiliations (Examples)",
      hospitalNote: "Departments listed are examples only; actual access depends on capacity and credentials. No outcome guarantees.",
      hospitalDepts: [
        "Imaging: CT · MRI · PET/CT · Ultrasound",
        "Checkup Centers: basic/advanced packages",
        "Major specialties: Oncology/Cardiology/Ortho/GI/OB‑Peds",
        "International Centers for expatriates and visitors",
      ],
      processTitle: "How It Works",
      process: [
        { step: "1", title: "Discovery & Records", text: "Intro call; collect prior notes, scans and lab reports (copies or digital)." },
        { step: "2", title: "Options & Estimates", text: "1–3 hospital/department options with time & budget ranges." },
        { step: "3", title: "Service & Privacy Agreement", text: "Sign scope (non‑clinical), fee schedule and cancellation policy." },
        { step: "4", title: "Scheduling & Visa/Travel", text: "Provide invitation details, route & hotel tips, in‑city logistics." },
        { step: "5", title: "On‑site Escort", text: "Check‑in guidance, payments, interpreting and add‑on test coordination." },
        { step: "6", title: "Results & Follow‑up", text: "Translate reports, explain results and arrange follow‑ups as needed." },
      ],
      pricingTitle: "Pricing",
      pricingNote: "Service fees only—hospital bills, visa, flights and hotels are separate and paid to providers.",
      plans: [
        { name: "Checkup & Imaging", price: "$299+", items: ["Scheduling & escort (one city)", "Translate up to 3 reports", "One follow‑up call"] },
        { name: "Specialist Visit", price: "$699+", items: ["Clinic booking & on‑site interpreting", "Written translation (half‑day)", "Multi‑option estimates & itinerary tips"] },
        { name: "Second Opinion / MDT", price: "$499+", items: ["Case curation & submission", "Written opinion translation", "One clarification round"] },
      ],
      travelTitle: "Visa & Travel Notes",
      travelBullets: [
        "Visa: choose type per nationality; prepare required documents.",
        "Flights: prefer direct/≤2 stops; bring printed & digital records.",
        "Stay: 5–15 min to hospital by walk/metro; family rooms available.",
        "Insurance: consider travel medical & change coverage.",
      ],
      policyLinksTitle: "Official Policy & Port Info (sample list)",
      policyLinksDesc: "Sample entry points only—follow local immigration/port authorities for the latest rules.",
      policyLinksGroups: [
        { city: "Beijing", links: [{ name: "Capital port immigration info", href: "#" }] },
        { city: "Shanghai", links: [{ name: "Pudong/Hongqiao port immigration info", href: "#" }] },
        { city: "Guangdong (Guangzhou/Shenzhen)", links: [{ name: "Guangdong immigration notices", href: "#" }] },
        { city: "Sichuan (Chengdu)", links: [{ name: "Chengdu port immigration info", href: "#" }] },
        { city: "Fujian (Xiamen)", links: [{ name: "Xiamen port immigration info", href: "#" }] },
        { city: "Shandong (Qingdao)", links: [{ name: "Qingdao port immigration info", href: "#" }] },
      ],
      policyEligibleTitle: "240h TWOV Eligible Countries (55, hidden by default)",
      policyEligibleBtnShow: "Show countries",
      policyEligibleBtnHide: "Hide countries",
      policyEligibleNote: "* Provided by client; follow Chinese immigration/port authorities for authoritative lists.",
      eligibleGroups: [
        {
          region: "Europe (40)",
          countries: [
            "Austria","Belgium","Czech Republic","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Iceland","Italy","Latvia","Lithuania","Luxembourg","Malta","Netherlands","Poland","Portugal","Slovakia","Slovenia","Spain","Sweden","Switzerland","Monaco","Russia","United Kingdom","Ireland","Cyprus","Bulgaria","Romania","Ukraine","Serbia","Croatia","Bosnia and Herzegovina","Montenegro","North Macedonia","Albania","Belarus","Norway"
          ]
        },
        {
          region: "Americas (6)",
          countries: ["United States","Canada","Brazil","Mexico","Argentina","Chile"]
        },
        {
          region: "Oceania (2)",
          countries: ["Australia","New Zealand"]
        },
        {
          region: "Asia (7)",
          countries: ["South Korea","Japan","Singapore","Brunei","United Arab Emirates","Qatar","Indonesia"]
        }
      ],
      policyCTA: "Consult TWOV now",
      casesTitle: "Case Studies (anonymized with consent)",
      contactTitle: "Contact Us",
      contactBlurb: "Share your needs and we’ll reach out within 72 hours via email/WhatsApp for an intro call.",
      form: { name: "Full Name", email: "Email", phone: "WhatsApp/Phone (optional)", country: "Country/Region", need: "Brief needs (dept/checks/condition)", twov: "Request 240h TWOV assessment", submit: "Submit Inquiry" },
      legal: "Disclaimer: We are not a medical provider. We do not diagnose, treat, or prescribe. Timelines and prices are indicative only; actuals depend on hospitals. Consult licensed clinicians for medical decisions.",
      footer: "© " + new Date().getFullYear() + " MediBridge Global. All rights reserved.",
      switch: "中文",
      submitOk: "Thanks! We will contact you soon.",
      submitFail: "Submission failed. Please try again later or email us directly.",
    };

    return { zh, en };
  }, []);

  // Choose current locale safely (fallback to zh)
  const t = (lang === "zh" ? locales.zh : locales.en) || locales.zh || {};

  // ----- Case data for charts (static, safe) -----
  const case1Cost = [
    { name: lang === "zh" ? "巴黎费用" : "Paris Cost", value: 3 },
    { name: lang === "zh" ? "来华费用" : "China Cost", value: 1 },
  ];
  const case1Time = [
    { name: lang === "zh" ? "巴黎排队(天)" : "Paris Wait (days)", value: 14 },
    { name: lang === "zh" ? "来华全流程(小时)" : "China Total (hours)", value: 48 },
  ];
  const case2Time = [
    { name: lang === "zh" ? "芬兰多院跑腿(天)" : "Finland multi-clinic (days)", value: 5 },
    { name: lang === "zh" ? "来华体检(天)" : "China checkup (days)", value: 1 },
    { name: lang === "zh" ? "出报告(天)" : "Report ready (days)", value: 3 },
  ];

  // ---- Runtime smoke tests ("test cases") ----
  useEffect(() => {
    try {
      console.group("MediBridgeGlobal smoke tests");
      // Locale presence
      console.assert(!!locales && !!locales.zh && !!locales.en, "locales should have zh & en");
      // Critical nav keys
      ["services","hospitals","process","pricing","travel","policy","cases","faq","contact"].forEach((k) => {
        console.assert(!!locales.zh.nav?.[k] && !!locales.en.nav?.[k], `nav.${k} should exist`);
      });
      // Arrays that are rendered via .map
      [
        "ribbons","services","hospitalDepts","process","plans","travelBullets","policyLinksGroups","eligibleGroups",
      ].forEach((k) => {
        console.assert(Array.isArray(locales.zh?.[k]), `zh.${k} should be an array`);
        console.assert(Array.isArray(locales.en?.[k]), `en.${k} should be an array`);
      });
      // Countries groups have region & list
      (Array.isArray(locales.zh.eligibleGroups) ? locales.zh.eligibleGroups : []).forEach((g) => {
        console.assert(!!g.region && Array.isArray(g.countries) && g.countries.length > 0, "eligibleGroups items must have region & countries");
      });
      // Basic web API availability
      console.assert(typeof fetch === 'function', 'fetch should be available');
      // Chart datasets
      console.assert(case1Cost.length && case1Time.length && case2Time.length, 'Chart datasets should be non-empty');
      console.groupEnd();
    } catch (e) {
      console.error("Smoke tests failed:", e);
    }
  }, [lang]);

  const Section = ({ id, children }) => (
    <section id={id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">{children}</section>
  );

  const Card = ({ children }) => (
    <div className="rounded-2xl border border-gray-200 shadow-sm p-6 bg-white/80 backdrop-blur">{children}</div>
  );

  const Timeline = ({ items = [] }) => (
    <ol className="relative border-s border-slate-200 ml-2">
      {(Array.isArray(items) ? items : []).map((it, idx) => (
        <li key={idx} className="ms-6 mb-4">
          <span className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-slate-800"></span>
          <div className="text-sm font-medium">{it.title}</div>
          <div className="text-xs text-slate-500">{it.time}</div>
          {it.note && <div className="text-xs text-slate-600 mt-1">{it.note}</div>}
        </li>
      ))}
    </ol>
  );

  // --- Submit helper ---
  const submitForm = async () => {
    if (!form.name || !form.email) return false;
    if (form.hp) return true; // honeypot filled -> treat as OK without sending
    const payload = {
      ...form,
      lang,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof location !== 'undefined' ? location.href : 'unknown',
      ts: new Date().toISOString(),
    };
    try {
      setSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSubmitting(false);
      return res.ok;
    } catch (e) {
      setSubmitting(false);
      console.error('submit error', e);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="font-bold text-xl tracking-tight">{t.brand}</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#services" className="hover:text-slate-900">{t.nav?.services || "Services"}</a>
            <a href="#hospitals" className="hover:text-slate-900">{t.nav?.hospitals || "Hospitals"}</a>
            <a href="#process" className="hover:text-slate-900">{t.nav?.process || "Process"}</a>
            <a href="#pricing" className="hover:text-slate-900">{t.nav?.pricing || "Pricing"}</a>
            <a href="#travel" className="hover:text-slate-900">{t.nav?.travel || "Travel"}</a>
            <a href="#policy" className="hover:text-slate-900">{t.nav?.policy || "TWOV"}</a>
            <a href="#cases" className="hover:text-slate-900">{t.nav?.cases || "Cases"}</a>
            <a href="#faq" className="hover:text-slate-900">{t.nav?.faq || "FAQ"}</a>
            <a href="#contact" className="hover:text-slate-900">{t.nav?.contact || "Contact"}</a>
          </nav>
          <button
            onClick={() => setLang((p) => (p === "zh" ? "en" : "zh"))}
            className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-slate-50"
          >
            {t.switch || (lang === "zh" ? "EN" : "中文")}
          </button>
        </div>
      </header>

      {/* HERO */}
      <Section id="hero">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">{t.tagline}</h1>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">{t.subTagline}</p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <a href="#contact" className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-slate-900 text-white hover:bg-slate-800">{t.ctaPrimary}</a>
              <a href="#process" className="inline-flex items-center justify-center rounded-xl px-5 py-3 border hover:bg-white">{t.ctaSecondary}</a>
              <a href="#policy" className="inline-flex items-center justify-center rounded-xl px-5 py-3 border hover:bg-white">{t.ctaPolicy}</a>
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {(Array.isArray(t.ribbons) ? t.ribbons : []).map((r, i) => (
                <div key={i} className="rounded-lg border p-3 bg-white/70">
                  <span className="block leading-snug">{r}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-500">{t.trustBlurb}</p>
          </div>
          <div>
            <div className="relative rounded-3xl border shadow-sm p-6 overflow-hidden bg-white/80">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-slate-100 blur-3xl" />
              <div className="grid grid-cols-2 gap-4">
                {["CT/MRI", "Labs", "Checkups", "Escort", "Transl.", "MDT"].map((k, i) => (
                  <div key={i} className="h-24 rounded-2xl border flex items-center justify-center text-sm bg-white">{k}</div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">* {(Array.isArray(t.ribbons) ? t.ribbons : [])[0]}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="services">
        <h2 className="text-2xl font-bold mb-6">{t.servicesTitle}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(t.services) ? t.services : []).map((s, i) => (
            <Card key={i}>
              <div className="text-lg font-semibold">{s.title}</div>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* HOSPITALS */}
      <Section id="hospitals">
        <h2 className="text-2xl font-bold mb-6">{t.hospitalTitle}</h2>
        <Card>
          <ul className="grid sm:grid-cols-2 gap-3 list-disc pl-5">
            {(Array.isArray(t.hospitalDepts) ? t.hospitalDepts : []).map((x, i) => (
              <li key={i} className="text-sm">{x}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">{t.hospitalNote}</p>
        </Card>
      </Section>

      {/* PROCESS */}
      <Section id="process">
        <h2 className="text-2xl font-bold mb-6">{t.processTitle}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(Array.isArray(t.process) ? t.process : []).map((p, i) => (
            <Card key={i}>
              <div className="text-4xl font-black text-slate-300">{p.step}</div>
              <div className="mt-2 text-lg font-semibold">{p.title}</div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* POLICY 240h TWOV */}
      <Section id="policy">
        <h2 className="text-2xl font-bold mb-2">{lang === 'zh' ? '来华240小时过境免签（要点）' : 'Transit‑Without‑Visa 240h (Key Points)'}</h2>
        <Card>
          <ul className="grid sm:grid-cols-2 gap-3 list-disc pl-5 text-sm">
            {lang === 'zh' ? (
              <>
                <li>对象：符合条件国家/地区旅客，在中国指定口岸实施的过境免签（部分城市/省份支持）。</li>
                <li>要求：必须为“第三国/地区”联程行程，持有离境已确认、在240小时内的机票（或船、车），在指定区域活动。</li>
                <li>口岸与停留范围：以当地出入境管理部门发布为准，通常需在入境口岸所在省/市范围内活动。</li>
                <li>证件：有效期充足的护照，入境时接受边检审核并按规定办理住宿登记。</li>
                <li>注意：政策口岸、适用国别与时限可能调整；赴医前请与航空公司/中国驻外使领馆/边检确认最新要求。</li>
              </>
            ) : (
              <>
                <li>Who: Eligible nationals transiting via designated Chinese ports; availability varies by city/province.</li>
                <li>Condition: true third‑country itinerary with a confirmed onward ticket departing within 240 hours; stay within the permitted region.</li>
                <li>Ports & Region: follow local immigration rules; activities usually limited to the province/municipality of entry.</li>
                <li>Docs: valid passport; immigration inspection upon entry; complete hotel/temporary residence registration as required.</li>
                <li>Note: policies/ports/eligible countries may change—confirm with airline/Chinese embassy/immigration before travel.</li>
              </>
            )}
          </ul>
          <p className="mt-4 text-xs text-slate-500">{lang === 'zh' ? '＊以上仅为服务引导信息，非官方签证建议与保证；以官方发布与口岸执行为准。' : '*Info for guidance only, not visa advice or guarantee; subject to official rules at ports of entry.'}</p>
        </Card>

        {/* Eligible countries toggle */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">{t.policyEligibleTitle}</h3>
            <button
              onClick={() => setShowCountries((v) => !v)}
              className="text-sm px-4 py-2 rounded-xl border bg-white hover:bg-slate-50"
              aria-expanded={showCountries}
              aria-controls="eligible-countries"
            >
              {showCountries ? t.policyEligibleBtnHide : t.policyEligibleBtnShow}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t.policyEligibleNote}</p>
          {showCountries && (
            <div id="eligible-countries" className="mt-4 grid md:grid-cols-2 gap-4">
              {(Array.isArray(t.eligibleGroups) ? t.eligibleGroups : []).map((g, idx) => (
                <Card key={idx}>
                  <div className="font-medium mb-2">{g.region}</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {(Array.isArray(g.countries) ? g.countries : []).map((c, j) => (
                      <li key={j}>{c}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Official links + consult CTA */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">{t.policyLinksTitle}</h3>
          <p className="text-sm text-slate-600 mb-4">{t.policyLinksDesc}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {(Array.isArray(t.policyLinksGroups) ? t.policyLinksGroups : []).map((g, idx) => (
              <Card key={idx}>
                <div className="font-medium mb-2">{g.city}</div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {(Array.isArray(g.links) ? g.links : []).map((l, j) => (
                    <li key={j}><a className="underline" href={l.href} target="_blank" rel="noreferrer">{l.name}</a></li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <a href="#contact" className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-slate-900 text-white hover:bg-slate-800">{t.policyCTA}</a>
          </div>
        </div>
      </Section>

      {/* CASES with timeline & charts */}
      <Section id="cases">
        <h2 className="text-2xl font-bold mb-6">{t.casesTitle}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <div className="text-lg font-semibold">{lang === 'zh' ? '客户1｜急性阑尾炎（巴黎 → 中国）' : 'Case 1 | Acute Appendicitis (Paris → China)'}</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {lang === 'zh'
                ? '客户在巴黎安排手术需排队约2周。通过我们协调，从首次咨询到完成就医仅用48小时，并使用来华240小时免签入境。最终医疗费用约为巴黎报价的1/3，即便加上往返机票与住宿，整体成本与时间仍显著节省。'
                : 'In Paris, surgery wait was about 2 weeks. With our coordination, the client completed consultation‑to‑care in 48 hours using the 240‑hour TWOV. Total medical cost was ~one‑third of Paris quotes; even including flights and lodging, overall time and cost were significantly reduced.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={case1Cost}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-xs text-slate-500 mt-1">{lang === 'zh' ? '费用对比（相对值：巴黎=3，中国=1）' : 'Cost ratio (Paris=3, China=1)'}</div>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={case1Time} dataKey="value" nameKey="name" outerRadius={60} label>
                      {case1Time.map((_, i) => (
                        <Cell key={i} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-xs text-slate-500 mt-1">{lang === 'zh' ? '时间对比（14天 vs 48小时）' : 'Time: 14 days vs 48 hours'}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">{lang === 'zh' ? '时间轴' : 'Timeline'}</div>
              <Timeline
                items={[
                  { title: lang === 'zh' ? 'T‑48h：初次咨询' : 'T‑48h: Initial inquiry', time: lang === 'zh' ? '提交病历资料' : 'Submit records' },
                  { title: lang === 'zh' ? 'T‑36h：确认方案与航班' : 'T‑36h: Plan & flight confirmed', time: lang === 'zh' ? '240小时免签准备' : 'Prepare TWOV' },
                  { title: lang === 'zh' ? 'T‑24h：落地与陪同' : 'T‑24h: Arrival & escort', time: lang === 'zh' ? '入院检查' : 'Hospital check-in' },
                  { title: lang === 'zh' ? 'T‑0：完成就医' : 'T‑0: Care completed', time: lang === 'zh' ? '术后随访安排' : 'Post-care follow-up' },
                ]}
              />
            </div>
          </Card>

          <Card>
            <div className="text-lg font-semibold">{lang === 'zh' ? '客户2｜入职体检（芬兰暑期 → 北京）' : 'Case 2 | Pre‑employment Checkup (Finland summer → Beijing)'}</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {lang === 'zh'
                ? '客户在芬兰暑期面临医疗资源紧张、需多家医院跑腿。我们基于240小时免签方案安排其来华，当天完成全部体检项目；第3天出具完整报告。客户在华停留7天顺便在北京旅游，效率与体验远优于当地方案。'
                : 'During summer in Finland, capacity was limited and required multiple clinics. Under the 240‑hour TWOV plan, all tests were completed on day 1 in China; full reports were delivered on day 3. The client stayed 7 days and enjoyed sightseeing in Beijing.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={case2Time}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-xs text-slate-500 mt-1">{lang === 'zh' ? '时效：到华当天体检，3天出报告' : 'Timing: Day 1 tests, Day 3 report'}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">{lang === 'zh' ? '时间轴' : 'Timeline'}</div>
              <Timeline
                items={[
                  { title: lang === 'zh' ? 'T‑7天：提交体检清单' : 'T‑7d: Submit checklist', time: lang === 'zh' ? '排期确认' : 'Scheduling confirmed' },
                  { title: lang === 'zh' ? 'T‑0：落地即体检' : 'T‑0: Same-day checkups', time: lang === 'zh' ? '全部项目完成' : 'All tests completed' },
                  { title: lang === 'zh' ? 'T+3天：报告出具' : 'T+3d: Reports ready', time: lang === 'zh' ? '远程解读' : 'Remote explanation' },
                  { title: lang === 'zh' ? 'T+7天：返程' : 'T+7d: Return flight', time: lang === 'zh' ? '北京旅游结束' : 'Beijing tour finished' },
                ]}
              />
            </div>
          </Card>
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing">
        <h2 className="text-2xl font-bold mb-6">{t.pricingTitle}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(Array.isArray(t.plans) ? t.plans : []).map((p, i) => (
            <Card key={i}>
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="mt-1 text-3xl font-extrabold">{p.price}</div>
              <ul className="mt-4 space-y-2 text-sm">
                {(Array.isArray(p.items) ? p.items : []).map((it, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-800" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">{t.pricingNote}</p>
      </Section>

      {/* TRAVEL */}
      <Section id="travel">
        <h2 className="text-2xl font-bold mb-6">{t.travelTitle}</h2>
        <Card>
          <ul className="grid sm:grid-cols-2 gap-3 list-disc pl-5 text-sm">
            {(Array.isArray(t.travelBullets) ? t.travelBullets : []).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Card>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <h2 className="text-2xl font-bold mb-6">{t.faqTitle}</h2>
        <div className="space-y-4">
          {(Array.isArray(t.faqs) ? t.faqs : []).map((f, i) => (
            <Card key={i}>
              <div className="font-semibold">{f.q}</div>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact">
        <h2 className="text-2xl font-bold mb-2">{t.contactTitle}</h2>
        <p className="text-sm text-slate-600 mb-6">{t.contactBlurb}</p>
        <Card>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!form.name || !form.email) return alert(lang === 'zh' ? '请填写姓名和邮箱' : 'Please fill in name and email');
              setSubmitting(true);
              const ok = await submitForm();
              setSubmitting(false);
              if (ok) {
                alert(t.submitOk);
                setForm({ name: '', email: '', phone: '', country: '', need: '', twov: false, hp: '' });
              } else {
                alert(t.submitFail);
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required placeholder={t.form?.name || 'Name'} className="border rounded-xl p-3 w-full" />
            <input value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required type="email" placeholder={t.form?.email || 'Email'} className="border rounded-xl p-3 w-full" />
            <input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} placeholder={t.form?.phone || 'Phone'} className="border rounded-xl p-3 w-full" />
            <input value={form.country} onChange={(e)=>setForm({...form, country:e.target.value})} placeholder={t.form?.country || 'Country/Region'} className="border rounded-xl p-3 w-full" />
            {/* Honeypot */}
            <input value={form.hp} onChange={(e)=>setForm({...form, hp:e.target.value})} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input id="twov-checkbox" type="checkbox" className="h-4 w-4" checked={form.twov} onChange={(e)=>setForm({...form, twov:e.target.checked})} />
              <span>{t.form?.twov || 'Request 240h TWOV assessment'}</span>
            </label>
            <textarea value={form.need} onChange={(e)=>setForm({...form, need:e.target.value})} placeholder={t.form?.need || 'Brief needs'} className="md:col-span-2 border rounded-xl p-3 w-full h-28" />
            <div className="md:col-span-2">
              <button disabled={submitting} className="w-full md:w-auto rounded-xl px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? (lang === 'zh' ? '提交中…' : 'Submitting…') : (t.form?.submit || 'Submit')}
              </button>
            </div>
          </form>
          {/* Developer note: Deploy the Pages Function below at /functions/api/contact.ts to enable emailing. */}
        </Card>
        <p className="mt-4 text-xs text-slate-500 leading-relaxed">{t.legal}</p>
      </Section>

      {/* FOOTER */}
      <footer className="border-t bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div>{t.footer}</div>
          <div className="text-slate-500">Email: machao2024.996@gmail.com · WhatsApp: +86‑000‑000‑0000</div>
        </div>
      </footer>

      {/* --- Cloudflare Pages Function (copy to /functions/api/contact.ts) ---
      import type { Env } from 'hono';

      export const onRequestPost: PagesFunction = async ({ request, env }) => {
        try {
          const data = await request.json();
          // Basic validation
          if (!data?.email || !data?.name) {
            return new Response('Bad Request', { status: 400 });
          }

          // Compose email via MailChannels
          // Docs: https://github.com/mailchannels/mailchannels-api
          const mail = {
            personalizations: [
              {
                to: [{ email: env.SITE_EMAIL_TO || 'machao2024.996@gmail.com' }],
              },
            ],
            from: {
              email: env.SITE_EMAIL_FROM || 'noreply@medibridge.global',
              name: 'MediBridge Global',
            },
            subject: `New inquiry from ${data.name}`,
            content: [
              {
                type: 'text/plain',
                value: `Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || ''}
Country: ${data.country || ''}
TWOV: ${data.twov ? 'Yes' : 'No'}
Lang: ${data.lang}
UA: ${data.userAgent}
URL: ${data.url}
Time: ${data.ts}
---
Need: ${data.need || ''}`,
              },
            ],
          };

          const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(mail),
          });

          if (!resp.ok) {
            const msg = await resp.text();
            return new Response('Mail send failed: ' + msg, { status: 500 });
          }
          return new Response('OK');
        } catch (e) {
          return new Response('Server error', { status: 500 });
        }
      };

      // Bind the following environment variables in Cloudflare Pages -> Settings -> Functions -> Environment variables:
      // SITE_EMAIL_TO: your destination mailbox
      // SITE_EMAIL_FROM: from address under your domain with Cloudflare Email Routing or a verified sender
      --- */}
    </div>
  );
}
