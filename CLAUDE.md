# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

MediBridge Global 是一个为 Cloudflare Pages 部署设计的单页 React 网站。它提供海外患者来华就医协调服务的信息，重点介绍 240 小时过境免签（TWOV）政策。

**技术栈：**
- React 18 + Vite 构建系统
- Tailwind CSS（通过 index.html 引入 CDN）
- Recharts 数据可视化
- Cloudflare Pages Functions 无服务器后端
- MailChannels 邮件发送

## 开发命令

### 本地开发
```bash
pnpm dev    # 或: npm run dev / yarn dev
# 在 http://localhost:5173 运行 Vite 开发服务器
```

### 构建
```bash
pnpm build  # 或: npm run build / yarn build
# 输出到 dist/ 目录
```

### 预览构建
```bash
pnpm preview  # 或: npm run preview / yarn preview
# 本地预览生产构建
```

## 架构设计

### 单页应用结构

整个落地页包含在单个 React 组件（`src/App.jsx`）中，包括：
- **双语 i18n 系统**（中文/英文）通过 useMemo 实现的本地化字典
- **多个区块**：服务、合作医院、流程、240小时免签政策、客户案例、价格、签证行程、常见问题、联系我们
- **交互功能**：语言切换、可折叠国家列表、带蜜罐保护的联系表单
- **数据可视化**：使用 Recharts（柱状图、饼图）展示客户案例对比
- **表单提交**：POST 请求到 `/api/contact` 端点

### Cloudflare Pages Functions

`functions/` 目录包含自动部署的无服务器 API 路由：

**`functions/api/contact.ts`**（对外暴露为 `/api/contact`）：
- 处理来自联系表单的 POST 请求
- 验证必填字段（姓名、邮箱）
- 通过 MailChannels API 发送邮件（Cloudflare 默认的出站邮件服务）
- 需要环境变量（在 Cloudflare Pages 控制台设置）：
  - `SITE_EMAIL_TO`：收件邮箱（默认为 machao2024.996@gmail.com）
  - `SITE_EMAIL_FROM`：发件邮箱（应使用域名验证的地址，如 noreply@yourdomain.com）

### 关键设计模式

**防御性数据处理：**
- 辅助函数 `A(v)` 安全地将值转换为数组用于 map
- 所有数组在 map 前都用 `Array.isArray()` 验证
- 本地化回退机制确保翻译缺失时优雅降级

**i18n 实现：**
- 本地化数据存储在 `useMemo` 中以提升性能
- 根据 `lang` 状态选择 `t` 对象
- 所有面向用户的文本从本地化字典中获取

**表单状态管理：**
- 使用单个 `form` 状态对象的受控表单
- 蜜罐字段（`hp`）用于基础机器人防护
- `submitting` 状态防止重复提交

**运行时测试：**
- `useEffect` 钩子在挂载时运行冒烟测试
- 测试验证本地化结构、数组存在性和 API 可用性
- 结果输出到控制台（不阻塞运行）

## 部署到 Cloudflare Pages

1. 在 Cloudflare 控制台创建新的 Pages 项目
2. 连接到此仓库（或手动上传）
3. 构建设置：
   - **构建命令：** `pnpm build`（或 npm/yarn 等效命令）
   - **构建输出目录：** `dist`
   - **根目录：**（保持默认）
4. 环境变量（设置 → Functions → Environment variables）：
   - `SITE_EMAIL_TO`：你的收件邮箱地址
   - `SITE_EMAIL_FROM`：你的域名已验证的发件地址
5. Functions 会从 `functions/` 目录自动部署

### MailChannels 设置


Cloudflare Pages 默认集成 MailChannels。为避免邮件被退回：
- 向 MailChannels 验证你的发件域名
- `SITE_EMAIL_FROM` 使用域名邮箱（不要用免费邮箱提供商）
- 如果使用你的域名，配置 Cloudflare Email Routing

## 自定义要点

**联系邮箱显示：**
- 页脚邮箱硬编码在 `src/App.jsx:710`
- 搜索 "machao2024.996@gmail.com" 进行更新

**政策链接：**
- 官方口岸链接目前是占位符（`#`）
- 位于 `zh` 和 `en` 本地化中的 `policyLinksGroups` 数组（约在 98-104 行，210-215 行）
- 将 `href: "#"` 替换为实际的政府网址

**客户案例：**
- 案例数据和图表定义在 260-272 行
- 时间轴项目在渲染的 JSX 中（571-577 行，604-609 行）
- 更新时保持本地化字符串和图表数据一致

**免签适用国家：**
- 国家列表在 `eligibleGroups` 中（zh 为 109-128 行，en 为 221-240 行）
- 默认隐藏；通过 `showCountries` 状态控制切换

## 文件组织结构

```
/
├── functions/
│   └── api/
│       └── contact.ts        # POST /api/contact 端点
├── src/
│   ├── App.jsx              # 主 SPA 组件（779 行）
│   └── main.jsx             # React 根渲染
├── index.html               # 入口文件，引入 Tailwind CDN
├── vite.config.js           # Vite 配置
└── package.json             # 依赖和脚本
```

## 常见开发任务

**添加新区块：**
1. 在 `locales` useMemo 的 `zh` 和 `en` 对象中添加本地化字符串
2. 在 `<Section id="...">` 组件内创建 JSX
3. 在头部导航中添加链接（约在 360 行）

**更新翻译：**
- 所有文本都在 `locales` 对象中（28-254 行）
- 在 `zh` 和 `en` 对象中保持并行结构
- 通过 `t.property` 或 `t.nested?.property` 引用

**修改联系表单：**
1. 更新 `form` 状态初始值（13-21 行）
2. 在表单 JSX 中添加输入字段（684-694 行）
3. 更新 `functions/api/contact.ts` 中的邮件模板（18-28 行）

**本地测试邮件功能：**
- Cloudflare Pages Functions 需要 Cloudflare 环境
- 使用 `wrangler pages dev dist` 加上 `--compatibility-flag=nodejs_compat` 进行本地测试
- 或部署到预览分支进行线上测试
