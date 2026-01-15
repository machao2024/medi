# MediBridge Global — Cloudflare Pages 部署包

这是一个 **Cloudflare Pages 即开即用** 的单页 React 网站，内置：
- 240 小时过境免签（TWOV）要点 + 国家列表折叠
- 客户案例 + Recharts 图表
- 表单提交到 **/api/contact**（Pages Functions + MailChannels 发邮件）

## 目录结构
```
.
├─ functions/
│  └─ api/
│     └─ contact.ts      # 处理表单并通过 MailChannels 发邮件
├─ src/
│  ├─ App.jsx            # 你的单页站点（最新画布版本）
│  └─ main.jsx
├─ index.html            # 引入 Tailwind CDN
├─ package.json          # 使用 Vite 构建
├─ vite.config.js
└─ README.md
```

## 本地开发
```bash
pnpm i   # 或 npm i / yarn
pnpm dev # 或 npm run dev / yarn dev
```
在浏览器打开 `http://localhost:5173`。

## Cloudflare Pages 部署
1. 新建 Pages 项目 → 连接到你的仓库（或手动上传本包）
2. Build command: `pnpm build`（或 `npm run build` / `yarn build`）
3. Build output directory: `dist`
4. **Functions** 自动生效（`functions/api/contact.ts` 会作为 `/api/contact` 路由）

### 环境变量（Pages → Settings → Functions → Environment variables）
- `SITE_EMAIL_TO`：收件邮箱（默认回退 `machao2024.996@gmail.com`）
- `SITE_EMAIL_FROM`：建议使用你域名下的地址（如 `noreply@yourdomain.com`），并在 Cloudflare Email Routing 或发信域验证

> 提示：Cloudflare 默认使用 **MailChannels** 出站，无需第三方库。若你的域名未授权 MailChannels，可能被退信，请确保发信域通过验证。

## 自定义
- 页脚展示邮箱：`src/App.jsx` 内搜索 `Email:`。
- 口岸/政策链接：在 `policyLinksGroups` 内替换 `#` 为官方 URL。
- 需要开启 **Turnstile** 验证、KV 存储备份、自动回复等，请联系我，我会给你补充相应代码片段。
