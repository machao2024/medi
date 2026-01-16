import React, { useMemo, useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Single-file React landing page (Canvas preview ready)
// Robust against undefined data by defensive mapping + smoke tests
// Sections: Services, Hospitals, Process, 240h TWOV Policy (+official links + eligible countries toggle), Case Studies (+timeline & charts), Pricing, Travel, FAQ, Contact (+TWOV checkbox)

export default function MediBridgeGlobal() {
  const [lang, setLang] = useState("en");
  const [showCountries, setShowCountries] = useState(false); // default hidden
  const [submitting, setSubmitting] = useState(false);

  // --- Contact form refs (uncontrolled) ---
  const formRef = useRef(null);
  const twovRef = useRef(null);

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
      contactMethods: {
        title: "其他联系方式",
        email: "邮箱",
        whatsapp: "WhatsApp",
        wechat: "微信",
      },
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
      contactBlurb: "Share your needs and we'll reach out within 72 hours via email/WhatsApp for an intro call.",
      contactMethods: {
        title: "Other Contact Methods",
        email: "Email",
        whatsapp: "WhatsApp",
        wechat: "WeChat",
      },
      form: { name: "Full Name", email: "Email", phone: "WhatsApp/Phone (optional)", country: "Country/Region", need: "Brief needs (dept/checks/condition)", twov: "Request 240h TWOV assessment", submit: "Submit Inquiry" },
      legal: "Disclaimer: We are not a medical provider. We do not diagnose, treat, or prescribe. Timelines and prices are indicative only; actuals depend on hospitals. Consult licensed clinicians for medical decisions.",
      footer: "© " + new Date().getFullYear() + " MediBridge Global. All rights reserved.",
      switch: "中文",
      submitOk: "Thanks! We will contact you soon.",
      submitFail: "Submission failed. Please try again later or email us directly.",
    };

    const fr = {
      brand: "MediBridge Global",
      tagline: "Coordination médicale complète en Chine",
      subTagline: "Planification rapide · Tarifs transparents · Interprétation professionnelle · Conformité · Accompagnement de bout en bout",
      ctaPrimary: "Obtenir un plan et devis",
      ctaSecondary: "Voir comment ça marche",
      ctaPolicy: "En savoir plus sur le TWOV 240h",
      nav: {
        services: "Services",
        hospitals: "Hôpitaux",
        process: "Processus",
        pricing: "Tarifs",
        travel: "Visa & Voyage",
        policy: "TWOV 144/240h",
        cases: "Études de cas",
        faq: "FAQ",
        contact: "Contact",
      },
      ribbons: [
        "Plan proposé sous 72h*",
        "Planification et estimations réelles",
        "Interprétation médicale EN/ZH/JP",
        "Nous coordonnons, pas de diagnostic ni traitement",
      ],
      trustBlurb:
        "Nous collaborons avec les principaux hôpitaux chinois/centres internationaux, spécialisés en imagerie, bilans de santé, consultations spécialisées et seconds avis.",
      servicesTitle: "Nos Services",
      services: [
        { title: "Planification accélérée", desc: "Coordination prioritaire pour CT/IRM/Échographie, analyses de laboratoire, bilans de santé et cliniques spécialisées." },
        { title: "Interprétation médicale", desc: "Traduction professionnelle sur place et écrite (EN/ZH/JP), y compris notes de consultation et suivis." },
        { title: "Plan & Estimations de coûts", desc: "Plusieurs options d'hôpitaux avec délais et fourchettes budgétaires—sans engagement." },
        { title: "Voyage & Accompagnement", desc: "Conseils visa, transfert aéroport, accompagnement clinique, pharmacie et suivi après visite." },
        { title: "Second avis / MDT", desc: "Préparation de dossier pour examens multidisciplinaires et avis écrits structurés." },
        { title: "Confidentialité & Conformité", desc: "Minimisation des données, NDA, transfert crypté et processus de consentement clairs." },
      ],
      hospitalTitle: "Affiliations (Exemples)",
      hospitalNote: "Les départements listés sont des exemples uniquement; l'accès réel dépend de la capacité et des accréditations. Aucune garantie de résultat.",
      hospitalDepts: [
        "Imagerie: CT · IRM · TEP/CT · Échographie",
        "Centres de bilan: forfaits basiques/avancés",
        "Spécialités majeures: Oncologie/Cardiologie/Orthopédie/Gastro/Pédiatrie",
        "Centres internationaux pour expatriés et visiteurs",
      ],
      processTitle: "Comment ça marche",
      process: [
        { step: "1", title: "Découverte & Dossiers", text: "Appel d'introduction; collecte des notes, scans et rapports de laboratoire antérieurs (copies ou numériques)." },
        { step: "2", title: "Options & Estimations", text: "1-3 options d'hôpital/département avec délais et fourchettes budgétaires." },
        { step: "3", title: "Accord de service & Confidentialité", text: "Signature du périmètre (non-clinique), grille tarifaire et politique d'annulation." },
        { step: "4", title: "Planification & Visa/Voyage", text: "Fourniture des détails d'invitation, conseils d'itinéraire et d'hôtel, logistique locale." },
        { step: "5", title: "Accompagnement sur place", text: "Aide à l'enregistrement, paiements, interprétation et coordination des tests supplémentaires." },
        { step: "6", title: "Résultats & Suivi", text: "Traduction des rapports, explication des résultats et organisation des suivis si nécessaire." },
      ],
      pricingTitle: "Tarifs",
      pricingNote: "Frais de service uniquement—factures d'hôpital, visa, vols et hôtels sont séparés et payés aux prestataires.",
      plans: [
        { name: "Bilan & Imagerie", price: "299$+", items: ["Planification & accompagnement (une ville)", "Traduction jusqu'à 3 rapports", "Un appel de suivi"] },
        { name: "Visite spécialisée", price: "699$+", items: ["Réservation clinique & interprétation sur place", "Traduction écrite (demi-journée)", "Estimations multi-options & conseils d'itinéraire"] },
        { name: "Second avis / MDT", price: "499$+", items: ["Préparation et soumission du dossier", "Traduction de l'avis écrit", "Un tour de clarification"] },
      ],
      travelTitle: "Notes Visa & Voyage",
      travelBullets: [
        "Visa: choisir le type selon la nationalité; préparer les documents requis.",
        "Vols: préférer direct/≤2 escales; apporter dossiers imprimés et numériques.",
        "Séjour: 5-15 min de l'hôpital à pied/métro; chambres familiales disponibles.",
        "Assurance: envisager couverture médicale voyage et modification.",
      ],
      policyLinksTitle: "Politique officielle & Info ports (liste exemple)",
      policyLinksDesc: "Points d'entrée exemples uniquement—suivre les autorités d'immigration/ports locaux pour les dernières règles.",
      policyLinksGroups: [
        { city: "Pékin", links: [{ name: "Info immigration port Capital", href: "#" }] },
        { city: "Shanghai", links: [{ name: "Info immigration port Pudong/Hongqiao", href: "#" }] },
        { city: "Guangdong (Guangzhou/Shenzhen)", links: [{ name: "Avis immigration Guangdong", href: "#" }] },
        { city: "Sichuan (Chengdu)", links: [{ name: "Info immigration port Chengdu", href: "#" }] },
        { city: "Fujian (Xiamen)", links: [{ name: "Info immigration port Xiamen", href: "#" }] },
        { city: "Shandong (Qingdao)", links: [{ name: "Info immigration port Qingdao", href: "#" }] },
      ],
      policyEligibleTitle: "Pays éligibles TWOV 240h (55, masqué par défaut)",
      policyEligibleBtnShow: "Afficher les pays",
      policyEligibleBtnHide: "Masquer les pays",
      policyEligibleNote: "* Fourni par le client; suivre les autorités d'immigration chinoises pour les listes officielles.",
      eligibleGroups: [
        {
          region: "Europe (40)",
          countries: [
            "Autriche","Belgique","République tchèque","Danemark","Estonie","Finlande","France","Allemagne","Grèce","Hongrie","Islande","Italie","Lettonie","Lituanie","Luxembourg","Malte","Pays-Bas","Pologne","Portugal","Slovaquie","Slovénie","Espagne","Suède","Suisse","Monaco","Russie","Royaume-Uni","Irlande","Chypre","Bulgarie","Roumanie","Ukraine","Serbie","Croatie","Bosnie-Herzégovine","Monténégro","Macédoine du Nord","Albanie","Biélorussie","Norvège"
          ]
        },
        {
          region: "Amériques (6)",
          countries: ["États-Unis","Canada","Brésil","Mexique","Argentine","Chili"]
        },
        {
          region: "Océanie (2)",
          countries: ["Australie","Nouvelle-Zélande"]
        },
        {
          region: "Asie (7)",
          countries: ["Corée du Sud","Japon","Singapour","Brunei","Émirats arabes unis","Qatar","Indonésie"]
        }
      ],
      policyCTA: "Consulter TWOV maintenant",
      casesTitle: "Études de cas (anonymisées avec consentement)",
      contactTitle: "Contactez-nous",
      contactBlurb: "Partagez vos besoins et nous vous contacterons sous 72 heures par email/WhatsApp pour un appel d'introduction.",
      contactMethods: {
        title: "Autres moyens de contact",
        email: "Email",
        whatsapp: "WhatsApp",
        wechat: "WeChat",
      },
      form: { name: "Nom complet", email: "Email", phone: "WhatsApp/Téléphone (optionnel)", country: "Pays/Région", need: "Besoins brefs (département/examens/condition)", twov: "Demande d'évaluation TWOV 240h", submit: "Soumettre la demande" },
      legal: "Avertissement: Nous ne sommes pas un prestataire médical. Nous ne diagnostiquons, traitons ni prescrivons pas. Les délais et prix sont indicatifs uniquement; les réels dépendent des hôpitaux. Consultez des cliniciens agréés pour les décisions médicales.",
      footer: "© " + new Date().getFullYear() + " MediBridge Global. Tous droits réservés.",
      switch: "FR",
      submitOk: "Merci! Nous vous contacterons bientôt.",
      submitFail: "Échec de soumission. Veuillez réessayer plus tard ou nous contacter par email.",
    };

    const pt = {
      brand: "MediBridge Global",
      tagline: "Coordenação médica completa na China",
      subTagline: "Agendamento rápido · Preços transparentes · Interpretação profissional · Conformidade · Suporte completo",
      ctaPrimary: "Obter plano e orçamento",
      ctaSecondary: "Veja como funciona",
      ctaPolicy: "Saiba mais sobre TWOV 240h",
      nav: {
        services: "Serviços",
        hospitals: "Hospitais",
        process: "Processo",
        pricing: "Preços",
        travel: "Visto & Viagem",
        policy: "TWOV 144/240h",
        cases: "Casos",
        faq: "FAQ",
        contact: "Contato",
      },
      ribbons: [
        "Plano proposto em 72h*",
        "Agendamento e estimativas reais",
        "Interpretação médica EN/ZH/JP",
        "Coordenamos, não diagnosticamos nem tratamos",
      ],
      trustBlurb:
        "Fazemos parceria com os principais hospitais chineses/centros internacionais, focando em imagens, check-ups, visitas especializadas e segundas opiniões.",
      servicesTitle: "O que fazemos",
      services: [
        { title: "Agendamento acelerado", desc: "Coordenação prioritária para CT/MRI/Ultrassom, exames laboratoriais, check-ups e clínicas especializadas." },
        { title: "Interpretação médica", desc: "Tradução profissional presencial e escrita (EN/ZH/JP), incluindo notas de consulta e acompanhamentos." },
        { title: "Plano & Estimativas de custos", desc: "Múltiplas opções de hospital com prazos e faixas de orçamento—sem compromisso." },
        { title: "Viagem & Acompanhamento", desc: "Orientação de visto, transfer do aeroporto, acompanhamento na clínica, farmácia e suporte pós-visita." },
        { title: "Segunda opinião / MDT", desc: "Curadoria de casos para análises multidisciplinares e pareceres escritos estruturados." },
        { title: "Privacidade & Conformidade", desc: "Minimização de dados, NDA, transferência criptografada e fluxos de consentimento claros." },
      ],
      hospitalTitle: "Afiliações (Exemplos)",
      hospitalNote: "Departamentos listados são apenas exemplos; acesso real depende de capacidade e credenciais. Sem garantias de resultado.",
      hospitalDepts: [
        "Imagem: CT · MRI · PET/CT · Ultrassom",
        "Centros de Check-up: pacotes básicos/avançados",
        "Especialidades principais: Oncologia/Cardiologia/Ortopedia/GI/Pediatria",
        "Centros internacionais para expatriados e visitantes",
      ],
      processTitle: "Como funciona",
      process: [
        { step: "1", title: "Descoberta & Registros", text: "Chamada introdutória; coleta de notas, exames e relatórios anteriores (cópias ou digitais)." },
        { step: "2", title: "Opções & Estimativas", text: "1-3 opções de hospital/departamento com prazos e faixas de orçamento." },
        { step: "3", title: "Acordo de serviço & Privacidade", text: "Assinar escopo (não-clínico), tabela de preços e política de cancelamento." },
        { step: "4", title: "Agendamento & Visto/Viagem", text: "Fornecer detalhes do convite, dicas de rota e hotel, logística local." },
        { step: "5", title: "Acompanhamento presencial", text: "Orientação de check-in, pagamentos, interpretação e coordenação de exames adicionais." },
        { step: "6", title: "Resultados & Acompanhamento", text: "Traduzir relatórios, explicar resultados e organizar acompanhamentos conforme necessário." },
      ],
      pricingTitle: "Preços",
      pricingNote: "Apenas taxas de serviço—contas hospitalares, visto, voos e hotéis são separados e pagos aos fornecedores.",
      plans: [
        { name: "Check-up & Imagem", price: "$299+", items: ["Agendamento & acompanhamento (uma cidade)", "Tradução de até 3 relatórios", "Uma chamada de acompanhamento"] },
        { name: "Visita especializada", price: "$699+", items: ["Reserva de clínica & interpretação presencial", "Tradução escrita (meio dia)", "Estimativas multi-opções & dicas de itinerário"] },
        { name: "Segunda opinião / MDT", price: "$499+", items: ["Curadoria e submissão de caso", "Tradução do parecer escrito", "Uma rodada de esclarecimento"] },
      ],
      travelTitle: "Notas de Visto & Viagem",
      travelBullets: [
        "Visto: escolher tipo por nacionalidade; preparar documentos necessários.",
        "Voos: preferir direto/≤2 escalas; trazer registros impressos e digitais.",
        "Estadia: 5-15 min do hospital a pé/metrô; quartos familiares disponíveis.",
        "Seguro: considerar cobertura médica de viagem e alterações.",
      ],
      policyLinksTitle: "Política oficial & Info de portos (lista exemplo)",
      policyLinksDesc: "Pontos de entrada apenas como exemplo—seguir autoridades de imigração/portos locais para as últimas regras.",
      policyLinksGroups: [
        { city: "Pequim", links: [{ name: "Info imigração porto Capital", href: "#" }] },
        { city: "Xangai", links: [{ name: "Info imigração porto Pudong/Hongqiao", href: "#" }] },
        { city: "Guangdong (Guangzhou/Shenzhen)", links: [{ name: "Avisos imigração Guangdong", href: "#" }] },
        { city: "Sichuan (Chengdu)", links: [{ name: "Info imigração porto Chengdu", href: "#" }] },
        { city: "Fujian (Xiamen)", links: [{ name: "Info imigração porto Xiamen", href: "#" }] },
        { city: "Shandong (Qingdao)", links: [{ name: "Info imigração porto Qingdao", href: "#" }] },
      ],
      policyEligibleTitle: "Países elegíveis TWOV 240h (55, oculto por padrão)",
      policyEligibleBtnShow: "Mostrar países",
      policyEligibleBtnHide: "Ocultar países",
      policyEligibleNote: "* Fornecido pelo cliente; seguir autoridades de imigração chinesas para listas oficiais.",
      eligibleGroups: [
        {
          region: "Europa (40)",
          countries: [
            "Áustria","Bélgica","República Tcheca","Dinamarca","Estônia","Finlândia","França","Alemanha","Grécia","Hungria","Islândia","Itália","Letônia","Lituânia","Luxemburgo","Malta","Países Baixos","Polônia","Portugal","Eslováquia","Eslovênia","Espanha","Suécia","Suíça","Mônaco","Rússia","Reino Unido","Irlanda","Chipre","Bulgária","Romênia","Ucrânia","Sérvia","Croácia","Bósnia e Herzegovina","Montenegro","Macedônia do Norte","Albânia","Bielorrússia","Noruega"
          ]
        },
        {
          region: "Américas (6)",
          countries: ["Estados Unidos","Canadá","Brasil","México","Argentina","Chile"]
        },
        {
          region: "Oceania (2)",
          countries: ["Austrália","Nova Zelândia"]
        },
        {
          region: "Ásia (7)",
          countries: ["Coreia do Sul","Japão","Singapura","Brunei","Emirados Árabes Unidos","Catar","Indonésia"]
        }
      ],
      policyCTA: "Consultar TWOV agora",
      casesTitle: "Estudos de caso (anonimizados com consentimento)",
      contactTitle: "Contate-nos",
      contactBlurb: "Compartilhe suas necessidades e entraremos em contato em 72 horas por email/WhatsApp para uma chamada introdutória.",
      contactMethods: {
        title: "Outros meios de contato",
        email: "Email",
        whatsapp: "WhatsApp",
        wechat: "WeChat",
      },
      form: { name: "Nome completo", email: "Email", phone: "WhatsApp/Telefone (opcional)", country: "País/Região", need: "Necessidades breves (departamento/exames/condição)", twov: "Solicitar avaliação TWOV 240h", submit: "Enviar consulta" },
      legal: "Aviso: Não somos um prestador médico. Não diagnosticamos, tratamos nem prescrevemos. Prazos e preços são apenas indicativos; reais dependem dos hospitais. Consulte médicos licenciados para decisões médicas.",
      footer: "© " + new Date().getFullYear() + " MediBridge Global. Todos os direitos reservados.",
      switch: "PT",
      submitOk: "Obrigado! Entraremos em contato em breve.",
      submitFail: "Falha no envio. Por favor, tente novamente mais tarde ou nos contate por email.",
    };

    const la = {
      brand: "MediBridge Global",
      tagline: "Coordinatio medica integra in Sinis",
      subTagline: "Celerior ordinatio · Pretia perspicua · Interpretatio professionalis · Obsequium · Subsidium integrum",
      ctaPrimary: "Consilium et aestimationem obtine",
      ctaSecondary: "Vide quomodo operatur",
      ctaPolicy: "Disce de TWOV 240h",
      nav: {
        services: "Officia",
        hospitals: "Nosocomia",
        process: "Processus",
        pricing: "Pretia",
        travel: "Visa & Iter",
        policy: "TWOV 144/240h",
        cases: "Studia casuum",
        faq: "FAQ",
        contact: "Contactus",
      },
      ribbons: [
        "Consilium propositum intra 72h*",
        "Vera ordinatio et aestimationes",
        "Interpretatio medica EN/ZH/JP",
        "Coordinamus, non diagnosticamus nec tractamus",
      ],
      trustBlurb:
        "Cum praecipuis nosocomiis Sinensibus/centris internationalibus cooperamur, in imaginibus, inspectionibus, visitationibus specialibus et secundis opinionibus versati.",
      servicesTitle: "Quid facimus",
      services: [
        { title: "Ordinatio accelerata", desc: "Coordinatio prioritaria pro CT/MRI/Ultrasonum, probationibus laboratorii, inspectionibus et clinicis specialibus." },
        { title: "Interpretatio medica", desc: "Translatio professionalis in loco et scripta (EN/ZH/JP), inclusis notis consultationis et sequentibus." },
        { title: "Consilium & Aestimationes sumptuum", desc: "Multae optiones nosocomiorum cum temporibus et intervallis impensarum—sine obligatione." },
        { title: "Iter & Comitatus curae", desc: "Consilium visae, exceptio aeroportus, comitatus clinicus, pharmacia et subsidium post visitationem." },
        { title: "Secunda opinio / MDT", desc: "Curatio casuum pro recensionibus multidisciplinaribus et opinionibus scriptis structis." },
        { title: "Privitas & Obsequium", desc: "Minimizatio datorum, NDA, translatio cryptata et processus consensus clari." },
      ],
      hospitalTitle: "Affiliationes (Exempla)",
      hospitalNote: "Departimenta enumerata sunt exempla tantum; accessus realis pendet a capacitate et documentis. Nullae guarantiae exitus.",
      hospitalDepts: [
        "Imagines: CT · MRI · PET/CT · Ultrasonum",
        "Centra inspectionis: fasciculi fundamentales/provecti",
        "Specialitates maiores: Oncologia/Cardiologia/Orthopedia/GI/Pediatria",
        "Centra internationalia pro expatriatis et visitatoribus",
      ],
      processTitle: "Quomodo operatur",
      process: [
        { step: "1", title: "Inventio & Documenta", text: "Vocatio introductoria; collectio notarum, imaginum et relationum laboratoriorum priorum (copiae vel digitales)." },
        { step: "2", title: "Optiones & Aestimationes", text: "1-3 optiones nosocomiorum/departimentorum cum temporibus et intervallis impensarum." },
        { step: "3", title: "Pactum officii & Privitatis", text: "Signare ambitum (non-clinicum), tabulam pretiorum et politicam cancellationis." },
        { step: "4", title: "Ordinatio & Visa/Iter", text: "Praebere detalia invitationis, consilia itineris et hospitii, logistica localia." },
        { step: "5", title: "Comitatus in loco", text: "Directio inscriptionis, solutiones, interpretatio et coordinatio probationum additionalium." },
        { step: "6", title: "Eventus & Sequentia", text: "Translationes relationum, explicatio eventuum et dispositio sequentium si opus est." },
      ],
      pricingTitle: "Pretia",
      pricingNote: "Merces officii tantum—rationes nosocomiorum, visa, volatus et hospitia separata sunt et praestatoribus solvuntur.",
      plans: [
        { name: "Inspectio & Imagines", price: "$299+", items: ["Ordinatio & comitatus (una urbs)", "Translatio usque ad 3 relationes", "Una vocatio sequens"] },
        { name: "Visitatio specialista", price: "$699+", items: ["Reservatio clinica & interpretatio in loco", "Translatio scripta (dimidium diei)", "Aestimationes multi-optionum & consilia itineris"] },
        { name: "Secunda opinio / MDT", price: "$499+", items: ["Curatio et submissio casus", "Translatio opinionis scriptae", "Una series clarificationis"] },
      ],
      travelTitle: "Notae Visae & Itineris",
      travelBullets: [
        "Visa: typum secundum nationalitatem eligere; documenta requisita praeparare.",
        "Volatus: directum/≤2 stationes praeferre; documenta impressa et digitalia afferre.",
        "Mansio: 5-15 min a nosocomio pedibus/metro; conclavia familiaria praesto sunt.",
        "Assecuratio: assecurationem medicam itineris et mutationes considerare.",
      ],
      policyLinksTitle: "Politica officialis & Informatio portuum (index exemplaris)",
      policyLinksDesc: "Puncta ingressus exemplaria tantum—auctoritates immigrationis/portuum locales pro ultimis regulis sequi.",
      policyLinksGroups: [
        { city: "Pechinum", links: [{ name: "Informatio immigrationis portus Capitalis", href: "#" }] },
        { city: "Scianghai", links: [{ name: "Informatio immigrationis portus Pudong/Hongqiao", href: "#" }] },
        { city: "Guangdong (Guangzhou/Shenzhen)", links: [{ name: "Nuntia immigrationis Guangdong", href: "#" }] },
        { city: "Sichuan (Chengdu)", links: [{ name: "Informatio immigrationis portus Chengdu", href: "#" }] },
        { city: "Fujian (Xiamen)", links: [{ name: "Informatio immigrationis portus Xiamen", href: "#" }] },
        { city: "Shandong (Qingdao)", links: [{ name: "Informatio immigrationis portus Qingdao", href: "#" }] },
      ],
      policyEligibleTitle: "Nationes eligibiles TWOV 240h (55, celata per defectum)",
      policyEligibleBtnShow: "Monstra nationes",
      policyEligibleBtnHide: "Cela nationes",
      policyEligibleNote: "* A cliente praebitum; auctoritates immigrationis Sinenses pro indicibus officialibus sequi.",
      eligibleGroups: [
        {
          region: "Europa (40)",
          countries: [
            "Austria","Belgia","Res publica Bohemica","Dania","Estonia","Finnia","Gallia","Germania","Graecia","Hungaria","Islandia","Italia","Lettonia","Lituania","Luxemburgum","Melita","Nederlandia","Polonia","Portugallia","Slovacia","Slovenia","Hispania","Suecia","Helvetia","Monaecum","Russia","Regnum Unitum","Hibernia","Cyprus","Bulgaria","Romania","Ucraina","Serbia","Croatia","Bosnia et Herzegovina","Mons Niger","Macedonia Septentrionalis","Albania","Belorussia","Norvegia"
          ]
        },
        {
          region: "Americae (6)",
          countries: ["Civitates Foederatae","Canada","Brasilia","Mexicum","Argentina","Chilia"]
        },
        {
          region: "Oceania (2)",
          countries: ["Australia","Nova Zelandia"]
        },
        {
          region: "Asia (7)",
          countries: ["Corea Meridionalis","Iaponia","Singapura","Bruneia","Emiratus Arabici Uniti","Quataria","Indonesia"]
        }
      ],
      policyCTA: "Consule TWOV nunc",
      casesTitle: "Studia casuum (anonyma cum consensu)",
      contactTitle: "Contacta nos",
      contactBlurb: "Necessitates tuas communica et te intra 72 horas per email/WhatsApp pro vocatione introductoria contactabimus.",
      contactMethods: {
        title: "Alii modi contactus",
        email: "Email",
        whatsapp: "WhatsApp",
        wechat: "WeChat",
      },
      form: { name: "Nomen plenum", email: "Email", phone: "WhatsApp/Telephonicum (optionale)", country: "Patria/Regio", need: "Necessitates breves (departimentum/probationes/conditio)", twov: "Petitio aestimationis TWOV 240h", submit: "Submitte inquisitionem" },
      legal: "Monitum: Non sumus praestator medicus. Non diagnosticamus, tractamus nec praescribimus. Tempora et pretia indicativa tantum sunt; realia pendent a nosocomiis. Medicos licentiatos pro decisionibus medicis consule.",
      footer: "© " + new Date().getFullYear() + " MediBridge Global. Omnia iura reservata.",
      switch: "LA",
      submitOk: "Gratias! Te mox contactabimus.",
      submitFail: "Submissio defecit. Quaeso iterum postea conare vel nobis per email scribe.",
    };

    return { zh, en, fr, pt, la };
  }, []);

  // Choose current locale safely (fallback to en)
  const t = locales[lang] || locales.en || {};

  // Language options for dropdown
  const langOptions = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "fr", label: "Français" },
    { code: "pt", label: "Português" },
    { code: "la", label: "Latina" },
  ];

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
    if (!formRef.current) return false;
    const formData = new FormData(formRef.current);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const country = formData.get('country');
    const need = formData.get('need');
    const hp = formData.get('hp');
    const twov = twovRef.current?.checked || false;

    if (!name || !email) return false;
    if (hp) return true; // honeypot filled -> treat as OK without sending

    const payload = {
      name, email, phone, country, need, twov, hp,
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
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-slate-50 cursor-pointer"
          >
            {langOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>{opt.label}</option>
            ))}
          </select>
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
            ref={formRef}
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const name = formData.get('name');
              const email = formData.get('email');
              if (!name || !email) return alert(lang === 'zh' ? '请填写姓名和邮箱' : 'Please fill in name and email');
              setSubmitting(true);
              const ok = await submitForm();
              setSubmitting(false);
              if (ok) {
                alert(t.submitOk);
                e.target.reset();
              } else {
                alert(t.submitFail);
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input name="name" onKeyDown={(e)=>{if(e.key==='Enter')e.preventDefault()}} placeholder={t.form?.name || 'Name'} autoComplete="name" className="border rounded-xl p-3 w-full" />
            <input name="email" onKeyDown={(e)=>{if(e.key==='Enter')e.preventDefault()}} type="email" placeholder={t.form?.email || 'Email'} autoComplete="email" className="border rounded-xl p-3 w-full" />
            <input name="phone" onKeyDown={(e)=>{if(e.key==='Enter')e.preventDefault()}} placeholder={t.form?.phone || 'Phone'} autoComplete="tel" className="border rounded-xl p-3 w-full" />
            <input name="country" onKeyDown={(e)=>{if(e.key==='Enter')e.preventDefault()}} placeholder={t.form?.country || 'Country/Region'} autoComplete="country" className="border rounded-xl p-3 w-full" />
            {/* Honeypot */}
            <input name="hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input ref={twovRef} id="twov-checkbox" type="checkbox" className="h-4 w-4" />
              <span>{t.form?.twov || 'Request 240h TWOV assessment'}</span>
            </label>
            <textarea name="need" placeholder={t.form?.need || 'Brief needs'} className="md:col-span-2 border rounded-xl p-3 w-full h-28" />
            <div className="md:col-span-2">
              <button type="submit" disabled={submitting} className="w-full md:w-auto rounded-xl px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? (lang === 'zh' ? '提交中…' : 'Submitting…') : (t.form?.submit || 'Submit')}
              </button>
            </div>
          </form>
          {/* Developer note: Deploy the Pages Function below at /functions/api/contact.ts to enable emailing. */}
        </Card>

        {/* Contact Methods */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">{t.contactMethods?.title || "Other Contact Methods"}</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-sm font-medium">{t.contactMethods?.email || "Email"}</div>
                  <a href="mailto:machao2024.996@gmail.com" className="text-sm text-slate-600 hover:underline">machao2024.996@gmail.com</a>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div>
                  <div className="text-sm font-medium">{t.contactMethods?.whatsapp || "WhatsApp"}</div>
                  <a href="https://wa.me/8613120381582" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:underline">+86 131 2038 1582</a>
                </div>
              </div>
            </Card>
            <Card>
              <div className="relative group">
                <div className="flex items-center gap-3 cursor-pointer">
                  <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 01.176-.553C23.462 18.468 24 16.98 24 15.407c0-3.374-3.056-6.1-7.062-6.449v-.1z"/>
                  </svg>
                  <div>
                    <div className="text-sm font-medium">{t.contactMethods?.wechat || "WeChat"}</div>
                    <span className="text-sm text-slate-600">{lang === 'zh' ? '鼠标悬停查看二维码' : 'Hover to see QR code'}</span>
                  </div>
                </div>
                {/* WeChat QR Code Popup */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                  <div className="bg-white rounded-xl shadow-lg p-4 border">
                    <img src="/wx-qrcode.png" alt="WeChat QR Code" className="w-56 h-56 object-contain" />
                    <p className="text-sm text-center text-slate-500 mt-2">{lang === 'zh' ? '扫码添加微信' : 'Scan to add WeChat'}</p>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 leading-relaxed">{t.legal}</p>
      </Section>

      {/* FOOTER */}
      <footer className="border-t bg-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div>{t.footer}</div>
          <div className="text-slate-500">Email: machao2024.996@gmail.com · WhatsApp: +86 131 2038 1582</div>
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
