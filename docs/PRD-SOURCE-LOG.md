# PRD / 工程对话溯源日志（用户提示词 × 助手说明）

> **用途**：作为**单一累积文档**：  
> 1）**全部有实质内容的用户提示词**（**含与 PRD 无关**的排错、重构、脚本、环境等）；  
> 2）助手在本轮中的说明，尤其 **实现代码前**（意图、假设、将动哪些文件）与 **实现代码后**（具体改动、验证方式、风险）。  
> 正式 PRD 仍以 `docs/PRD-Vouchap-Platform-And-Marketing-Site.md` 为准；本文件是「原声 + 当时怎么说清楚」的全量素材库。  
> **维护规则**：**`.cursor/rules/prd-source-log.mdc`**（`alwaysApply`）。助手须**写入文件**，不得只口头承诺。

---

### 2026-11-06（邀请页按 Dropbox 卡片，并显示服务模板）

**User（提示词/原意）**  
- 页面结构参考 Dropbox 文件请求，中下部分成左右。测试邀请是有内容的，但模板预览仍不显示。

**Assistant（实现前）**  
- 预览权限在未登录时直接失败，所以邀请里的 SKU 读不出来。页面也还不是卡片式左右布局。

**Assistant（实现后）**  
- 有效邀请 token 在登录前即可预览模板和资料清单。继续页改成白卡片：标题是事务所请求，中间左侧模板、右侧文件列表和 Add more files，底部姓名、邮箱和 Upload。

**关联**  
- `apps/portalflow-app/supabase/migrations/20261106180000_anon_invite_sku_preview.sql`  
- `apps/portalflow-app/src/mobile-ui/app/portal/join.tsx`

---

### 2026-11-06（邀请落地页无侧栏，继续后一页完成）

**User（提示词/原意）**  
- 落地页不要左侧栏，保持原来的落地页样式。继续后的一页里，名字+邮箱验证，或已有账户则邮箱验证码登录，放在一行。左下用原来的 SKU 预览并加识别后的绿勾。右侧是文件图标列表，添加文件要简单。Upload 按钮表示整包提交给事务所，不是上传。

**Assistant（实现前）**  
- `/client-join` 仍挂在应用侧栏里。`/portal/join` 把验证、清单、上传按钮拆开，清单也不是 SKU 预览。

**Assistant（实现后）**  
- 落地页去掉侧栏，沿用邀请卡样式。下一页顶栏一行完成姓名/邮箱或已有账户验证码登录，发码前勾选协议，协议浮窗打开条款页。左侧 SkuPreview，匹配项打绿勾。右侧拖放或点击添加文件，Submit to firm 才通知事务所。

**关联**  
- `apps/portalflow-app/src/mobile-ui/app/client-join.tsx`  
- `apps/portalflow-app/src/mobile-ui/app/portal/join.tsx`  
- `apps/portalflow-app/src/mobile-ui/components/SkuPreview.tsx`

---

### 2026-11-06（Receiptap 支出明细分组小计）

**User（提示词/原意）**  
- Vouchap 已实现的收支记录 item 列表按分组小计，Receiptap 没有同步，需要复用。

**Assistant（实现前）**  
- 收入、支出单据列表的分组头已有金额。支出明细表 `/receipt-items` 分组后只显示条数，没有按汇率折算的小计。

**Assistant（实现后）**  
- 与 Vouchap 相同：分组内取出现最多的币种，其余按汇率折算后显示在分组标题旁。

**关联**  
- `apps/portalflow-app/src/mobile-ui/app/receipt-items.tsx`

---

### 2026-11-06（邀请落地页之后只进一页）

**User（提示词/原意）**  
- 客户打开邀请仍是原来的落地页，去掉下载 App。Continue 进入同一页里的验证邮箱、资料清单和文件夹。发验证码前勾选同意服务，协议链接用浮窗打开协议页。

**Assistant（实现前）**  
- Continue 还进 /auth/setup，再进验证码页，再进门户，跳转过多。落地页仍有商店和二维码。

**Assistant（实现后）**  
- 落地页只留 Continue。下一页是 /portal/join：勾选并点 service terms 会浮窗打开 https://www.vouchap.com/terms，勾选后才能发验证码。验证通过后清单和文件夹在同一页启用。

**关联**  
- `vouchap-website/app/client-join/page.tsx`  
- `apps/portalflow-app/src/mobile-ui/app/portal/join.tsx`  
- `apps/portalflow-app/src/mobile-ui/app/client-join.tsx`

---

### 2026-11-06（邀请域名改为 portalflow.aim.link）

**User（提示词/原意）**  
- 现在已解析的域名是 portalflow.aim.link。

**Assistant（实现前）**  
- 新邀请还指向 portalflow.pages.dev，邮件回跳常量仍是 portalflow.app。portalflow.aim.link 已经打开 Portalflow Web。

**Assistant（实现后）**  
- 客户邀请和网页继续按钮改为 https://portalflow.aim.link/client-join 。已发出的 portalflow.app 链接仍无解析，同一 token 可打开 https://portalflow.aim.link/auth/setup?token=...

**关联**  
- `apps/portalflow-app/src/shared-logic/firm-clients.ts`  
- `vouchap-website/app/client-join/page.tsx`

---

### 2026-11-06（邀请链接 portalflow.app 打不开）

**User（提示词/原意）**  
- https://portalflow.app/client-join?token=... 邀请链接打不开。

**Assistant（实现前）**  
- portalflow.app 没有 DNS。邀请默认写死这个域名。落地页在营销站，网页继续按钮还指向 platform.vouchap.com。

**Assistant（实现后）**  
- 新邀请改为 https://portalflow.pages.dev/client-join ，并在 Web 应用里转到 /auth/setup。营销站继续按钮也进这个地址。已发出的 portalflow.app 链接在域名解析接上之前仍然打不开。

**关联**  
- `apps/portalflow-app/src/shared-logic/firm-clients.ts`  
- `vouchap-website/app/client-join/page.tsx`

---

### 2026-11-06（Portalflow 客户资料门户）

**User（提示词/原意）**  
- 客户端跟此前报税客户端同一套架构，但不要完整 engagement 协同。同意条款后是邮箱验证码加上传文件，像 Dropbox portal。验证码首次通过就建 space 并跳过设置，已有 space 则绑定。文件按文件夹展示，左侧是邀请模板的资料清单，AI 识别齐了就变绿。客户可催办和留言。事务所 engagement 增加沟通入口。

**Assistant（实现前）**  
- 邀请页去掉选 space。新路由 `/portal/join` 和 `/portal/[orderId]`。表 `engagement_files`、`engagement_messages`、`engagement_checklist_state`。

**Assistant（实现后）**  
- 同意条款后发邮箱验证码。一个客户 space 直接绑定，多个只选名称，没有则用邮箱前缀建 space。门户左侧清单、右侧文件夹。上传后 AI 对照标题和说明，齐了就把 todo 标绿。事务所详情有 Communication，可回复。Supabase 邮件模板仍需在 Dashboard 改成展示 `{{ .Token }}`，否则信里还是链接。

**关联**  
- `apps/portalflow-app/src/mobile-ui/app/portal/[orderId].tsx`  
- `apps/portalflow-app/supabase/migrations/20261106120000_engagement_portal.sql`

---

### 2026-11-06（Receiptap Web：收入付款人与实体列表不一致）

**User（提示词/原意）**  
- Receiptap Web 的 income 列表里有的 payer，在设置的 entities，以及收入详情里改选 payer 的列表，都看不到。

**Assistant（实现前）**  
- 收入列表优先显示单据上的 `customer_name`。实体设置和选单只列未合并的 entities。库里有只写了名称、没有实体的收入，也有名称还停在已合并实体上的收入。

**Assistant（实现后）**  
- 打开收入列表或实体设置时，把这些付款人挂到未合并实体上：没有实体就按名称创建，已合并的改挂到合并后的实体，并把单据名称改成该实体名称。收入列表改为优先显示实体名。

**关联**  
- `apps/portalflow-app/src/shared-logic/entities.ts`  
- `apps/portalflow-app/src/shared-logic/invoices.ts`

---

### 2026-11-06（Portalflow 客户资料门户）

**User（提示词/原意）**  
- 客户端跟此前报税客户端同一套架构，但不要完整 engagement 协同。同意条款后是邮箱验证码加上传文件，像 Dropbox portal。验证码首次通过就建 space 并跳过设置，已有 space 则绑定。文件按文件夹展示，左侧是邀请模板的资料清单，AI 识别齐了就变绿。客户可催办和留言。事务所 engagement 增加沟通入口。

**Assistant（实现前）**  
- 邀请页去掉选 space。新路由 `/portal/join` 和 `/portal/[orderId]`。表 `engagement_files`、`engagement_messages`、`engagement_checklist_state`。

**Assistant（实现后）**  
- 同意条款后发邮箱验证码。一个客户 space 直接绑定，多个只选名称，没有则用邮箱前缀建 space。门户左侧清单、右侧文件夹。上传后 AI 对照标题和说明，齐了就把 todo 标绿。事务所详情有 Communication，可回复。Supabase 邮件模板仍需在 Dashboard 改成展示 `{{ .Token }}`，否则信里还是链接。

**关联**  
- `apps/portalflow-app/src/mobile-ui/app/portal/[orderId].tsx`  
- `apps/portalflow-app/supabase/migrations/20261106120000_engagement_portal.sql`

---

### 2026-11-06（拆开 Portalflow 与 Receiptap 的 Web）

**User（提示词/原意）**  
- 分离 Portalflow 和 Receiptap 的 Web。Receiptap 功能与 App 对齐，去掉报税。Portalflow 主要是事务所登录；客户用邮箱登录后只看报税、律师等服务历史（具体界面以后再设计）。域名 receiptap.aim.link 另行配置。

**Assistant（实现前）**  
- 仍是同一套 portalflow-app。Receiptap Web 用 `APP_VARIANT=receiptap` 另发到 Pages `receiptap`。Portalflow Web 客户空间不再进记账，只留服务历史壳；事务所端不变。

**Assistant（实现后）**  
- 客户首页是 Service history：报税进现有历史，律师先占位。记账路由在 Portalflow 客户空间会回到首页。Receiptap 导出不含报税和事务所。自定义域名需在 Cloudflare 绑到 Pages `receiptap`，并把 `https://receiptap.aim.link/**` 与 `https://receiptap.pages.dev/**` 加进 Supabase Auth 的重定向白名单（本地 config.toml 已写，未对线上做整份 config push）。

**关联**  
- `apps/portalflow-app/src/shared-logic/portalflow-sidebar-nav.ts`  
- `apps/portalflow-app/src/mobile-ui/components/ClientServicesHome.tsx`  
- `.github/workflows/deploy-receiptap-web.yml`

---

### 2026-11-05（Wholestore 应用内换成新仓库图标）

**User（提示词/原意）**  
- Wholestore 的 logo 也规范更新了，修改应用内透出的各处。

**Assistant（实现前）**  
- 应用内登录、侧栏和网页图标都引用 `apps/wholestore-app/assets/icon.png`。只换这一张，再发布 Wholestore Web。

**Assistant（实现后）**  
- 已换成新的仓库卡车图标并推送。Deploy Wholestore Web 成功，线上为 https://wholestore.pages.dev。

**关联**  
- `Adaven-platform/apps/wholestore-app/assets/icon.png`  
- `Adaven-platform/apps/wholestore-app/src/bootstrap.ts`

---

### 2026-11-05（Portalflow 新盾牌：应用内黑金，网站蓝紫）

**User（提示词/原意）**  
- 更新了 Portalflow 的 logo。应用内用 1，网站上用 2，包括 Workmap 网站友情链接。

**Assistant（实现前）**  
- 1 是黑金盾，2 是蓝紫盾。应用内 logo/favicon 换 1；vouchap.com 与 Workmap 页脚换 2。Receiptap 收据图标不动。

**Assistant（实现后）**  
- 已推送三处仓库。Portalflow Web 会因 `apps/portalflow-app/**` 自动部署，登录和侧栏用黑金盾。

**关联**  
- `Adaven-platform/apps/portalflow-app/assets/logo.png`  
- `vouchap-website/public/logo.png`  
- `Workmap-website/public/assets/partner-vouchap.png`

---

### 2026-11-05（商店链接与 App 回调改为 receiptap）

**User（提示词/原意）**  
- App Store 和 Google Play 的应用链接、回调地址里的 vouchap 要改成 receiptap。网站上对应的介绍和链接一起改。

**Assistant（实现前）**  
- 深链 scheme、确认页和邀请页的打开 App 地址改为 `receiptap://`。App Store 链接名称段改为 receiptap，数字 id 不变。Play 详情仍用已上架包名 `com.vouchap.app`。原生同时保留 `vouchap://`，旧邮件还能打开。

**Assistant（实现后）**  
- 网站与 Receiptap 工程已改。https 通用链接域名仍是 vouchap.com，因为确认页就在这个网站上。

**关联**  
- `vouchap-website/lib/storeLinks.ts`  
- `Adaven-platform/apps/portalflow-app/android/app/src/main/AndroidManifest.xml`  
- `Adaven-platform/apps/portalflow-app/ios/Vouchap/Info.plist`

---

### 2026-11-05（Receiptap Android 自适应图标）

**User（提示词/原意）**  
- 给了 Receiptap 前后分离的 logo，需要重新构建 Android 生产包，让 logo 在手机上显示正常。

**Assistant（实现前）**  
- 现有启动图标把整张方图塞进前景，系统蒙版会裁掉边缘。改为自适应图标：背景用渐变层，前景用透明收据层。

**Assistant（实现后）**  
- 已写入 `mipmap-*/ic_launcher_foreground.webp` 与 `drawable-*/ic_launcher_adaptive_bg.png`，旧版启动图标用两层合成。随后打 Receiptap Android 生产包。

**关联**  
- `Adaven-platform/apps/portalflow-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`

---

### 2026-11-04（Web 登录品牌：登录前与 Firm 用 Portalflow，Client 用 Receiptap）

**User（提示词/原意）**  
- Web 端应用：firm 登录是 Portalflow 和盾牌 logo，client 登录则 logo 和名称是 Receiptap。登录前的界面用 Portalflow。

**Assistant（实现前）**  
- 登录、注册、重置密码仍读静态产品名，所以保持 Portalflow 黑金盾。登录后侧栏按当前空间 kind 切换。

**Assistant（实现后）**  
- `getBrand`：无空间或 provider 为 Portalflow 盾牌；consumer 为 Receiptap 收据标。浏览器标题同步。已推送，Pages 会因 `apps/portalflow-app/**` 自动部署。

**关联**  
- `Adaven-platform/packages/platform-ui/src/chrome/WebSidebar.tsx`  
- `Adaven-platform/apps/portalflow-app/src/shared-logic/portalflow-space-bootstrap.ts`

---

### 2026-11-04（网站主品牌改回 Portalflow，盾牌分蓝紫/黑金）

**User（提示词/原意）**  
- vouchap 网站主题名称应是 Portalflow。Receiptap 只是其中一个能力的独立版，类似 Workmap 里的 Focusing。Portalflow 用以前的盾牌 logo：应用内黑金，网站蓝紫。从图库里找。

**Assistant（实现前）**  
- 蓝紫盾是 `logo-prev.png`，黑金盾是 `logo2-prev.png`。收据图标留给 Receiptap 变体，不覆盖 Portalflow。

**Assistant（实现后）**  
- 网站锁标和文案改回 Portalflow，功能区保留 Receiptap 作为独立记账应用。站图用蓝紫盾，应用内 logo 用黑金盾。Workmap 页脚友情链接同步为 Portalflow 蓝紫盾。已推送并触发 Portalflow Pages 部署。

**关联**  
- `vouchap-website/public/logo.png`  
- `Adaven-platform/apps/portalflow-app/assets/logo2-prev.png`  
- `Adaven-platform/apps/portalflow-app/assets/receiptap-icon.png`

---

### 2026-11-04（网站新 Logo 加圆角）

**User（提示词/原意）**  
- 网站上用新 logo 的需要加圆角处理。

**Assistant（实现前）**  
- Receiptap 方图标出现在 vouchap.com 顶栏/页脚/Showcase，以及 Workmap 页脚友情链接。Portalflow / Wholestore Web 登录和侧栏也用产品 logo。统一用 22% 圆角。

**Assistant（实现后）**  
- 已改并推送 `Vouchap-website` `27a0325`、`Workmap-website` `5eee1a8`。平台 Web 壳 logo 圆角在 `Adaven-platform`，并触发 Portalflow 与 Wholestore 的 Pages 部署。

**关联**  
- `vouchap-website/components/Navbar.tsx`  
- `Workmap-website/src/components/Footer.jsx`  
- `Adaven-platform/packages/platform-ui`

---

### 2026-11-04（Portalflow Web 构建并发布 Pages）

**User（提示词/原意）**  
- portalflow 的 web 端也需要构建 pages。

**Assistant（实现前）**  
- 本机 Wrangler 未登录。`main` 已含最新代码，用 GitHub Action **Deploy Portalflow Web** 做 Direct Upload，目标项目 `portalflow`，不带 `APP_VARIANT`，因此是 Portalflow 而不是 Receiptap。

**Assistant（实现后）**  
- 运行 https://github.com/jamesgao27/Adaven-platform/actions/runs/41928000631 成功。站点为 https://portalflow.pages.dev 。

**关联**  
- `.github/workflows/deploy-portalflow-web.yml`

---

### 2026-11-04（Wholestore 新图标全面更换）

**User（提示词/原意）**  
- Wholestore 应用的新图标，全面更换。

**Assistant（实现前）**  
- Wholestore 只有 `apps/wholestore-app/assets/icon.png` 一处：应用图标、Web favicon、登录/侧栏 logo 都引用它。没有单独的原生 mipmap 或营销站。

**Assistant（实现后）**  
- 已用上传的仓库图标覆盖 `assets/icon.png`（1024 不透明 PNG）。本地 `expo export` 已打进新图标。Cloudflare 未登录，Pages `wholestore` 还没发出去；本机执行 `npm run wholestore:deploy:web` 即可更新线上 Web。

**关联**  
- `Adaven-platform/apps/wholestore-app/assets/icon.png`

---

### 2026-11-04（Receiptap 新图标：App 与网站）

**User（提示词/原意）**  
- 上传了新 logo。Receiptap 用这张图标更新各处，重新构建，并更新网站各处的显示。

**Assistant（实现前说明）**  
- 源图为 1024 方形收据图标。写入 App 的 `logo2.png` 并同步 iOS/Android 启动图标；站内 `logo.png`、`logo3.png`、favicon 一并替换。版本仍是 2.6.7，构建号由 EAS 递增。

**Assistant（实现后说明 / 本轮结论）**  
- 图标已进 Portalflow/Receiptap 的应用内 logo、iOS 1024 图标和 Android mipmap。网站顶栏、页脚、Showcase、登录确认页的标记和产品名改为 Receiptap，并已推到 `jamesgao27/Vouchap-website` 的 `main`（`e13f8f0`）。商店包正在重新构建。

**关联**  
- `Adaven-platform/apps/portalflow-app/assets/logo2.png`  
- `vouchap-website/public/logo.png`

---

### 2026-11-04（Receiptap：Portalflow 代码打记账包，沿用 Vouchap 商店账号）

**User（提示词/原意）**  
- 用 Portalflow 的代码构建只有记账功能、不能登录和切换 provider 空间的 App，命名为 Receiptap。Expo 与 App Store / Google Play 账户用原来的 Vouchap，版本号按原序列升级。

**Assistant（实现前说明）**  
- 在 `portalflow-app` 用 `APP_VARIANT=receiptap` 出包，不另起仓库。显示名 Receiptap，包名、scheme、EAS 项目仍是 `com.vouchap.app` / `vouchap` / `@aimlink/vouchap`，版本 2.6.7。空间切换只保留 `consumer`。

**Assistant（实现后说明 / 本轮结论）**  
- 记账导航只留 Expenses / Income。Tax Filing 与 Firm 路由在该变体中关闭。当前空间若是 provider，会改到一本 consumer 账；没有记账空间则去创建，切换列表里不出现 provider。  
- EAS 生产环境改为 Portalflow 库。iOS 2.6.7 (49) 已构建并提交 App Store Connect：https://expo.dev/accounts/aimlink/projects/vouchap/submissions/b322534e-7639-4504-914d-0d3f9ad5e302 。Android 2.6.7 (66) 仍在队列：https://expo.dev/accounts/aimlink/projects/vouchap/builds/17c6d625-5481-4b5b-a8b2-6d2804572b6a 。  
- 为通过 CocoaPods，把 `react-native-worklets` 固定为 0.5.1 并提升到 monorepo 根，与 Reanimated 4.1 放在一起。

**关联**  
- `Adaven-platform/apps/portalflow-app/app.config.js`、`eas.json`  
- `Adaven-platform/packages/platform-ui/src/product.ts`

---

### 2026-11-04（Vouchap 客户数据迁入 Portalflow 库）

**User（提示词/原意）**  
- 直接把 Vouchap 库中的数据全部迁到 Portalflow 库。迁移前可以清除 Portalflow 里已有的测试数据。

**Assistant（实现前说明）**  
- 源库 `giuacjbfsyrristkigmz` 只读。目标库 `xvqlqvtfogxkfeillvig` 先清空业务数据，再按 UUID 原样写入。`firm`/`client` 收成 `provider`/`consumer`。Storage 对象另拷，库内 URL 的项目域名改成 Portalflow。

**Assistant（实现后说明 / 本轮结论）**  
- Portalflow 测试数据已清空。迁入：auth 用户 67、空间 69（consumer 66 / provider 3）、收据 1107、收据明细 4484、发票 67、聊天日志 725、事务所客户 30、订单 48、项目 30、待办 990、订阅订单 77。Storage：receipts 1440、tax-filing 292、chat-audio 156、marketplace 16。抽查收据和报税附件的公网地址返回 200。  
- 补了 Portalflow 缺的记账列，并把类目唯一约束改成带 `scope`。`chat-audio`、`tax-filing` 桶改为 public，与 Vouchap 上的公开 URL 一致。  
- 未迁：登录会话（密码哈希已复制，需重新登录）、`crm.ops_assignments`（89）和 `crm.role_menu_permissions`（28）（目标库没有这些表）、空的 workmap。`firm.invitee_clients` 7 行里 1 行写入 `provider.consumers`，其余已在客户表中。Vouchap 源库未改。Adaven-CRM 若两个产品适配器都指向这两套库，会看到两份相同客户。

**关联**  
- `Adaven-platform/apps/portalflow-app/supabase/migrations/20261104190000_align_bookkeeping_columns_from_vouchap.sql`

---

### 2026-10-03（Adaven-CRM：Wholestore 客户查询 Edge Function 非 2xx）

**User（提示词/原意）**  
- adaven-crm 中查询 wholestore 的客户数据，提示 Edge Function returned a non-2xx status code。其他应用没有出现。

**Assistant（实现前说明）**  
- 客户页通过 Hub `product-ops` 的 `list_tenants` + `list_orders` 拉数据。先核对 Wholestore 适配密钥和表结构，再对比其他产品的 PostgREST 暴露 schema。

**Assistant（实现后说明 / 本轮结论）**  
- 空间表能读（3 个 space）。失败点是 `crm.space_orders` / `crm.sku_edition`：PostgREST 只暴露了 `public, graphql_public, provider, consumer`，`authenticator` 对 `crm` 没有 USAGE。客户页并行拉订单，于是整页变成 Edge Function 非 2xx。Vouchap / Portalflow 已暴露 `crm`，所以只有 Wholestore 中招。  
- 已在项目 `foyecolycmxcneflpant` 授权并设置 `pgrst.db_schemas` 含 `crm`，迁移 `20261004034500_expose_crm_postgrest.sql` 已 `db push`。复查：spaces 3、orders 4、sku 5。刷新 CRM 再选 Wholestore 即可。未改 CRM 前端，未 commit。

**关联**  
- `Adaven-platform/packages/db-platform/sql/038_expose_crm_postgrest.sql`  
- `Adaven-platform/apps/wholestore-app/supabase/migrations/20261004034500_expose_crm_postgrest.sql`  
- `Adaven-CRM/supabase/functions/product-ops/index.ts`（`list_orders` 走 `crm` schema）

---

### 2026-10-03（Firedoor：中断提交并重新推送）

**User（提示词/原意）**  
- 中断现在的 commit，重新 push。

**Assistant（实现前说明）**  
- 先查是否有进行中的 `git commit` 或 `index.lock`。没有的话，把未提交的二十层对局重新提交并推 `main`。

**Assistant（实现后说明 / 本轮结论）**  
- 没有卡住的提交。新提交 `5b27427` 已推到 https://github.com/jamesgao27/Firedoor 的 `main`。

**关联**  
- `/Users/macbook/Firedoor`

---

### 2026-10-03（Firedoor：二十层下楼）

**User（提示词/原意）**  
- 游戏名「火已封门」。二十层大楼起火，从 20 楼沿 Z 字形楼梯跑到 1 楼。木门挡 5 秒、每 3 秒一扇；铁门永久挡火，每扇每秒 2 金币。开局 30 金币，每 5 秒 +10。金币归零或被火烧到即输。上键木门，下键铁门，左右下楼。火在进入楼梯间 10 秒后追来，而且比人快。表述不通顺的由助手理顺。

**Assistant（实现前说明）**  
- 做成一局实时规则，放在 `/play`。楼梯 19 段，偶数层往右、奇数层往左。下楼每段 2 秒，火每段 0.55 秒。不改账号表。

**Assistant（实现后说明 / 本轮结论）**  
- 模拟：不装门会在约 14 层被追上；只装一扇铁门能到 1 楼且金币还有剩余；连装三扇铁门会在 9 秒金币归零；见缝插针装木门也能赢。
- 浏览器里核对了 `/play`：按错方向会提示往右，铁门提示每秒 2 金币，下楼后下一段改往左；停在 20 楼会被火追上。首页有「开始逃生」。尚未推送到 GitHub，线上仍是旧页面。

**关联**  
- `/Users/macbook/Firedoor/src/lib/escape-run.ts`
- `/Users/macbook/Firedoor/src/app/play/play-view.tsx`

---

### 2026-10-03（Firedoor：推送 GitHub 并触发 Vercel）

**User（提示词/原意）**  
- 代码上传 GitHub，并自动触发 Vercel 构建发布。

**Assistant（实现前说明）**  
- 本地已有提交，远程为空。计划提交用户名密码改动，建私有仓库 `jamesgao27/Firedoor` 并推送 `main`，再用 `vercel git connect` 接到现有项目。不提交 `.env.local`。

**Assistant（实现后说明 / 本轮结论）**  
- 已推送 https://github.com/jamesgao27/Firedoor （私有）。Vercel 项目已连接该仓库，之后推 `main` 会自动构建。
- 连接发生在第一次推送之后，因此用该提交 `97e93ba` 补了一次生产部署。https://firedoor-psi.vercel.app/register 已是用户名密码，没有邮箱和验证码。

**关联**  
- https://github.com/jamesgao27/Firedoor
- https://firedoor-psi.vercel.app

---

### 2026-10-03（Firedoor：登录后提交账号表 SQL）

**User（提示词/原意）**  
- 系统通知：CloudBase 设备登录任务已完成。接着提交账号表。

**Assistant（实现前说明）**  
- 无代码变更。登录已成功。把 `002_username_accounts.sql` 拆成单条语句，用 `tcb db execute` 提交到 `firedoor-d1ggpyujx33d902f6`。

**Assistant（实现后说明 / 本轮结论）**  
- 20 条语句全部执行成功。用网页同一把 Publishable Key 调 `register_player`：注册成功、当前会话能读到用户名、重复注册返回「用户名已被占用」、注销后会话失效。测试账号 `doorcheck` 已删除。
- 线上 Vercel 仍是旧的邮箱注册，这次没有重新部署。

**关联**  
- `/Users/macbook/Firedoor/cloudbase/migrations/002_username_accounts.sql`

---

### 2026-10-03（Firedoor：发起 CloudBase CLI 登录）

**User（提示词/原意）**  
- 你来执行，我授权就是了。

**Assistant（实现前说明）**  
- 无代码变更。用 `tcb login --flow device` 发起设备授权，授权成功后再执行 `002_username_accounts.sql`。

**Assistant（实现后说明 / 本轮结论）**  
- 登录进程已启动，授权页为 `https://tcb.cloud.tencent.com/dev#/cli-auth?user_code=R5V2-9TDY&from=cli&flow=device`。SQL 尚未提交，等用户在浏览器确认。

**关联**  
- 环境 `firedoor-d1ggpyujx33d902f6`

---

### 2026-10-03（Firedoor：CloudBase CLI 能否直接提交 SQL）

**User（提示词/原意）**  
- CloudBase 有 CLI 么？你可直接提交处理么？

**Assistant（实现前说明）**  
- 无代码变更。查本机是否已有 CLI 与登录态，以及 PostgreSQL 环境能否用 CLI 执行 SQL。

**Assistant（实现后说明 / 本轮结论）**  
- 有 CLI：`@cloudbase/cli` 3.8.5，命令 `tcb` / `cloudbase`。`tcb db execute` 与 `tcb db pg migration up` 可对 PostgreSQL 环境执行 SQL，但必须是管理员登录。
- 本机执行 `tcb env list` 返回未登录。Publishable Key 不能跑 DDL。因此这次没有把 `002_username_accounts.sql` 提交上去。

**关联**  
- `/Users/macbook/Firedoor/cloudbase/migrations/002_username_accounts.sql`

---

### 2026-10-03（Firedoor：用户名密码注册）

**User（提示词/原意）**  
- 初试注册通过用户名和密码即可，不用邮箱认证，降低用户门槛。

**Assistant（实现前说明）**  
- CloudBase `/auth/v1/signup` 实测拒绝「仅用户名+密码」，邮箱注册也要求验证码。计划改为在 Postgres 建 `players` / `player_sessions`，页面只收用户名和密码，去掉邮箱与 `/activate` 验证码。

**Assistant（实现后说明 / 本轮结论）**  
- 注册、登录、门厅已改为用户名和密码。密码 bcrypt 存在服务端，会话令牌只回传一次。`/activate` 转到注册页。
- 本地 http://localhost:3010/register 已核对：无邮箱字段；短密码当场提示；合法提交返回「请执行 002_username_accounts.sql」。账号表尚未在 CloudBase 执行，所以还不能真正注册成功。线上 Vercel 仍是旧的邮箱流程，未重新部署。

**关联**  
- `/Users/macbook/Firedoor/cloudbase/migrations/002_username_accounts.sql`

---

### 2026-10-03（Firedoor：本地开发服务中断）

**User（提示词/原意）**  
- 系统通知：本地任务「Restart Firedoor on Singapore region」已中止。

**Assistant（实现前说明）**  
- 无代码变更。核对终端记录，确认是否影响已发布站点。

**Assistant（实现后说明 / 本轮结论）**  
- `npm run dev -- --port 3010` 在运行约 7 分钟后被中止，退出前首页与激活页均为 200。线上 https://firedoor-psi.vercel.app 不依赖该进程。

**关联**  
- `/Users/macbook/Firedoor`

---

### 2026-10-03（Firedoor：代建并发布 Vercel）

**User（提示词/原意）**  
- 你来操作就好了（指在 Vercel 上创建项目并发布）。

**Assistant（实现前说明）**  
- 用已登录的 Vercel CLI 在团队 james-projects 创建 firedoor 并生产部署。不提交 git。

**Assistant（实现后说明 / 本轮结论）**  
- 已发布 https://firedoor-psi.vercel.app ，首页含「火已封门」。三项 CloudBase 环境变量已写入 Vercel。`vercel link` 曾覆盖 `.env.local`，已恢复。关部署保护并重部署后公开可访问。CloudBase 安全域名仍需加上该地址。

**关联**  
- `/Users/macbook/Firedoor`，https://firedoor-psi.vercel.app

---

### 2026-10-03（Firedoor：生产站点公开访问）

**User（提示词/原意）**  
- 修好 Firedoor 的 Vercel 生产部署：关掉 SSO/部署保护，框架设为 nextjs，确保 `firedoor-psi.vercel.app` 指向当前生产部署，访客无需 Vercel 登录即可打开，页面含「火已封门」。不要打印密钥，不要 `vercel env pull` / `vercel link`，不要提交 git。

**Assistant（实现前说明）**  
- 无 Firedoor 代码变更。先读项目与域名：framework 为空，ssoProtection 为 `all_except_custom_domains`，域名 `firedoor-psi.vercel.app` 已登记且别名指向 `dpl_FJpwwQ1t4kGRVfNbDwk8SsBGxx1m`。拟 PATCH 关闭保护并设 framework，若仍 404 再 `vercel deploy --prod`。

**Assistant（实现后说明 / 本轮结论）**  
- framework 设为 `nextjs`；`ssoProtection` 与 `passwordProtection` 设为 null。关保护后旧部署三个地址均为边缘 404，已重新生产部署 `dpl_HSy68kucyiVfv2Rbrwpzpr7hhHXa`，别名重新挂上。
- `https://firedoor-psi.vercel.app` 与团队别名均为 HTTP 200，HTML 含「火已封门」，无 SSO 跳转。未改环境变量，未提交 git。

**关联**  
- `/Users/macbook/Firedoor`，项目 `prj_aSMRbEyLrORV0Pp3wFMtKxEEp2lM`

---

### 2026-10-03（Firedoor：Vercel 是否需自建）

**User（提示词/原意）**  
- Vercel 上是不是需我自建项目？

**Assistant（实现前说明）**  
- 无代码变更。核对本地是否已有 git remote 或 `.vercel`。

**Assistant（实现后说明 / 本轮结论）**  
- 需要。Firedoor 只在本地，`main` 没有远程，也没有 `.vercel`。Vercel 项目要在控制台导入仓库，或登录后用 CLI 创建。环境变量不会随代码上去，需在 Vercel 单独填写三个 `NEXT_PUBLIC_CLOUDBASE_*`。

**关联**  
- `/Users/macbook/Firedoor`

---

### 2026-10-03（Firedoor：地域改为新加坡）

**User（提示词/原意）**  
- CloudBase 选择的区域是新加坡。

**Assistant（实现前说明）**  
- 本地原先写的是 `ap-shanghai`。先探测网关：上海入口返回环境创建在 `ap-singapore`、不能从上海访问；新加坡入口能接到这个环境。

**Assistant（实现后说明 / 本轮结论）**  
- `.env.local`、示例和代码默认地域改为 `ap-singapore`，并重启了 3010 开发服务。
- 用测试邮箱再提交注册，已进入「查收验证码」页，说明请求打到新加坡环境。测试邮箱收不到信，正式注册要用真实邮箱。邮箱登录若仍未配置发信，验证码仍可能发不出。

**关联**  
- `/Users/macbook/Firedoor/.env.local`、`src/lib/cloudbase.ts`

---

### 2026-10-03（Firedoor：写入 Publishable Key）

**User（提示词/原意）**  
- 提供 CloudBase Publishable Key，要求写入 Firedoor。

**Assistant（实现前说明）**  
- 密钥是前端 anon Publishable Key，写入 `.env.local` 的 `NEXT_PUBLIC_CLOUDBASE_ACCESS_KEY`，重启 3010 上的开发服务后再试注册。不把密钥原文写入日志。

**Assistant（实现后说明 / 本轮结论）**  
- 密钥已写入并重启。用测试邮箱提交注册，CloudBase 已连通，返回 `provider email not found`：邮箱登录方式尚未在控制台开启。页面已把这条英文错误改成中文提示。
- 下一步：控制台开启邮箱登录并配置发信，安全域名放行 `http://localhost:3010`，SQL 执行 `001_profiles.sql`。

**关联**  
- `/Users/macbook/Firedoor/.env.local`、`src/lib/cloudbase.ts`

---

### 2026-10-03（Firedoor：写入 CloudBase 环境 ID）

**User（提示词/原意）**  
- CloudBase 已创建项目，环境 ID 是 `firedoor-d1ggpyujx33d902f6`。

**Assistant（实现前说明）**  
- 把环境 ID 写入 Firedoor 的 `.env.local`。Publishable Key 不能从环境 ID 推导，本机也没有 CloudBase CLI 登录态。

**Assistant（实现后说明 / 本轮结论）**  
- 已写入 `NEXT_PUBLIC_CLOUDBASE_ENV_ID`，地域保持 `ap-shanghai`。`NEXT_PUBLIC_CLOUDBASE_ACCESS_KEY` 仍为空，注册发信还不能通。
- 需要在云开发控制台该环境的 API Key 管理里创建 Publishable Key（`publish_key`），填进 `.env.local` 后重启 `npm run dev`。

**关联**  
- `/Users/macbook/Firedoor/.env.local`

---

### 2026-10-03（独立项目 Firedoor：注册激活外壳）

**User（提示词/原意）**  
- 新建网页游戏 Firedoor，火灾逃脱通关策略，剧情稍后。先搭注册激活和火灾元素 UI，前端 Vercel。界面改为全中文。后端用腾讯云开发 CloudBase for Supabase 版。随后「继续」按该计划实现。

**Assistant（实现前说明）**  
- 新目录 `/Users/macbook/Firedoor`，不放进 Vouchap。Next.js App Router + Tailwind。客户端用 `@cloudbase/js-sdk`：`signUp` 发邮箱验证码，`verifyOtp` 激活，`signInWithPassword` 登录。`profiles` SQL 供控制台执行。不写关卡。

**Assistant（实现后说明 / 本轮结论）**  
- 已建落地页、注册、激活、登录、门厅、错误页，文案全中文。门厅未登录会回登录；没有待激活信息会回注册。密码 8–32 位且含字母和数字。未配置环境时注册会提示填写 `.env.local`。
- 验证：`tsc --noEmit` 与 `eslint src` 通过。浏览器走通 `/`、`/register`（空表单、短密码、缺配置）、`/lobby`→`/login`、`/activate`→`/register`、`/error`。真实发信要等 CloudBase 环境 ID 与 Publishable Key。
- 限制：刷新激活页会丢掉内存中的验证回调，需点「重新获取验证码」。未部署 Vercel，未建云环境。

**关联**  
- `/Users/macbook/Firedoor`（独立仓库，不纳入 Vouchap PRD）

---

### 2026-09-07（回归：右栏不加载历史记录 — restorePromptFromLog TDZ）

**User（提示词/原意）**  
- 右侧栏直接不加载历史记录了。

**Assistant（实现前说明）**  
- 我上一轮为「PDF 用 URL 兜底判断」在 `restorePromptFromLog` 里写成
  `const isDocFile = isPreviewableDoc(...) || looksLikeDocumentAttachmentUrl(attachUrl);`，
  但 `attachUrl` 的 `const` 声明在其**下一行**。这是 TDZ：每条历史记录还原都会抛
  `ReferenceError: Cannot access 'attachUrl' before initialization`，整个右栏历史列表因此为空。
- 上一轮自测只覆盖了孤立的预览组件（临时 smoke 页），没有渲染真实历史，所以没抓到。

**Assistant（实现后说明 / 本轮结论）**  
- 把 `attachUrl` 的声明移到 `isDocFile` 之前；Vouchap 与 Portalflow 同步。
- 验证（不再只测孤立组件）：
  1. `tsc --noEmit`：`chat-to-log.tsx` 不再有 TS2448 used-before-declaration（`inbound/outbound.tsx` 的同类报错为既有问题）。
  2. `expo export -p web` 打包通过（等同 CF 构建）。
  3. 从**打包产物**里抽出线上真正执行的 `restorePromptFromLog`（压缩后为 `he`），对 text / image / pdf(带扩展名) / pdf(仅 URL 带 query) / tax-filing 附件 / audio 六类日志实跑：全部不抛错，且 pdf 归 `documentUrl`、图片归 `imageUrl`。
- 顺带删除已无引用的 `ChatPreviewHost.tsx`（两仓库），避免以后又被接回 context 那条失败路径。

**关联**  
- `chat-to-log.tsx`（`restorePromptFromLog`）

---

### 2026-09-07（右栏图片/PDF：改回 chat-to-log 本地浮窗并自测）

**User（提示词/原意）**  
- 详情页 pdf 预览已修好，其他问题仍在。修改后需自测。

**Assistant（实现前说明）**  
- 右栏继续走 ChatPanelContext + ChatPreviewHost 仍失败。拟改回与详情页相同：在 `ChatToLogContent` 内本地挂 `AttachmentImagePreviewModal` + `<Modal><FileDetailModal/></Modal>`（RN Modal 会 portal 到 body，不需另做 host）。
- PDF 点不开还可能是 documentUrl 未还原、或打开后同一 click 打在 backdrop 上立刻关闭。
- 自测：临时在 420px overflow:hidden 栏内挂同一套组件，Playwright 点开图片/PDF。

**Assistant（实现后说明 / 本轮结论）**  
- chat-to-log 不再把预览提到 context；右栏与全页都用本地 state。
- 历史还原用 URL 判断文档；PDF URL 点缩略图走 FileDetailModal；openFileInModal 延后一帧。
- Playwright：420px 栏内点图片 → `<img>` natural 800×600、绘制 1288×792；点 PDF → iframe 936×831。通过后已删临时 smoke 页。

**关联**  
- `chat-to-log.tsx`、`AttachmentImagePreviewModal.tsx`、`_layout.tsx`

---

### 2026-09-07（确认右栏=chat-to-log；PDF 点不开 / 图只有遮罩 / 详情页 PDF 未铺满）

**User（提示词/原意）**  
- 确认理解的右侧栏就是 chat-to-log 么？问题依旧：pdf 点不开，图片只有遮罩。详情页 pdf 预览窗没有布满浮窗。

**Assistant（实现前说明）**  
- 是：Web 右侧栏 = `WebChatPanel` 内嵌的 `ChatToLogContent`（`chat-to-log.tsx`）。
- 详情页 PDF 底部留白：iframe 写死 `height: 70vh`，卡片约 95vh。
- 右栏 PDF 点不开：`selectedAttachmentForModal == null` 的 effect 在 `showFileDetail` 因 context 更新重建后立刻 `showFileDetail(null)`，刚打开的 PDF 被关掉。
- 右栏图片只有遮罩：Web 浮窗里 RN `Image` 不绘图；`FileDetailModal` 左栏已经用 DOM `<img>`。图片浮窗应在同一 `Modal` 里同样用 `<img>`。

**Assistant（实现后说明 / 本轮结论）**  
- PDF iframe 改为铺满左栏；solo 模式去掉 aspectRatio 限制。
- 去掉「无选中附件就关闭文件预览」；`showFileDetail` 改为依赖稳定的 open/close 回调。
- `AttachmentImagePreviewModal` Web 端在原 Modal 内用 `<img>`（与 FileDetailModal 一致）。Portalflow 已对齐。

**关联**  
- `FileDetailModal.tsx`、`AttachmentImagePreviewModal.tsx`、`chat-to-log.tsx`

---

### 2026-09-07（右栏预览：先分析再收回同一套组件）

**User（提示词/原意）**  
- 问题依旧。预览应该用同一套组件。需要深刻分析原因再修改或重构。刚才每一轮修改都已经 push 并走了 Cloudflare 部署。

**Assistant（实现前说明）**  
对照收据详情页（可用）与右栏（黑罩 / PDF 空白）后，结论不是「缺一套预览组件」，而是同一套组件被挂错、Web 分支被改成另一条实现：
1. 收据详情页：页面内本地 state + `AttachmentImagePreviewModal` + `<Modal><FileDetailModal/></Modal>`，挂在整页 `View` 里。这是可用契约。
2. 右栏：`useChatPanel()` 在 Provider 下恒为真，于是用 `if (chatPanel)` 把预览整段切走；浮窗改由 `ChatPreviewHost` 渲染，且挂在 `LayoutContent` 外面（Provider 兄弟节点，没有整页 flex 根）。
3. 为修右栏又改了共享组件的 Web 路径：Pressable 包 Image（高度塌 0）→ 手写 `createPortal(View)` → 再分出 `WebAttachmentLightbox`。收据页能看见的是页内 80×80 缩略图（固定宽高），不是这条被改过的浮窗路径。
4. `FileDetailModal` 卡片宽高在 `StyleSheet.create` 时用 `Dimensions.get('window')` / `height:'95%'` 写死，父级高度为 0 时白卡片和 iframe 都看不见，只剩遮罩。

拟收回同一套组件：删 lightbox；图片浮窗回到 RN `Modal`（与收据页相同）；`ChatPreviewHost` 挪进 `LayoutContent` 根节点；右栏仅在 `isPanel` 时把 state 提到 host；卡片尺寸改用浏览器视口像素。

**Assistant（实现后说明 / 本轮结论）**  
- 已删除 `WebAttachmentLightbox`。`AttachmentImagePreviewModal` 全平台再走 RN `Modal`；Web 上 Image 用 `window.innerWidth/Height`，不再 `width/height: 100%`。
- `ChatPreviewHost` 挂到 `LayoutContent` 根（与 Toast/Confirm 同级），JSX 与收据详情页相同。
- `chat-to-log` 只用 `isPanel && chatPanel` 提升预览 state；全页 `/chat-to-log` 仍用本地浮窗。
- `FileDetailModal` 卡片宽高改为渲染时视口像素。Portalflow 已对齐。
- 需 push 后在 CF 上验证：右栏点历史图片应出大图；点 Open original PDF 应出同一套文件浮窗；收据详情页点缩略图预览应仍可用。

**关联**  
- `AttachmentImagePreviewModal.tsx`、`FileDetailModal.tsx`、`ChatPreviewHost.tsx`、`_layout.tsx`、`chat-to-log.tsx`

---

### 2026-09-07（右栏预览依旧失败：改用浏览器原生 img/iframe）

**User（提示词/原意）**  
- 问题依旧。右栏图片预览和 PDF 预览都不行。

**Assistant（实现前说明）**  
- RN-web Modal/Image 在侧栏场景下多次失败。拟 Web 用挂到 document.body 的原生 `<img>` / `<iframe>`，不再依赖 RN Image 尺寸。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `WebAttachmentLightbox`。图片预览走原生 img；PDF 浮窗也 portal 到 body，左栏用 iframe。改动仍在本地，须 push 后 CF 构建才会上线。

**关联**  
- `vouchap-app/src/mobile-ui/components/WebAttachmentLightbox.tsx`

---

### 2026-09-07（右栏图片与 PDF 预览仍失败：改到页面根节点）

**User（提示词/原意）**  
- 右侧栏预览问题仍在，且右侧栏 PDF 也无法预览。

**Assistant（实现前说明）**  
- 图片和 PDF 浮窗都还在 420px 右栏内部。拟把预览状态提到 ChatPanelContext，在 `_layout` 用与 receipts 相同的 `AttachmentImagePreviewModal` / `FileDetailModal` 挂到页面根。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `ChatPreviewHost`。右栏点图片/PDF 走 context，浮窗与详情页同一套组件、同一层级。Portalflow 已同步。未 commit。

**关联**  
- `vouchap-app/src/mobile-ui/components/ChatPreviewHost.tsx`、`ChatPanelContext.tsx`

---

### 2026-09-07（右栏提交历史图片预览只有黑罩）

**User（提示词/原意）**  
- 问题仍在。右栏提交历史里预览图片只有黑色遮罩；receipts 详情页预览正常。问二者是否该用同一套组件。

**Assistant（实现前说明）**  
- 已是同一组件 `AttachmentImagePreviewModal`。详情页挂在整页，右栏挂在 420px panel 内，RN-web Modal 被裁切/尺寸算错。拟 Web 上 portal 到 document.body。

**Assistant（实现后说明 / 本轮结论）**  
- 仍共用该组件。Web 预览挂到 `document.body`，尺寸用 `window.innerWidth/Height`。Portalflow 已同步。未 commit。

**关联**  
- `vouchap-app/src/mobile-ui/components/AttachmentImagePreviewModal.tsx`

---

### 2026-09-07（Web 图片预览只有下载图标没有内容）

**User（提示词/原意）**  
- Web 端图片预览出问题：有下载 icon，但没有预览内容。

**Assistant（实现前说明）**  
- 为长按保存把 Image 包进 Pressable，Web 上百分比高度塌成 0，只剩绝对定位的下载/关闭按钮。拟用视口像素尺寸直接渲染 Image。

**Assistant（实现后说明 / 本轮结论）**  
- `AttachmentImagePreviewModal` Web 用窗口宽高画图；`FileDetailModal` 图片预览不再包 Pressable。Portalflow 已同步。未 commit。

**关联**  
- `vouchap-app/src/mobile-ui/components/AttachmentImagePreviewModal.tsx`

---

### 2026-09-07（⌘V 长按会多次粘贴）

**User（提示词/原意）**  
- 粘贴转文件已可用，但按住 ⌘V / Ctrl+V 过久会多次粘贴。不必比对内容是否相同，一次按键响应一次即可。

**Assistant（实现前说明）**  
- 系统会发 key repeat，host 的 keydown 每次都 `clipboard.read()`。拟忽略 `e.repeat`，同一次按住只 claim 一次，松开后再允许下一次。

**Assistant（实现后说明 / 本轮结论）**  
- Vouchap / Portalflow 的 `WebChatClipboardPasteHost`：repeat 忽略；按住期间只入库一次。未 commit。部署后硬刷新再试长按 ⌘V。

**关联**  
- `vouchap-app/src/mobile-ui/components/WebChatClipboardPasteHost.tsx`

---

### 2026-09-07（CF 仍失败：vouchap-space-bootstrap 引用 @adaven）

**User（提示词/原意）**  
- 贴出 Cloudflare 构建日志：`4915374` 已能跑 Metro，但 `Unable to resolve module @adaven/platform-core` from `vouchap-space-bootstrap.ts`，由 `_layout.tsx` 引入。

**Assistant（实现前说明）**  
- 拆依赖的删除还在工作区未进该提交。拟提交并推送：删 bootstrap / 平台包装文件，去掉 `_layout` 的 import。

**Assistant（实现后说明 / 本轮结论）**  
- 已提交推送上述删除。CF 不应再解析 `@adaven/*`。构建成功后硬刷新再测右栏粘贴。

**关联**  
- `vouchap-app/src/shared-logic/vouchap-space-bootstrap.ts`、`vouchap-app/src/mobile-ui/app/_layout.tsx`

---

### 2026-09-07（确认：Vouchap 独立全套；Portalflow 对齐并走平台 space）

**User（提示词/原意）**  
- Vouchap 维持独立全套代码，不应依赖 Adaven-platform。  
- Portalflow 业务完全对齐 Vouchap，并依赖 Adaven-platform 统一 space 架构。  
- 右侧栏粘贴图片只需剪贴板 → 临时文件并关联，不需与文字混排。

**Assistant（实现前说明）**  
- 上一轮用 vendor 打进 `@adaven/*` 只为修 CF 构建，与「Vouchap 独立」冲突。拟从耦合前提交恢复 auth/space/metro/package.json，删除 vendor 与平台包装文件；粘贴保持 staged files。Portalflow 继续依赖 `@adaven/platform-*`。

**Assistant（实现后说明 / 本轮结论）**  
- 已恢复 Vouchap 自洽 auth / invitations / members / supabase / login / management；去掉 `@adaven` 依赖、`vendor/`、space-bootstrap 与未使用的 contenteditable 输入框。Metro 不再 watch 仓外 `Adaven-platform`（CF 构建不再 ENOENT）。Portalflow 仍走平台 space；右栏 ⌘V 只进附件暂存条。需 commit + push 后 CF 才会用这份独立代码构建。

**关联**  
- `vouchap-app/metro.config.js`、`vouchap-app/src/shared-logic/auth.ts`、`docs/ARCHITECTURE-PLATFORM.md`（Adaven）

---

### 2026-09-07（Cloudflare 构建失败：ENOENT Adaven-platform）

**User（提示词/原意）**  
- Cloudflare 最近几次提交都构建失败。日志里 Metro 去 `stat('/opt/buildhome/Adaven-platform')`，目录不存在，所以线上仍是旧包、看不到剪贴板图标。

**Assistant（实现前说明）**  
- 根因：`metro.config.js` 无条件把 `../../Adaven-platform` 加进 `watchFolders`；`package.json` 用 `file:` 指向该旁路仓库。CF Pages 只克隆 Vouchap。拟把 `platform-core` / `platform-ui` 打进 `vouchap-app/vendor/`，Metro 仅在目录存在时 watch。

**Assistant（实现后说明 / 本轮结论）**  
- 已 vendor 两包；`package.json` 改为 `file:./vendor/platform-*`；Metro / tsconfig 在本机有旁路仓时仍优先用它，CF 上走 vendor。需 commit + push 后 CF 才会重新构建。未部署 Direct Upload。

**关联**  
- `vouchap-app/metro.config.js`、`vouchap-app/vendor/`、`vouchap-app/package.json`

---

### 2026-09-07（粘贴仍无反应：只转暂存文件，不混排）

**User（提示词/原意）**  
- 仍然无效，粘贴无任何反应。不需图文混排，也不需在输入区显示图片缩略图；识别到剪切板是截图，应转为临时文件并加到输入区（附件暂存）。

**Assistant（实现前说明）**  
- 上一版 host 在 composer 上直接 return，composer 的 onPaste 又没打到，等于谁都不处理。按需求改回普通文字输入框；全局 paste / ⌘V 只负责把图片推进 staged files。另加剪贴板按钮作 clipboard.read() 兜底。

**Assistant（实现后说明 / 本轮结论）**  
- 输入框不再 contenteditable。截图进入上方附件条，不进文字框。部署后硬刷新；⌘V 或点剪贴板图标。若图标提示 Allow clipboard access，浏览器拦了读剪贴板。未 commit。

**关联**  
- `vouchap-app/src/mobile-ui/components/WebChatClipboardPasteHost.tsx`

---

### 2026-09-07（微信能粘贴、Web 右栏仍不能：textarea 不带图片）

**User（提示词/原意）**  
- 仍然不行，粘贴无反应。此刻在微信等处可以粘贴截图，说明图已在剪贴板，只是 Web 右栏输入框没把剪贴板截图转成暂存文件。

**Assistant（实现前说明）**  
- 微信是原生读系统剪贴板。Chrome/Safari 对 `textarea`（RN TextInput）的 paste 往往不带 `clipboardData.files`。拟把右栏输入改成 contenteditable，⌘V 时读文件；另用隐藏 contenteditable 接未聚焦输入框时的粘贴。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `WebChatComposerField` 替换桌面右栏 TextInput。粘贴图会进暂存并 toast Screenshot added。需再部署后硬刷新，点进右栏输入框再 ⌘V。未 commit。

**关联**  
- `vouchap-app/src/mobile-ui/components/WebChatComposerField.tsx`

---

### 2026-09-07（⌘V 仍无反应：全局粘贴 + Mac 截图说明）

**User（提示词/原意）**  
- 仍然不行，⌘V 没反应。

**Assistant（实现前说明）**  
- 监听仍挂在 chat-to-log 输入框上，RN-web 可能吃掉事件；Mac 的 ⌘⇧4 是存文件不是进剪贴板，⌘V 会是空的。拟在 ChatPanelProvider 根上挂全局 paste，写入 appendStagedFilesRef；空剪贴板且右栏已开时 toast 说明用 ⌃⌘⇧4。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `WebChatClipboardPasteHost`。成功会 toast “Screenshot added.”；右栏打开且剪贴板没有图时提示 Mac 快捷键。需再 push / 部署后硬刷新。未 commit。

**关联**  
- `vouchap-app/src/mobile-ui/components/WebChatClipboardPasteHost.tsx`

---

### 2026-09-07（Web 右栏粘贴截图仍无效：修复监听）

**User（提示词/原意）**  
- 已经 git 更新且 Cloudflare 自动部署成功，但 web 端测试仍不能粘贴截图。

**Assistant（实现前说明）**  
- 上一版 document 冒泡监听 + 要求 `#chat-web-composer` contains(target)。RN-web 的 `nativeID` 常常不会变成 DOM `id`，焦点在 TextInput 时会被直接 return；TextInput 还会 stopPropagation。拟：捕获阶段监听、给 composer/panel 写真实 `id`、TextInput onPaste、必要时 `clipboard.read()`。

**Assistant（实现后说明 / 本轮结论）**  
- Vouchap / Portalflow 已改钩子与输入区。需再 push 后等 Cloudflare 部署，硬刷新后再试：打开右栏，截图后 Ctrl/⌘V。未 commit。

**关联**  
- `vouchap-app/src/mobile-ui/lib/use-web-clipboard-image-paste.ts`

---

### 2026-09-07（Vouchap/Portalflow：PDF 预览白屏、Web 粘贴截图、图片长按保存）

**User（提示词/原意）**  
- Vouchap 应用三点优化：1）App 端预览 PDF 失败，浮窗白屏；2）Web 右侧栏支持从剪贴板粘贴截图；3）移动端预览附件图片可长按保存到本地。Portalflow 同步同样优化。

**Assistant（实现前说明）**  
- PDF 白屏：iOS 用 WKWebView 直接开 file:// PDF 常空白；Android 把整份 PDF 塞进 HTML + 单一 cdnjs，国内 CDN/体积都会失败；左侧预览区在原生缺少明确高度。拟改为与 Word 预览相同：本地下载 PDF，旁路写 HTML，PDF.js 多 CDN，WebView 给最小高度。  
- Web 粘贴：chat-to-log / WebChatFab 加 document paste，只收 image/*。  
- 长按保存：统一 AttachmentImagePreviewModal；无 expo-media-library 时走系统分享。两端各改一份拷贝，不改 Vouchap 库表。

**Assistant（实现后说明 / 本轮结论）**  
- Vouchap 与 Portalflow 均已改：`writeNativePdfPreviewHtmlPage`、侧栏 Ctrl/⌘V 贴图、图片预览长按/下载按钮保存。现有商店包没有 MediaLibrary 原生模块时会弹出系统分享（iOS 可选 Save Image）。PDF 需真机验证；Web 粘贴需登录后在右栏试。未 commit。

**关联**  
- `vouchap-app/src/mobile-ui/components/FileDetailModal.tsx`  
- `vouchap-app/src/mobile-ui/components/AttachmentImagePreviewModal.tsx`  
- `Adaven-platform/apps/portalflow-app` 同源文件

---

### 2026-09-07（CRM Vouchap：全部客户 68 vs 我的客户 88）

**User（提示词/原意）**  
- CRM 中 Vouchap 的客户：显示全部客户 68，我的客户却有 88，查看原因和问题。

**Assistant（实现前说明）**  
- 「全部客户」来自产品库现有 `spaces`（68）；「我的客户」来自 Hub `ops_assignments` 行数，迁库时把旧 Vouchap 88 条分配原样 upsert 过来，含已删空间。客户列表页已做交集所以列表不会到 88，工作台数字没有。拟：工作台/订单按现有租户 ∩ 分配计数；Hub 删除指向已不存在空间的分配。

**Assistant（实现后说明 / 本轮结论）**  
- 实测：68 个现有空间、88 条分配全挂在 `jamesgao@aim.link`，其中 20 条 tenant 已不在 `spaces`，跟进 0。已从 Hub 删除这 20 条，剩余 68=68。Dashboard / SpaceOrders 改为只统计仍存在的租户。刷新 CRM 即可看到两边都是 68；前端防御需再部署才进生产。

**关联**  
- `Adaven-CRM/src/pages/Dashboard.tsx`  
- `Adaven-CRM/src/pages/SpaceOrders.tsx`

---

### 2026-09-07（CRM 仓库更名为 Adaven-CRM）

**User（提示词/原意）**  
- 代码仓库和 git 项目更名为 Adaven-CRM。

**Assistant（实现前说明）**  
- GitHub `jamesgao27/Vouchap-crm` → `Adaven-CRM`；本地目录 `/Users/macbook/vouchap-crm` → `/Users/macbook/Adaven-CRM`。同步当前文档/规则里的仓库名。不改历史 PRD 附录原文。不提交业务代码。

**Assistant（实现后说明 / 本轮结论）**  
- GitHub 与本地目录已更名。Vouchap `.cursorrules` / README 改为指向 `Adaven-CRM`。Adaven-platform 架构文档同步。Cursor 多根 Workspace 需把旧路径换成 `/Users/macbook/Adaven-CRM`。

**关联**  
- `https://github.com/jamesgao27/Adaven-CRM`  
- `/Users/macbook/Adaven-CRM`

---

### 2026-09-06（Wholestore proposal 精简并迁到 Adaven-platform）

**User（提示词/原意）**  
- 客户反馈 Vouchap 项目里上次写的 proposal 过于复杂。按 Adaven-platform 规范架构优化；内容以计划功能模块为主；定价按开发部署 8000 美元、后续每月 200 美元订阅反算明细与付费节奏；proposal 文件放到 Adaven-platform。

**Assistant（实现前说明）**  
- 不改业务代码。旧稿过重处：逐页表格、ERP/QBO/物流检查清单、人周/CAD 算法、多档订阅。新稿对齐 Vendor/Dealer 独立租户、Web+扫码、ERP/QBO 仍为外部账本；七个模块金额加总 = 8000；月费四项加总 = 200；付款 40/40/20 + 上线起月订。新文件写在 Adaven `docs/PROPOSAL-Wholestore.md`；Vouchap 旧稿只加归档说明。

**Assistant（实现后说明 / 本轮结论）**  
- 已写入 `Adaven-platform/docs/PROPOSAL-Wholestore.md`。Vouchap `docs/PROPOSAL-Wholestore.md` 顶部标明已归档、指向新路径。无代码变更。订阅只保留 $200/月，未另设年付档。

**关联**  
- `Adaven-platform/docs/PROPOSAL-Wholestore.md`  
- `Vouchap/docs/PROPOSAL-Wholestore.md`（归档）

---

### 2026-09-04（Wholestore 库也统一为 provider/consumer；不动 Vouchap）

**User（提示词/原意）**  
- Wholestore 的数据库中也应该如此规范统一。以上一切都不动现有的 Vouchap 应用及其数据库。

**Assistant（实现前说明）**  
- 只改 Adaven `foyecolycmxcneflpant` 与 `wholestore-app` / `packages/db-platform` 追加 SQL。不碰 `giuacjbfsyrristkigmz`、不改 Vouchap 应用。历史 010–035 不重写，追加 036。UI 路由 `/dealers` 与文案 Dealer/Vendor 保留。

**Assistant（实现后说明 / 本轮结论）**  
- 远程已 apply `20260904160000_overlay_no_ui_words_in_db.sql`（因 030–035 当年用 `db query` 未入 migration history，先 repair 为 applied 再 push）。表 `consumer_follow_ups` / `consumer_invite_tokens`，列 `max_consumers`；RPC 如 `create_consumer_with_space`、`consumer_apply_to_provider`、`provider_accept_consumer_invite_token`、`ensure_provider_default_poster`。OUT 列 `provider_name` / `consumer_name`。  
- 应用查询：`provider.ts` / `consumer.ts` / `dealer-invites.ts` / `posters.ts`。同源副本 `packages/db-platform/sql/036_overlay_no_ui_words_in_db.sql`。未改 Vouchap。未 commit。

**关联**  
- Adaven `apps/wholestore-app/supabase/migrations/20260904160000_overlay_no_ui_words_in_db.sql`

---

### 2026-09-04（库内不要 dealer / firm / client：只保留 provider/consumer）

**User（提示词/原意）**  
- 数据库中也不应该有 dealer。firm/client、vendor/dealer 都是前端 UI 用词；数据库的 space 应该全部是 provider/consumer。

**Assistant（实现前说明）**  
- 上一轮为对齐 Wholestore 把 follow-up / invite token 改成了 `dealer_*` / `max_dealers`。纠正：Portalflow 库对象只用 provider/consumer。已 apply 的 150000 不改 checksum，追加 152000。应用查询跟着改。不碰冻结 Vouchap。Wholestore `dealer_*` 本轮不扩 scope。

**Assistant（实现后说明 / 本轮结论）**  
- `20260904152000_overlay_no_ui_words_in_db.sql` 已 push 到 `xvqlqvtfogxkfeillvig`：`dealer_follow_ups`→`consumer_follow_ups`，`dealer_invite_tokens`→`consumer_invite_tokens`，`max_dealers`→`max_consumers`；顺带把遗留 firm/client 的 index/constraint/policy/trigger 名改成 provider/consumer。`spaces.client_profile_type`（household/business）保留。  
- `firm.ts` / `firm-clients.ts` 已改表名与列名。远程 overlay 表/列/约束/策略名查询无 dealer，也无（非 confirm/profile 的）firm/client。未 commit。

**关联**  
- Adaven `apps/portalflow-app/supabase/migrations/20260904152000_overlay_no_ui_words_in_db.sql`

---

### 2026-09-04（Portalflow overlay 对齐 Wholestore 的 provider/consumer 标识）

**User（提示词/原意）**  
- 把 Portalflow 空库上的 firm/client 表名、列名、RPC 改成与 Wholestore 相同的 provider/consumer 标识；产品 UI 仍叫 Firm/Client，且不把订单/SKU 收成 Wholestore 的 order_lines 模型。按已批准计划实现，不要改 plan 文件本身。

**Assistant（实现前说明）**  
- 冻结 Vouchap 库与仓库不动。只对 Portalflow `xvqlqvtfogxkfeillvig` 追加 rename 迁移，不重写 200+ 条历史迁移。UI 文案与 `/firm` 路由、Portalflow 独有 `sku_items` / 1:1 orders / groups / permission_roles 保留。应用查询改为 `.schema('provider')` 与新列名/RPC 名；TS 产品层仍用 Firm/Client 变量名。

**Assistant（实现后说明 / 本轮结论）**  
- 已 `db push`：`20260904150000_overlay_provider_consumer_identifiers.sql`（schema `firm`→`provider`，表/列/RPC rename，新建 `consumer.consumers`，PostgREST schemas = `public, graphql_public, crm, provider, consumer`）。函数体全局 `firm.` 替换曾误伤别名 `us_firm`，改为只替换 schema 限定出现。  
- 追加 `20260904151000_overlay_provider_search_path.sql`：`pg_get_functiondef` 的 `SET search_path TO 'public', 'firm'` 未被第一条迁移改到；现已全部改为 `provider, consumer`，远程 leftover = 0。无 `firm` schema。  
- 应用：`firm.ts` / `firm-clients.ts` / `auth.ts` / quota / entitlements / permissions / realtime 等改为 `provider` schema、`providers`/`consumers`/`dealer_*` 表、`provider_space_id`/`consumer_space_id`/`consumer_id`、对应 RPC。`p_client_name` 与 `spaces.client_profile_type` 未改。JSON 配额键读 `consumer_recognition`。  
- 文档：`config.toml`、`ARCHITECTURE-PLATFORM.md`、`APPLY.md`。未 commit、未碰 `giuacjbfsyrristkigmz`。

**关联**  
- Adaven `apps/portalflow-app/supabase/migrations/20260904150000_overlay_provider_consumer_identifiers.sql`  
- Adaven `apps/portalflow-app/supabase/migrations/20260904151000_overlay_provider_search_path.sql`

---

### 2026-09-04（Portalflow 使用与 Vouchap 相同的 Gemini key）

**User（提示词/原意）**  
- Gemini 的 key 采用原 Vouchap 一样的。

**Assistant（实现前说明）**  
- 从冻结库 `giuacjbfsyrristkigmz` 的 Function secrets / 本机历史取出 `GEMINI_API_KEY`，写入 Portalflow `xvqlqvtfogxkfeillvig`。不把密钥写入仓库或对话。不改 Vouchap。

**Assistant（实现后说明 / 本轮结论）**  
- Vouchap 上确实有 `GEMINI_API_KEY`（及 DeepSeek 相关 secrets）。本机可还原同一把 Google key。对 Portalflow 执行 `supabase secrets set` 返回 403（当前 CLI 账号无写 secrets 权限）。已把该 key 放进剪贴板；需 Owner 在 Dashboard Secrets 粘贴为 `GEMINI_API_KEY`。未复制 DeepSeek。

**关联**  
- Adaven `apps/portalflow-app/supabase/APPLY.md`

---

### 2026-09-04（Portalflow Auth URL 已配；SMTP / AI 密钥稍后）

**User（提示词/原意）**  
- Auth URL Configuration 已经配置；SMTP 与 Functions 密钥（原 2、3）随后处理。

**Assistant（实现前说明）**  
- 无代码变更。记下 Auth 已完成，不代配 SMTP / GEMINI。

**Assistant（实现后说明 / 本轮结论）**  
- 登录/OAuth/邀请跳转可以按 `https://portalflow.pages.dev` 与 `portalflow://` 走。邀请邮件要等 SMTP；AI 识别要等 Function secrets。已把 `APPLY.md` 待办改成「稍后」。

**关联**  
- Adaven `apps/portalflow-app/supabase/APPLY.md`

---

### 2026-09-04（Portalflow 新库 xvqlqvtfogxkfeillvig；其余基础设施直接处理）

**User（提示词/原意）**  
- Portalflow 的 Supabase 项目 ID 是 `xvqlqvtfogxkfeillvig`；其他直接处理。

**Assistant（实现前说明）**  
- 只连这个空库，不碰冻结 Vouchap `giuacjbfsyrristkigmz`、Wholestore `foyecolycmxcneflpant`、Pages `vouchap`。计划：link + `db push` 修历史迁移、配 `.env`/GitHub secrets、建 Pages `portalflow`、推 Auth/API、部署 Edge Functions、Direct Upload Web。

**Assistant（实现后说明 / 本轮结论）**  
- 已 link 并 `db push` 至 `20260904020000`（含 kernel `provider`/`consumer`、`create_space_with_user`、CRM `sku_edition`/`space_orders`、storage buckets）。过程中修了几条「旧库升级」迁移：`client_labels` FK 顺序、`suppliers.merged_into_id`、purposes `usage_count`/`scope`、补 CRM 建表。  
- PostgREST：`ALTER ROLE authenticator` 已暴露 `public, graphql_public, crm, firm`。CLI `config push` 因账号对 API 设置 403，Auth Site URL / Redirect 需 Owner 在 Dashboard 手填。  
- Functions：`gemini-proxy`、`send-invitation-email` 已部署；尚未设 `GEMINI_API_KEY` / SMTP。  
- GitHub secrets `PORTALFLOW_EXPO_PUBLIC_*`、Pages `portalflow`（无 Git）已就绪；`npm run portalflow:deploy:web` 已发到 `https://portalflow.pages.dev/`（bundle 指向新库）。未迁任何 Vouchap 用户。原生 EAS 仍待 `eas init`。

**关联**  
- Adaven `apps/portalflow-app/supabase/APPLY.md`、`docs/PUBLISH.md`

---

### 2026-09-04（Adaven 按理想 B2B 内核开发 Portalflow；新库；不迁 Vouchap 用户）

**User（提示词/原意）**  
- Adaven-platform 现在按照理想的 B2B 底层修改，按照迁移到新 supabase 的方案，新底层开发的 Vouchap 采用新名字 Portalflow，不用考虑 Vouchap 已有的用户数据的包袱。

**Assistant（实现前说明）**  
- 原 Vouchap 仓库 / 生产库 / Pages `vouchap` 冻结不动。Adaven 内应用改名为 Portalflow，内核 kind 只用 provider/consumer，UI 仍为 Firm/Client。新空 Supabase + 新 Pages `portalflow`，不迁用户。

**Assistant（实现后说明 / 本轮结论）**  
- `apps/vouchap-app` → `apps/portalflow-app`；根脚本 `portalflow:*`；CI 改为 `deploy-portalflow-web.yml`（目标 Pages `portalflow`，密钥 `PORTALFLOW_EXPO_PUBLIC_*`）。已删除会误发到现网 `vouchap` 的旧 workflow。  
- 空间创建：`create_space_core(p_kind)` + 产品 RPC `create_space_with_user` 包一层写 `firm.*`；`spaces.kind` 默认 `consumer`。  
- 品牌：scheme/bundle `portalflow` / `com.portalflow.app`，未沿用 Vouchap EAS id。原生 `ios/Vouchap` 树尚未 prebuild 改名。  
- 新库尚未创建：需用户新建 Supabase、`db push`（见 `apps/portalflow-app/supabase/APPLY.md`）、建 Pages `portalflow`、配 GitHub secrets。已解除对本机 CLI 指向 `giuacjbfsyrristkigmz` 的 link 缓存。

**关联**  
- Adaven `docs/ARCHITECTURE-PLATFORM.md`、`docs/PUBLISH.md`、`apps/portalflow-app/supabase/APPLY.md`

---


**User（提示词/原意）**  
- Vouchap 原代码库维持不变；Adaven-platform 中的 Vouchap 用新方式（内核 provider/consumer）。再分析 app 过渡：原库改名 or 迁新库。

**Assistant（实现前说明）**  
- 不改原仓库代码。把 next 设计与 A/B/C 切流写进 `docs/ARCHITECTURE-PLATFORM.md`。

**Assistant（实现后说明 / 本轮结论）**  
- 开发必须对着 clone/staging，不能往生产库写新 kind。  
- 原库改名会立刻打断未升级的原生包。迁新库可双跑但 auth/OAuth 难。同库双词兼容（firm≡provider）适合要保住 vouchap.com 和旧 Store 包。推荐：staging 用新库开发；生产优先 C 或等旧客户端下线再 A。

**关联**  
- `docs/ARCHITECTURE-PLATFORM.md` · Vouchap cutover

---


**User（提示词/原意）**  
- 再明确：1）各 app 不同 Supabase、不同账号池，独立业务应用。2）space 底层类型是 provider/consumer；业务层 Vouchap=Firm/Client，Wholestore=Vendor/Dealer，以后其他 B2B 再映射其他角色名。

**Assistant（实现前说明）**  
- 把该约定写入 `docs/ARCHITECTURE-PLATFORM.md`、kernel SQL 注释、`platform-core` 的 `kind` 类型。不改 Vouchap 生产库、不改 Wholestore 现有 Factory 文案（仅记录 canonical 为 Vendor）。

**Assistant（实现后说明 / 本轮结论）**  
- 内核 kind 固定两值；产品只改 `spaceKinds` 的 label。Vouchap 现网仍写 firm/client，属待切齐的 gap，不能靠迁库到 Wholestore 解决。

**关联**  
- `docs/ARCHITECTURE-PLATFORM.md` · Space kinds；`packages/db-platform/sql/000_kernel.sql`

---

### 2026-09-04（space/user 并非同一套基础平台，与最初构想差异）

**User（提示词/原意）**  
- 按当前设计，两个应用在 space/user 层面并非同一套基础平台，与最初构想不同。希望公司基于 B2B 的所有应用都用同一套 space/user 架构和代码，避免多版本维护。

**Assistant（实现前说明）**  
- 无代码变更。拆清三层：内核代码、内核 schema、是否同一套账号数据。对照现状与可收敛路径。

**Assistant（实现后说明 / 本轮结论）**  
- 代码层 `platform-core` / `platform-ui` 已是一套；分叉在内核 SQL：`000_kernel.sql` 把 `spaces.kind` 写成 provider|consumer，Vouchap 库是 firm|client。  
- 「同一套架构和代码」应对齐为：通用 kernel 表+RPC（kind 为产品注入的字符串），产品 overlay 分库；不必把 Vouchap 用户迁库或改 kind 取值。  
- 「同一套账号（一个登录打通所有产品）」是另一决策，当前文档是 share code, not accounts。

**关联**  
- `packages/db-platform/sql/000_kernel.sql`、`001_create_space_core.sql`、`packages/platform-core/src/spaces.ts`

---


**User（提示词/原意）**  
- 数据库层面 Vouchap 原库是 firm/client，通用平台改成 provider/consumer，检查差异。  
- 用户数据迁移：1）原库改表名（已发布 app 会挂）；2）新建 Supabase 项目、发布成功后再迁数据。

**Assistant（实现前说明）**  
- 无代码变更。对照 Vouchap migrations（`firm`/`client`）、`packages/db-platform`（Wholestore `provider`/`consumer`）、以及「禁止把 db-platform 打到 Vouchap 库」的约定。

**Assistant（实现后说明 / 本轮结论）**  
- provider/consumer 是 Wholestore 新库的命名，不是把 Vouchap 生产库改名。Vouchap 应继续用 `giuacjbfsyrristkigmz` + firm/client。  
- 两套 schema 不是 1:1（报税收据/CRM billing vs posters/marketplace；SKU/订单模型不同）。  
- 推荐：Vouchap 上线 Adaven 副本时只换前端、不迁库。不要用方案 1 改原库。方案 2 适用于新产品空库（Wholestore 已是），不适用于把 Vouchap 用户搬进 provider 模型。

**关联**  
- `packages/db-platform/sql/010_wholestore_provider_consumer.sql`、`apps/wholestore-app/supabase/APPLY.md`、Vouchap `firm` schema

---


**User（提示词/原意）**  
- 目前 Vouchap 应用还是用的原代码库，对比与迁移到 Adaven-platform 的对应代码差异。

**Assistant（实现前说明）**  
- 无代码变更。对照 `/Users/macbook/Vouchap/vouchap-app` 与 `Adaven-platform/apps/vouchap-app`（含 `packages/platform-*`）。

**Assistant（实现后说明 / 本轮结论）**  
- 产品业务 src 几乎相同（收据/Firm/报税等未改）；差异集中在内核屏从本地实现改为 `platform-ui` 再导出、`configureProductUi`、Management 菜单（Space roles、billing）、以及发布（workspace + Direct Upload / Actions vs 原仓库 file: 依赖 + Pages Git）。  
- 两边 version 都是 2.6.6；Supabase migrations 210 个文件一致。

**关联**  
- `Vouchap/vouchap-app`、`Adaven-platform/apps/vouchap-app`、`packages/platform-ui`、`packages/platform-core`

---


**User（提示词/原意）**  
- factory 侧管理 dealer 需完全复用 firm 管理 client：  
  1. 填 email 定向邀请  
  2. 发出二维码或链接进行公开邀请  
  3. 对 dealer 进行分类打标、添加跟进记录、查阅历史订单  
  4. 页面元素和交互应完全复用

**Assistant（实现前说明）**  
- 对照 Vouchap `app/firm/clients.tsx` / `client/[id]` / `FirmAddClientModal` / open-invite token。映射到 `provider.consumers`，不抄 `firm.*`、不代建 space、Factory 不直插订单。  
- SQL 033：`labels` / `last_follow_up_at` / `invite_token_id`、`provider.dealer_invite_tokens`、`provider.dealer_follow_ups`；公开邀请 accept 为 DEFINER RPC，Dealer 侧建单。  
- UI：Dealers 工具栏 Add dealer / Open invite / Group / Filter / Search；详情 Info（标签+跟进）+ Orders。

**Assistant（实现后说明 / 本轮结论）**  
- SQL：`packages/db-platform/sql/033_dealer_invites_labels_followups.sql`（Wholestore 库 `foyecolycmxcneflpant` 执行）。  
- 列表对齐 Clients：绿/黄点、Status 优先首标签、Last follow-up、First order；Add dealer 必填 email（pending 定向邀请）；Open invite 选已发布 SKU + 有效期 + QR/Copy/History。  
- 详情：Info 打标与 Follow-up history；订单事件写入跟进；无 Factory「New order」。落地页 `/dealer-join?token=`。  
- 验证：Factory 发定向邀请后列表黄点；打标签后 Status 列显示标签；写跟进后 Last follow-up 更新；公开邀请链接以 Dealer 账号接受后出现 enrollment + 订单。  
- 残留：未做 Firm 权限组 Groups；未发邀请邮件（与 Vouchap 勾选 disabled 一致）；Assignee 列占位为 —。

**关联**  
- `apps/wholestore-app/src/app/dealers`、`src/app/dealer-join.tsx`、`src/lib/dealer-invites.ts`、`packages/db-platform/sql/033_dealer_invites_labels_followups.sql`

---

### 2026-08-21（Wholestore Provider 复用 Vouchap Firm：Dealer / Order / SKU）

**User（提示词/原意）**  
- Wholestore 的 provider 端，复用 Vouchap 的 firm 端。  
- 增加客户（client → dealer）、订单（engagement → order）主数据；订单支持多 SKU。  
- 同样支持配置 SKU；SKU 较 Vouchap 简化，不需 items。  
- 页面结构和元素（如表格样式和交互）上应完全复用 Vouchap 已有的设计。

**Assistant（实现前说明）**  
- 把 Firm 共用的 DataTable / CenterModal / ProjectListCardAndRow 抽到 `platform-ui`，Vouchap 改为 re-export。  
- Wholestore 新增 `provider.skus`、`provider.orders`、`provider.order_lines`；Dealer 沿用 `provider.consumers`（允许 pending、无 space）。  
- 页面：Dealers / Orders / Catalog 对齐 Firm Clients / Engagements / Service Catalog 的工具栏 + 表格/卡片，SKU 详情只保留 Info（无 Todos/items）。

**Assistant（实现后说明 / 本轮结论）**  
- 共用组件：`packages/platform-ui/src/list/*`；Vouchap `components/DataTable.tsx` 等改为从 `@adaven/platform-ui` 导出。  
- SQL：`packages/db-platform/sql/030_provider_catalog_orders.sql`（需在 Wholestore 库执行）。订单 1:N SKU；SKU 无 items。  
- Provider 侧栏：Insights / Dealers / Orders / Catalog。文案 English。  
- 验证：Factory space 登录后侧栏三栏目；Add dealer / Add order（多选 SKU+数量）/ New SKU；表格列显隐与 Firm 同一套 DataTable。  
- 残留：须先跑 030 SQL，否则列表会报 relation does not exist；Dealer 认领/邀请链路未做（仅主数据）；无价格/ERP。

**关联**  
- `apps/wholestore-app/src/app/dealers`、`orders`、`catalog`、`src/lib/provider.ts`、`packages/db-platform/sql/030_provider_catalog_orders.sql`

---

### 2026-08-21（基础功能在 Management 内复用；侧栏只放业务页）

**User（提示词/原意）**  
- 现在看起来基础页面仍然不是复用，而是模仿另写的。  
- 约定的基础功能，应该都在 management 页面内。  
- Web 端左侧栏的各栏目都是业务页面。

**Assistant（实现前说明）**  
- 纠正把 Team / Space roles 做成内核侧栏栏目的做法。Vouchap `management.tsx` 才是设置中枢真源，应整页迁入 `platform-ui`，两边 re-export 同一份。  
- 侧栏只保留 chrome（品牌、点空间/用户进 Management）+ 各产品 `getSidebarNavItems` 业务导航。Members / Space roles 只作为 Management 菜单项。

**Assistant（实现后说明 / 本轮结论）**  
- `packages/platform-ui/src/screens/ManagementScreen.tsx` 为 Vouchap 原 management 迁入后的内核页；`apps/vouchap-app` 与 `apps/wholestore-app` 的 `management.tsx` 均为 `export { ManagementScreen as default }`。  
- WebSidebar 去掉 Team / Space roles；Vouchap 业务栏（Dashboard/Expenses/Income 或 Firm Insights/Clients…）经 `getVouchapSidebarNavItems` 注入；Wholestore 侧栏目前只有 Dashboard。  
- Management 菜单：内核 Members + Space roles，产品行由 `getManagementMenuItems` 追加（含原硬编码的 Subscription and billing）。  
- 验证：改 Management 布局只动 `packages/platform-ui`；Wholestore 侧栏不应再出现 Team/Space roles；点空间名进入与 Vouchap 同一套 Management。  
- 残留：Wholestore 尚无 logo 上传（未配 `uploadSpaceImage`）；Create Space 弹窗在 Management 内仍存在但入口主要走 setup-space。

**关联**  
- `packages/platform-ui/src/screens/ManagementScreen.tsx`、`packages/platform-ui/src/chrome/WebSidebar.tsx`、`packages/platform-ui/src/product.ts`、`docs/ARCHITECTURE-PLATFORM.md`

---

### 2026-08-21（Adaven-platform 为唯一 SoT；基础页必须复用而非复制）

**User（提示词/原意）**  
- 后续 Vouchap 和 Wholestore 都应在 Adaven-platform 代码库中，Cloudflare 根目录是各自的 app 文件夹，才能共用同一套基础代码。  
- 后续 Vouchap 迭代全部走 Adaven-platform（仍关联原 Supabase、原 Cloudflare Pages、原 Expo/EAS）。现在的 Vouchap git 只留备份。  
- 共用的基础功能页面应**完全复用**，而不是复制模仿一份。

**Assistant（实现前说明）**  
- 纠正先前「Pages 根目录留空 monorepo 根」的做法：Dashboard 根目录应对齐现有模式，改为 `apps/vouchap-app` / `apps/wholestore-app`，构建时 `cd ../.. && npm ci` 安装 workspace 包。  
- 将 login / register / reset-password / setup-space / space-members / handle-invitations / invite / space roles 从 Wholestore 拷贝页抽到 `packages/platform-ui`；两 app 路由只 re-export。Vouchap 的 Firm 证明等产品字段用 `configureProductUi` 的 extras slot，不复制整页。

**Assistant（实现后说明 / 本轮结论）**  
- `packages/platform-ui` 现含内核屏幕 + toast/确认框；两 app 的对应 `app/*.tsx` 已改为 `export { XxxScreen as default } from '@adaven/platform-ui'`。  
- Cloudflare：同一 Pages 项目 **`vouchap`**，Git 改为 `Adaven-platform`，Root = `apps/vouchap-app`，构建 `cd ../.. && npm ci && npm run web:export --workspace=vouchap-app`，输出 `dist`，分支 `main`。Wholestore 新项目 Root = `apps/wholestore-app`。EAS 增加 `eas-build-pre-install`。  
- 验证：改内核页只动 `packages/platform-ui`；Vouchap 登录品牌仍为 Vouchap（bootstrap `configureProductUi`）；不要往错误 Pages 项目部署。  
- 残留：Vouchap `management` / WebSidebar 仍含产品导航（收据/Firm），未整页抽核；Wholestore `management.tsx` 仍是独立空间设置页。

### 2026-08-21（核对 Dashboard：现有 Pages 项目名是 vouchap）

**User（提示词/原意）**  
- 贴了 Cloudflare 截图：这是 Vouchap 现在的配置。

**Assistant（实现前说明）**  
- 截图确认生产项目 slug 是 **`vouchap`**（不是先前猜测的 `vouchap-app`）。Git 仍是 `jamesgao27/Vouchap`，根目录 `vouchap-app`，构建 `npx expo export -p web`，输出 `dist`，生产分支 `AI-Tax-filing`。  
- 须把 CLI/`wrangler.toml` 改成 `--project-name=vouchap`，文档写成「改这个项目、不要新建」。

**Assistant（实现后说明 / 本轮结论）**  
- `wrangler.toml` `name` 与 `deploy:web` 已改为 `vouchap`。  
- `docs/PUBLISH.md` 记录了当前 Dashboard 值，以及迁到 `Adaven-platform` 时同一项目应改成：空根目录、`npm ci && npm run web:export --workspace=vouchap-app`、输出 `apps/vouchap-app/dist`、生产分支 `main`。  
- 验证：Dashboard 项目名仍是 vouchap；CLI `npm run vouchap:deploy:web` 必须打到该项目。

### 2026-08-21（同一 monorepo：Vouchap 仍发到现有 Cloudflare，Wholestore 独立项目）

**User（提示词/原意）**  
- 需要注意同一个项目中，支持 Vouchap 仍发布到现在已有的 Cloudflare 项目。也就是以后 Adaven-platform 项目中，同一套统一的基础功能，支持发布不同的业务应用（当前是 Vouchap 和 Wholestore 两个）。

**Assistant（实现前说明）**  
- 内核共用、账号/Supabase/Pages 不共用。Vouchap 的 `deploy:web` 原先没有 `--project-name`，在 monorepo 里可能误打到别的 Pages 项目。  
- 计划：根文档 `docs/PUBLISH.md`；Vouchap `wrangler.toml` 钉死现有项目名并用 `--project-name=vouchap-app`；Wholestore 仍用 `wholestore`；Git 侧同一 GitHub 仓挂两个 Pages 项目。

**Assistant（实现后说明 / 本轮结论）**  
- `docs/PUBLISH.md`：一套内核、每应用独立 Pages。根脚本 `vouchap:deploy:web` / `wholestore:deploy:web`。  
- Vouchap：`apps/vouchap-app/wrangler.toml` + `deploy:web --project-name=vouchap-app`。若 Dashboard 项目 slug 不是 `vouchap-app`，只改 toml 的 `name`，不要新建项目。  
- Git：现有 Vouchap Pages 项目把源仓库改到 `Adaven-platform`（不要新建）；Wholestore 另建 Pages 项目连同一仓。  
- 验证：Dashboard 确认 Vouchap 项目名与 toml 一致后 `npm run vouchap:deploy:web`；Wholestore `npm run wholestore:deploy:web` 只出现 `wholestore`。

### 2026-08-21（按 Vouchap 页面复制 Wholestore Space/Members + Cloudflare Web）

**User（提示词/原意）**  
- 可以注册通了。按照 Vouchap 的页面完全复制，实现 Wholestore 的 space 和 members 的完整功能。web 端同样通过 Cloudflare 来构建发布。

**Assistant（实现前说明）**  
- 注册已通；Wholestore 当时是极简壳页，不是 Vouchap 的 login/setup-space/space-members/handle-invitations/management/WebSidebar。  
- 计划从 `Adaven-platform/apps/vouchap-app` 拷贝这些页面，auth/邀请走 `@adaven/platform-core`；Firm CRM 不搬。Space type 用 Factory(Provider)/Dealer(Consumer)。  
- Web 发布对齐 Vouchap：`expo export -p web` + `wrangler pages deploy dist`，独立 Pages 项目 `wholestore`，不用 Vouchap 域名。

**Assistant（实现后说明 / 本轮结论）**  
- Wholestore 已对齐 Vouchap 交互：登录/注册/重置密码、Setup Space、邀请队列与 `/invite/[id]`、Team（pending/declined/cancelled/removed）、Management（改空间名、切空间、登出）、Space roles、Web 左侧栏。  
- Cloudflare：`apps/wholestore-app/docs/DEPLOY-CLOUDFLARE.md`；本地 `npm run wholestore:deploy:web`。本机 `wrangler` 未登录，未能实际上传到 Pages；构建 `expo export -p web` 已成功。  
- 验证：`npm run wholestore:web` 走创建空间 → 邀请 → 接受；`npx wrangler login` 后再 `npm run wholestore:deploy:web`。  
- 已知限制：无 send-invitation-email Edge Function；空间 logo 上传未搬（无 storage）；不搬 Firm/订单。

### 2026-08-21（Wholestore 登录报 EAS Secrets / Supabase 未配置）

**User（提示词/原意）**  
- 报错：网络配置错误：Supabase 未正确配置。请在 EAS Secrets 中设置 EXPO_PUBLIC_SUPABASE_URL / ANON_KEY。

**Assistant（实现前说明）**  
- 本地 web 不需要 EAS Secrets。终端 `env: export` 只有 URL；磁盘 `.env` 的 ANON_KEY 为空。文案是 platform-core 从 Vouchap 抄来的误导信息。

**Assistant（实现后说明 / 本轮结论）**  
- 已把 Wholestore `.env` 的 anon key 写回磁盘并加引号；`app.config.js` 自行读 `.env`（空值也会覆盖）。  
- 登录错误改为英文、指向 `.env` + 重启 Expo，不再提 EAS Secrets。  
- 验证：停掉当前 `wholestore:web` 再开一次，登录/注册不应再出现该报错。

### 2026-08-21（Wholestore 完整 Space / User / 邀请 / 内部权限）


**User（提示词/原意）**  
- 看到新库已经建了一些表了，但跟 Vouchap 相比还不够。需要完整实现创建 space、user、space member 邀请、space 内部权限配置。

**Assistant（实现前说明）**  
- 新库已有 `users/spaces/user_spaces/space_invitations` 和 `create_space_core`，但缺接受/拒绝/移除/改角色 RPC，应用也只有只读成员列表。  
- 权限对齐 Vouchap 空间内核：Admin / Member（`is_admin`），不搬 Firm `permission_roles`（订单经理）。  
- 计划：`020_space_membership.sql` + platform-core API + Wholestore 邀请/角色/切换空间界面；SQL 只推 `foyecolycmxcneflpant`。

**Assistant（实现后说明 / 本轮结论）**  
- SQL：`accept/decline_space_invitation`、`remove_space_member`、`set_space_member_admin`、`leave_space`、邀请可读 RPC、邀请可选 Admin、最后一名管理员保护。  
- 应用：注册/登录后处理待接受邀请；Team 邀请/移除；Space roles 改 Admin/Member；邀请深链 `/invite/[id]`。  
- 验证：在 Wholestore 库执行 `020`；用两个邮箱走创建空间 → 邀请 → 接受 → 改角色 → 移除。  
- 已知限制：未部署 `send-invitation-email` Edge Function，邀请链接需手动分享；无 Firm 订单级角色。

**关联**：`packages/db-platform/sql/020_space_membership.sql`、`apps/wholestore-app/src/app/{members,permissions,handle-invitations,invite}`

### 2026-08-21（james.aim.link 能否改成 Developer）


**User（提示词/原意）**  
- `james.aim.link@gmail.com` 的权限改为 Developer 行不行？看起来权限是够的。

**Assistant（实现前说明）**  
- 无代码。对照官方 Access Control：Developer 能改库内容，不能改项目设置。

**Assistant（实现后说明 / 本轮结论）**  
- 可以改成 Developer。日常 `db query` / 推 SQL 够用。Owner 仍建议留给 `jamesgao27@gmail.com`。  
- 不能做的：改 API Exposed schemas、Auth、账单、加人。此前 PATCH PostgREST 属于设置，以后要改需 Owner。先前说 Developer 不够推 SQL，过严。

### 2026-08-21（Wholestore 组织已邀请原账号；CLI 推 SQL）


**User（提示词/原意）**  
- 新 supabase 组织已邀请原账号 `james.aim.link@gmail.com`。

**Assistant（实现前说明）**  
- 先确认 CLI 能看到 Adaven2 / `foyecolycmxcneflpant`，再只对该库执行 `000_kernel.sql`、`010_wholestore_provider_consumer.sql`，并暴露 `provider`/`consumer` schema。不动 Vouchap。

**Assistant（实现后说明 / 本轮结论）**  
- CLI 已可见 org Adaven2 与项目 Wholestore。两份 SQL 均 `exit 0`。  
- 已建：`public.users/spaces/user_spaces/space_invitations`，`provider.providers/consumers/member_consumers`，`consumer.consumers`；`spaces.kind` 为 provider|consumer；`create_space_core` 等 RPC 存在。  
- PostgREST Exposed schemas 已含 `provider, consumer`。可用 `npm run wholestore:web` 做注册/建 Space。

**关联**  
- `packages/db-platform/sql/000_kernel.sql`  
- `packages/db-platform/sql/010_wholestore_provider_consumer.sql`

### 2026-08-21（Wholestore 库在另一账号/组织）


**User（提示词/原意）**  
- Wholestore 的 supabase 库在另一个账号名下，organization slug：`ugmjeltmjiqmwevwlfnk`。Owner 是 `jamesgao27@gmail.com`。

**Assistant（实现前说明）**  
- 无代码变更。核对 CLI（`james.aim.link@gmail.com`）对该 org 是否仍 403，并写出可执行授权步骤。

**Assistant（实现后说明 / 本轮结论）**  
- org `ugmjeltmjiqmwevwlfnk` 与项目 `foyecolycmxcneflpant` 对该 CLI 仍 403。SQL 未推。  
- 授权：用 owner 在 https://supabase.com/dashboard/org/ugmjeltmjiqmwevwlfnk/team 邀请 `james.aim.link@gmail.com` 为 Owner；或本机 `supabase login` 换成 `jamesgao27@gmail.com`。完成后说「再推 SQL」。

**关联**  
- `apps/wholestore-app/supabase/APPLY.md`

### 2026-08-21（CLI 推 Wholestore SQL：账号无项目权限）


**User（提示词/原意）**  
- 直接 CLI 推送 SQL；如需配置和授权请具体说明。

**Assistant（实现前说明）**  
- 用本机已登录的 Supabase CLI 推 `000_kernel.sql` + `010_wholestore_provider_consumer.sql` 到 `foyecolycmxcneflpant`。  
- 若仍 403，列出当前登录身份与可见项目，给出授权步骤。

**Assistant（实现后说明 / 本轮结论）**  
- CLI 身份：`james.aim.link@gmail.com`，组织仅 **Adaven**（`wcprddhnpjlfhlwwwqvg`）。可见项目只有 Vouchap、aim.link。  
- `foyecolycmxcneflpant` API 403，SQL **未推送**。需要把该项目授权给此邮箱，或提供数据库密码后再推。

**关联**  
- `apps/wholestore-app/supabase/APPLY.md`

### 2026-08-21（Wholestore 新库 kernel：provider/consumer，先不加业务）


**User（提示词/原意）**  
- anon key 已加；准备推新库创建 Wholestore 数据库。  
- schema / 表 / 变量：有 firm 改为 provider，client 改为 consumer。  
- 先做好 space、user、provider/consumer 等基础结构，先不加业务。

**Assistant（实现前说明）**  
- 只对 `foyecolycmxcneflpant` 写 SQL，不动 Vouchap。  
- 内核：`public.users/spaces/user_spaces/space_invitations`；叠加 `provider` / `consumer` schema。  
- 不建订单、价格、发票、ERP 表。

**Assistant（实现后说明 / 本轮结论）**  
- SQL：`packages/db-platform/sql/000_kernel.sql` + `010_wholestore_provider_consumer.sql`。  
- `create_space_core(..., p_kind)`：`provider` 写 `provider.providers`，`consumer` 写 `consumer.consumers`。入驻关系表 `provider.consumers`（原 firm.clients）。  
- 当前 CLI 账号对 Wholestore 项目 403，无法代跑 SQL Editor；请在该项目 Dashboard 按 `apps/wholestore-app/supabase/APPLY.md` 执行，并 Exposed schemas 加上 `provider`、`consumer`。  
- 建 Space UI 可选 Factory (Provider) / Dealer (Consumer)。

**关联**  
- `apps/wholestore-app/supabase/APPLY.md`

### 2026-08-21（Vouchap 仍用原 Supabase；Wholestore 绑 foyecolycmxcneflpant）


**User（提示词/原意）**  
- Vouchap 应用仍然关联原 supabase 项目。  
- Wholestore 关联 supabase 项目 ID：`foyecolycmxcneflpant`。

**Assistant（实现前说明）**  
- 不改 Vouchap URL（`giuacjbfsyrristkigmz`）；把该 .env 拷进 monorepo 的 `apps/vouchap-app`。  
- 新建 `apps/wholestore-app`，env / config.toml 指向 `https://foyecolycmxcneflpant.supabase.co`。  
- 不 apply SQL；anon key 需用户从 Dashboard 填入（CLI 无读密钥权限）。

**Assistant（实现后说明 / 本轮结论）**  
- Vouchap：`https://giuacjbfsyrristkigmz.supabase.co`。  
- Wholestore 壳：登录 / 注册 / 建 Space / 成员，走 platform-core。  
- 请把 `apps/wholestore-app/.env` 的 `EXPO_PUBLIC_SUPABASE_ANON_KEY` 填上后 `npm run wholestore:web`。  
- SQL 仍未推到 Wholestore 库，注册/建 Space 会失败直到 apply kernel schema。

**关联**  
- `apps/wholestore-app`  
- `apps/vouchap-app/.env`（不入库）

### 2026-08-21（Vouchap 迁入 Adaven-platform；原仓改为备份）


**User（提示词/原意）**  
- vouchap 迁移进来。  
- 后续 Vouchap 项目是否作为备份不再更新？  
- vouchap 的更新迭代是否也通过 Platform 内来推送和构建？

**Assistant（实现前说明）**  
- 确认模型：Adaven-platform/`apps/vouchap-app` 为应用 SoT；jamesgao27/Vouchap 作历史备份；website/crm 仍独立。  
- 改 platform 包不等于自动上架 Vouchap，须在 `apps/vouchap-app` 显式 EAS / Cloudflare。EAS projectId 与 bundle id 不变。  
- rsync 工作区（排除 Pods/node_modules），npm workspaces 钉死 platform `0.1.0`。

**Assistant（实现后说明 / 本轮结论）**  
- 已迁入并 push：https://github.com/jamesgao27/Adaven-platform （`apps/vouchap-app`）。  
- 原 `/Users/macbook/Vouchap` README 已加「开发已搬家」说明（本地）；历史仓不要再改应用代码。  
- **验证**：在 Adaven-platform 根 `npm install --legacy-peer-deps` 后 `npm run vouchap:web`。  
- **残留**：Wholestore 未建；SQL 未 apply；原 Vouchap GitHub 尚未 push 冻结 README。

**关联**  
- https://github.com/jamesgao27/Adaven-platform  
- `apps/vouchap-app`

### 2026-08-21（Adaven-platform 推 GitHub；去掉误建的家目录 git）


**User（提示词/原意）**  
- 继续迁移，把新的项目推送到 github。  
- Changes 界面上有个 macbook 的代码项目，应该是没有对应的 git 项目。

**Assistant（实现前说明）**  
- `macbook` 多半是 `/Users/macbook/.git` 误 init 的家目录空仓库，会让 Cursor Changes 把整个用户目录当成一个项目。确认无 commit / 无 remote 后只删 `.git` 元数据。  
- Adaven-platform 补齐未跟踪源码、做首 commit，用 `gh repo create` 推到 jamesgao27。不 apply SQL。

**Assistant（实现后说明 / 本轮结论）**  
- 已删除 `/Users/macbook/.git`（2026-03-09 误建，从未 commit）。Changes 里的 macbook 项应消失；若仍在，刷新/重开窗口。  
- GitHub **private**：https://github.com/jamesgao27/Adaven-platform  
- SQL 仅作为仓库源码存在，未推到任何 Supabase。  
- **残留**：Vouchap 原生工程仍在原仓；Wholestore 壳未建。

**关联**  
- https://github.com/jamesgao27/Adaven-platform  
- `/Users/macbook/Adaven-platform`

### 2026-08-21（阶段 B：平台代码迁入 Adaven-platform，先不推 SQL）


**User（提示词/原意）**  
- 继续迁移代码，先不推 sql。

**Assistant（实现前说明）**  
- 把 session / 邀请 / 成员 / OAuth / Space 切换 UI 从 Vouchap 迁入 `@adaven/platform-core` 与 `@adaven/platform-ui`；Vouchap 旧路径改 re-export。  
- `createSpace` 仍留在 Vouchap，继续调用产品 RPC `create_space_with_user`。  
- 不 apply、不 push `db-platform` SQL / `create_space_core` migration。  
- 不搬家 `ios/` `android/`。

**Assistant（实现后说明 / 本轮结论）**  
- `Adaven-platform/packages/platform-core` 现含注入 client 的 auth、invitations、members、oauth、hooks。  
- Vouchap：`file:` 依赖 + Metro alias/`watchFolders`；`supabase.ts` 调用 `bindPlatformClient`；`auth.ts` 仅保留 Firm 富集与 `createSpace`。  
- SQL 文件仍在仓库中但未部署。  
- **验证**：`vouchap-app` 下 `npm install` 后启动 Web/dev-client，走登录、setup-space、邀请、切换 Space。  
- **残留**：原生工程仍在 Vouchap；Wholestore 壳未建；slim RPC 未上线。

**关联**  
- `/Users/macbook/Adaven-platform/packages/platform-core`  
- `/Users/macbook/Adaven-platform/packages/platform-ui`  
- `vouchap-app/src/shared-logic/auth.ts`

### 2026-08-21（开始实施跨应用平台内核，仓库名 Adaven-platform）


**User（提示词/原意）**  
- 开始实施（Space / 成员 / 邀请 / 第三方登录平台内核）。  
- 代码库名改为 **Adaven-platform**（不是 `/Users/macbook/apps`）。  
- 此前已确认：只共用代码、各应用独立 Supabase；第三方登录均为平台公共能力，Google 只是示例。

**Assistant（实现前说明）**  
- 按计划先做阶段 A（Vouchap 就地解耦），同时初始化 `/Users/macbook/Adaven-platform` 骨架。  
- 拟拆：`createSpaceCore` + `registerOnSpaceCreated`；邀请页去掉对 `firm-clients` 的直接 import；管理页抽出 Switch Space；登录页接入按配置显示的第三方按钮。  
- 不搬家 `vouchap-app` 原生工程；不改生产 `create_space_with_user` 的 Firm/CRM 种子（另加 slim `create_space_core`）。

**Assistant（实现后说明 / 本轮结论）**  
- Vouchap：`auth.ts` 的 JS 种子改走 `vouchap-space-bootstrap` hook；`handle-invitations` 经 `shouldRedirectToFirmClaim`；`SpaceSwitcherModal` + `ThirdPartyAuthButtons`；SQL `20260821120000_create_space_core.sql`。  
- 新建 `/Users/macbook/Adaven-platform`（packages + docs/ARCHITECTURE-PLATFORM.md）。  
- **验证**：注册 → setup-space → 邀请 → 切换 Space；收据仍按 `space_id` 隔离。第三方按钮在未配置 Client ID 时不显示。需在 Supabase 执行新 migration 后 Wholestore 才能用 slim RPC。  
- **残留**：Vouchap 创建 Space 仍走产品 RPC `create_space_with_user`；`getCurrentSpace` 仍查 `firm.firms`；阶段 B 才把 `vouchap-app` 迁入 Adaven-platform。

**关联**  
- `/Users/macbook/Adaven-platform`  
- `vouchap-app/src/shared-logic/platform/`  
- `vouchap-app/supabase/migrations/20260821120000_create_space_core.sql`

### 2026-08-21（提交身份还原统一为 james.zjgao@gmail.com）


**User（提示词/原意）**  
- 提交身份还原统一成 Cursor 账号：`james.zjgao@gmail.com`。

**Assistant（实现前说明）**  
- 无业务代码。撤销上一轮分仓库钉邮箱：全局改回 `james.zjgao@gmail.com`；去掉 7 个 `jamesgao27` 仓库与 23 个 `James-aim-link` 仓库的 local `user.email`，全部继承全局。

**Assistant（实现后说明 / 本轮结论）**  
- 全局与抽查仓库 effective 均为 `James <james.zjgao@gmail.com>`，无 local 覆盖。仅影响之后的新提交。GitHub remote / `gh` 登录仍为 `jamesgao27`，未改。

**关联**  
- `~/.gitconfig`；各仓库 `.git/config`（已 unset `user.email`）

### 2026-08-21（jamesgao27 仓库提交邮箱改为 jamesgao27@gmail.com）

**User（提示词/原意）**  
- 关联到 `jamesgao27` 的，提交身份的邮箱改为 `jamesgao27@gmail.com`。

**Assistant（实现前说明）**  
- 无业务代码。拟：全局 `user.email` + 七个 `jamesgao27` 仓库的 local `user.email` 改为新邮箱；`aim.link/` 下 `James-aim-link` 仓库钉 local 为原有效邮箱 `james.zjgao@gmail.com`，避免被全局带走。不改写历史提交。

**Assistant（实现后说明 / 本轮结论）**  
- 全局与 7 个仓库（Vouchap、vouchap-website、vouchap-crm、aim.link-v2、aim-link-website、Project-map、antbim-website）effective 均为 `James <jamesgao27@gmail.com>`。  
- `James-aim-link` 23 个仓库已钉 `james.zjgao@gmail.com`。仅影响之后的新提交。  
- **残留**：请在 GitHub 账号 Settings → Emails 添加并验证 `jamesgao27@gmail.com`，提交才会显示为已关联。

**关联**  
- `~/.gitconfig`；各仓库 `.git/config` `user.email`

### 2026-08-21（GitHub 用户名 jameszjgao → jamesgao27：本地 remote / gh 关联）

**User（提示词/原意）**  
- GitHub 代码库账户用户名由 `jameszjgao` 改为 `jamesgao27`；本地要做调整以正确关联。  
- 另一个账户 `james-aim-link` 不变。

**Assistant（实现前说明）**  
- 无业务代码变更。只改 `jameszjgao` 名下仓库的 `origin` URL、GitHub CLI 登录名与钥匙串 HTTPS 凭证用户名；`aim.link/` 下 `James-aim-link` remote 一律不改。  
- GitHub 已将原 `jameszjgao/vouchap-web` 重定向为 `jamesgao27/ProjectMap`，Project-map 本地 origin 拟改为该现名。  
- 全局 `user.name` / `user.email`（`James` / `james.zjgao@gmail.com`）是提交身份，不是 GitHub 登录名，保持不动。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新 origin：`Vouchap`、`Vouchap-website`、`Vouchap-crm`、`aim.link-v2`、`aim-link-website`、`antbim-website` → `https://github.com/jamesgao27/<同名>.git`；`Project-map` → `https://github.com/jamesgao27/ProjectMap.git`。  
- `gh` 现为 `jamesgao27`（keyring）；`hosts.yml` 与钥匙串 `github.com` / `gh:github.com` 账户名已同步；`gh auth setup-git` 将 `github.com` HTTPS 凭证助手设为 `gh`。  
- `git ls-remote` 已通：Vouchap、aim.link-v2、Project-map、vouchap-website。工作区内无残留 `jameszjgao` remote；`aim.link/` 下 `James-aim-link` remote 仍为 46 条。  
- **残留**：提交邮箱仍是 `james.zjgao@gmail.com`；若要改 Git 提交身份需另说。`aim.link/` 若干 remote URL 内嵌 PAT（既有做法，本轮未动）。

**关联**  
- 各仓库 `.git/config` `remote.origin.url`；`~/.config/gh/hosts.yml`；`~/.gitconfig` credential helper

### 2026-08-17（Wholestore 提案：成本单价改为 CAD 3000/人周）

**User（提示词/原意）**  
- 成本单价按照 3000 加元/人周，约合 2200 美元/人周。

**Assistant（实现前说明）**  
- 无代码。只改 `docs/PROPOSAL-Wholestore.md` 第 9、12 节金额；人周数不变。

**Assistant（实现后说明 / 本轮结论）**  
- 单价改为 CAD 3,000 / 人周（约 USD 2,200）。MVP 13 人周 ≈ CAD 39k / USD 29k；适配 5.5–6.5 人周 ≈ CAD 16.5k–19.5k / USD 12k–14k。

**关联**  
- `docs/PROPOSAL-Wholestore.md`

### 2026-08-17（Wholestore 提案：压缩编码人周，PM 提示词与 AI 出码同步）

**User（提示词/原意）**  
- 工作量预估压缩开发人员编码人周。  
- 采用 AI 编程；产品经理定义产品的同时输出提示词，编码同步完成。

**Assistant（实现前说明）**  
- 无代码。改提案第 8–9、12 节：报价改为「产品+提示词 / 联调 / 验收」，模块表只计 PM 人日、开发编码加计为 0；日历 S2 随定义窗口缩短。

**Assistant（实现后说明 / 本轮结论）**  
- MVP 立项 **13 人周**（约 USD 47k）；完整版累计约 23 人周；适配 **5.5–6.5 人周**（约 USD 20k–23k）；S2 日历 6–9 周。联调与等授权不打折。  
- **残留**：费率仍为示意；AI 出码质量依赖提示词与走查，未改业务代码。

**关联**  
- `docs/PROPOSAL-Wholestore.md`

### 2026-08-17（Wholestore 提案：功能细化到页面级，技术细节节略）

**User（提示词/原意）**  
- 功能模块等描述需细化到页面级：大模块 + 模块具体交互页面。  
- 实现的技术细节要节略。

**Assistant（实现前说明）**  
- 无代码。改 `docs/PROPOSAL-Wholestore.md` 第 5 节为 M1–M10 下的页面表（谁、端、页上做什么）；压缩技术栈、表名、Worker/RLS 等实现段；第 6 / 9 节改为按页面验收与按页面估人周。

**Assistant（实现后说明 / 本轮结论）**  
- 已重写：导览 + 各模块页面清单（含 Ship / Tracking / Sync Issues 等）；MVP vs 完整版改为「必须有的页面」；技术仅保留选型表。报价人周未改（48 / 7–8）。  
- **残留**：无线框；页面英文名可在评审时微调。

**关联**  
- `docs/PROPOSAL-Wholestore.md`

### 2026-08-16（Wholestore 提案：按工作量报价 + 功能架构/客户配合为重点）

**User（提示词/原意）**  
- 报价按正常工作量计算。  
- 程序代码开发全采用 Cursor（开发人员成本集约）。  
- 数据库和后端用 Supabase，前端用 Cloudflare。  
- proposal 重点：功能架构（模块及各自如何实现）+ 客户需配合的工作（确定 ERP、QuickBooks、物流的适配版本和 API 授权等）。

**Assistant（实现前说明）**  
- 无代码。重写 `docs/PROPOSAL-Wholestore.md`：技术栈前置；第 5 节按 M1–M10 写清功能与实现层；第 7 节单列客户交付（Finale/QBO/承运商版本与授权）；报价用人周×费率，Cursor 只压缩可编码部分，不再用 1 万美元替代工作量。

**Assistant（实现后说明 / 本轮结论）**  
- 已重写提案。标准 MVP 约 48 人周（示意约 USD 173k，公司立项）；单客户适配 7–8 人周（示意约 USD 25k–29k @ $90/人时）+ 订阅；客户义务以 ERP/QBO/物流确认书为开工门禁。  
- **残留**：费率可改、人周保持；若 ERP 非 Finale 需重估；未改业务代码。

**关联**  
- `docs/PROPOSAL-Wholestore.md`

### 2026-08-15（Wholestore 提案：扫码物流 + 客户只付适配/$10k 上限）

**User（提示词/原意）**  
- 增加 order 的 shipping 关联：发货扫码在 Wholestore 订单上绑定物流单号，双方可查阅物流进展。  
- 按公司标准产品研发；对客户收费只计适配定制。  
- 客户首期预算上限不超过 1 万美元；后续订阅每月数百美元。

**Assistant（实现前说明）**  
- 无代码。改提案：物流为标准 MVP（扫码绑 tracking、轨迹展示、移动发货）；成本改为对内人周 vs 对外 $10k 适配包 + 月费档。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新 [`docs/PROPOSAL-Wholestore.md`](docs/PROPOSAL-Wholestore.md)。客户首期 3–4 周适配、≤ USD 10,000；订阅示意 $299–699/月；80+ 人周研发不向客户开票。  
- **残留**：轨迹 API 供应商与超量计价、面单条码规则需在 S1 验证。

**关联**  
- `docs/PROPOSAL-Wholestore.md`

### 2026-08-15（运行测试服务器）

**User（提示词/原意）**  
- 运行测试服务器。

**Assistant（实现前说明）**  
- 无代码变更。在 `vouchap-app` 启动 `npm run web`（Expo web），用于验证 income Payer merge / 分组修复。

**Assistant（实现后说明 / 本轮结论）**  
- 已后台启动 `npm run web`；Metro 监听 `http://localhost:8081`。浏览器打开该地址即可测 Income 选 Payer 三选项与按 Payer 分组。

**关联**  
- `vouchap-app` → `npm run web`

### 2026-08-15（Income 改 Payer 不弹 merge 三选项；按 Payer 分组未合并已 merge 的 entity）

**User（提示词/原意）**  
- income 记录中，通过选择已有 entity 修改 payer，没有触发 entity merge 三选项对话框（app 与 web 都没有）。  
- income 的 web 端列表按 payer 分组时，已经 merge 的 payer 没有合并同组。  
- 检查 receipt 等其他模块是否同样问题并修复。

**Assistant（实现前说明）**  
- 收入单已统一为 `entities.entityId`，但详情选单仍用已废弃的 `customerId`/`customerSupplierId` 判断是否弹出 Replace / Replace all (Merge) / Do not replace，导致 `currentId` 恒为空、弹窗不触发；Confirm 时的 merge 路径同样读不到关联方。  
- 列表分组键用原始 `entityId`（未跟随 `merged_into_id`），而 receipt 已用解析后的 `entity.id`。  
- inbound/outbound 详情同样只写 `supplierId`/`customerId`，保存实际读 `entityId`，同类缺陷一并修。  
- 拟改：`getCanonicalEntityId`；invoice/inbound/outbound 详情选单与 merge；invoices/receipts/inbound/outbound 分组；`getInvoiceById` 等按 merge 解析展示。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `getCanonicalEntityId`；income 选已有 Payer 会弹三选项，merge 用规范化 entity id；列表按 Payer 分组用规范化 id。  
- receipt 选单比较改为 canonical id（原先靠 `hasExistingLink` 多数能弹，但重选同一 Payee 可能误弹）。  
- inbound Sender / outbound Receiver 选单、merge、分组同步改为 `entityId`。  
- **验证**：编辑已有 Payer 的 income，从选单换另一个已有 entity → 应出现三选项；Replace only this 只改本单，Replace all (Merge) 合并 entity；web 按 Payer 分组，已 merge 的应同一组。receipt / inbound / outbound 同样走一遍。  
- **残留**：inbound/outbound 详情若明细加载失败会提前返回，可能仍不带解析后的 entity（少见）。

**关联**  
- `vouchap-app/src/shared-logic/entities.ts`  
- `vouchap-app/src/mobile-ui/app/invoice-details/[id].tsx`  
- `vouchap-app/src/mobile-ui/app/invoices.tsx`

### 2026-08-15（Wholestore 提案按 B2B 计划书重写：功能架构 + 工期成本）

**User（提示词/原意）**  
- 结合「面向厂家与经销商的 B2B 下单、履约与结算平台」计划书重写 proposal。  
- 核心：门户 + Finale + QBO；MVP 12–16 周、完整版 20–28 周。  
- 重点：功能架构规划、开发时间与成本分析。  
- 附 PDF 与正文功能清单、三系统分工、启动前五项确认。

**Assistant（实现前说明）**  
- 无业务代码。覆盖八能力域、三系统事实来源与防重复入账、MVP/完整版切分、S1→S2→S3 工期、人周与三档成本情景。

**Assistant（实现后说明 / 本轮结论）**  
- 已重写 [`docs/PROPOSAL-Wholestore.md`](docs/PROPOSAL-Wholestore.md)。报价假设：单厂家、QBO、价盘在门户、MVP 不做退货/多级审批。  
- **验证**：对照计划书五项启动确认是否接受提案第 8 节假设。  
- **残留**：Payment 写入者、开票时点、是否做移动端加项，仍待拍板。

**关联**  
- `docs/PROPOSAL-Wholestore.md`

### 2026-08-15（Wholestore 架构提案，不动代码）

**User（提示词/原意）**  
- 新应用取名为 wholestore；先不动代码，写一份 proposal。  
- proposal 中不用体现已有资源可以复用。  
- 前序约束：新应用也要 firm/client（工厂/经销商）、各 space 多 user；两应用注册的 space 与 user 独立。

**Assistant（实现前说明）**  
- 无代码变更。写独立产品/架构提案：Wholestore 定位、域模型、平台与产品分层、双 Supabase、同步迭代与分期；不写现有工程可复用清单。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 [`docs/PROPOSAL-Wholestore.md`](docs/PROPOSAL-Wholestore.md)。  
- **验证**：阅读提案第 10 节开放问题后拍板，再进入实施。  
- **残留**：engagement 是否进平台、Factory 审核、认领路径等仍待决策。

**关联**  
- `docs/PROPOSAL-Wholestore.md`

### 2026-08-04（Dashboard Custom：From/To/Apply 同排右侧）

**User（提示词/原意）**  
- Custom 后不要出现新行，在按钮右端显示 from-to-apply。

**Assistant（实现前说明）**  
- 调整 `DashboardPeriodSelector`：Custom 选中后 From/To/Apply 紧接在 pill 行右侧同排，不再单独换行；去掉 WebDashboardView 为 Custom 预留的额外标题行高度。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `DashboardPeriodSelector.tsx`（单行 `flexDirection: 'row'` + `nowrap`）；`WebDashboardView` 移除 `DASHBOARD_HEADER_CUSTOM_EXTRA`。刷新 Web 即可验证。

**关联**  
- `DashboardPeriodSelector.tsx`、`WebDashboardView.tsx`

### 2026-08-04（运行 Web 测试服务器）

**User（提示词/原意）**  
- 运行测试服务器。

**Assistant（实现前说明）**  
- 无代码变更；在 `vouchap-app` 启动 `npm run web`（Expo web），用于验证 Dashboard 时间区间。

**Assistant（实现后说明 / 本轮结论）**  
- 已后台启动 `npm run web`；Metro 监听 `http://localhost:8081`。浏览器打开该地址即可测 Dashboard。

**关联**  
- `vouchap-app` → `npm run web`

### 2026-08-04（Web Dashboard：标题行快捷时间区间）

**User（提示词/原意）**  
- vouchap 的 web 端 dashboard 需增加快捷时间区间选择，放在 dashboard 标题行，可快速选择当月、三个月、今年、过去 12 个月、自定义时间段等。

**Assistant（实现前说明）**  
- 目标：`WebDashboardView`（Client Dashboard）；现状为全量拉取后聚合，无日期筛选；提交曲线硬截近 30 日。  
- 计划：新增可复用 `DashboardPeriodSelector`（英文文案：This month / 3 months / This year / Past 12 months / Custom）；按单据 `date`（提交曲线用 `createdAt || date`）过滤后再聚合；默认 Past 12 months；Custom 用 web `input[type=date]` + Apply。  
- Firm Insights（`CrmDashboardView`）本轮不改（状态快照类图表与时间区间语义不同）。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 [`vouchap-app/src/mobile-ui/components/DashboardPeriodSelector.tsx`](vouchap-app/src/mobile-ui/components/DashboardPeriodSelector.tsx)；改 [`WebDashboardView.tsx`](vouchap-app/src/mobile-ui/components/WebDashboardView.tsx)：标题行右侧挂载区间选择，窄屏/homeCompact 在图表上方展示；四图均按区间过滤；提交序列上限 90 日。  
- **验证**：Web 打开 Client Dashboard，切换 This month / 3 months / This year / Past 12 months，图表应变；Custom 选 From/To 点 Apply 后图表更新。  
- **残留**：`components/` 与 `src/mobile-ui/components/` 为硬链接；根目录副本的相对路径 `../lib/web-viewport` 在 `tsc` 下仍会报既有路径问题（运行时 `@/components` 指向 mobile-ui）。

**关联**  
- `DashboardPeriodSelector.tsx`、`WebDashboardView.tsx`

### 2026-05-12（Vouchap：订阅/账单/权益 — CRM 订单驱动 + 试用 + Firm 年消耗）

**User（提示词/原意）**  
- 按已附计划实现：权益以 CRM `space_orders` 在服订阅 + credit 订单为准；新建 space 与存量补 30 天试用（存量自 2026-05-01）；Client 识别月包来自在服订单 SKU；Firm engagement 改为订阅窗口内消耗计数；`get_space_entitlements`；App 拦截与 Subscription 屏摘要。

**Assistant（实现前说明）**  
- 新增迁移统一：SKU `billing_kind` / `space_target`、试用与 credit 目录 SKU、重写 `get_client_recognition_quota` / `record_client_recognition_success`、`assert_firm_can_create_engagement`、`on_space_created` + `spaces` 触发器、存量 backfill、`get_space_entitlements`；识别入账触发器仅认 `recognition_credit_pack`（及空 billing_kind 兼容）。  
- App：`@/lib/space-entitlements`、`space-orders` 展示 plan、`firm.ts` 区分无订阅与额度用尽英文文案、`client-recognition-quota` 扩展字段与无订阅提示。  
- 文档：`vouchap-crm/sql/crm-order-design.md`、`vouchap-crm/docs/免费试用订单.md`。

**Assistant（实现后说明 / 本轮结论）**  
- 已添加 [`vouchap-app/supabase/migrations/20260512100000_subscription_entitlements_orders.sql`](vouchap-app/supabase/migrations/20260512100000_subscription_entitlements_orders.sql)；共享 [`vouchap-app/src/shared-logic/space-entitlements.ts`](vouchap-app/src/shared-logic/space-entitlements.ts)；改 [`space-orders.tsx`](vouchap-app/src/mobile-ui/app/space-orders.tsx)、[`firm.ts`](vouchap-app/src/shared-logic/firm.ts)、[`client-recognition-quota.ts`](vouchap-app/src/shared-logic/client-recognition-quota.ts)。  
- **验证**：本地执行 `supabase db push`（或等价应用迁移）；新注册 space 应自动有试用 `space_orders`；Client 无在服且无 credit 时识别预检拒绝；Firm 无订阅创建 engagement 拒绝；Firm 窗口内订单数达上限拒绝。  
- **残留**：本机 `npx` 因 cache 权限未跑通 CLI；全仓 `tsc` 仍有既有 unrelated 报错；若 `sku_edition` 无 `ON CONFLICT (code)` 需在目标库确认约束。

**关联**  
- 迁移、`space-entitlements.ts`、`crm-order-design.md`

### 2026-05-12（vouchap-website：顶栏应用商店按钮缩小高度与间距）

**User（提示词/原意）**  
- 两个按钮高度减小一点，顶栏不要这么拥挤。

**Assistant（实现前说明）**  
- `StoreDownloadBadges` 的 `tone="navbar"` 原为 `h-8 sm:h-9`、纵向 `gap-1.5`，与 `h-20` 顶栏叠放后偏高。  
- 计划：navbar 芯片改为 `h-7`、`px-2`、`text-[11px]`、`rounded-md`、`gap-1.5`；图标 `h-3 w-3`；纵向容器 `gap-1`；showcase 的 `onDark` 保持 `h-9` 等原样。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-website/components/StoreDownloadBadges.tsx`（按 tone 拆分完整 chip 类名）。`npx tsc --noEmit` 通过。

**关联**  
- `vouchap-website/components/StoreDownloadBadges.tsx`

### 2026-05-12（vouchap-website：顶栏 Login 右侧纵向应用商店入口）

**User（提示词/原意）**  
- Vouchap-website 网站顶栏右端，在 Login 按钮右侧，上下排列增加两个应用市场跳转按钮；样式与链接与 showcase 页已有实现一致。

**Assistant（实现前说明）**  
- 顶栏为 `vouchap-website/components/Navbar.tsx`；showcase 中 `ShowcaseSlides.tsx` 的 `ShowcaseStoreBadges` 含 `NEXT_PUBLIC_APP_STORE_URL` / `NEXT_PUBLIC_PLAY_STORE_URL` 与 SVG 芯片样式。  
- 计划：抽出 `lib/storeLinks.ts` 与共享 `components/StoreDownloadBadges.tsx`（`layout: row|column`、`tone: onDark|navbar`）；showcase 改用该组件保持视觉与链接单一来源；Navbar 在 Login 外包一层 `flex items-center`，右侧 `StoreDownloadBadges` 纵向 + `navbar` 色调以适配浅色/深色顶栏。

**Assistant（实现后说明 / 本轮结论）**  
- 已新增 `vouchap-website/lib/storeLinks.ts`、`vouchap-website/components/StoreDownloadBadges.tsx`；已改 `Navbar.tsx`、`ShowcaseSlides.tsx`（删除内联 `ShowcaseStoreBadges`）。  
- **验证**：`cd vouchap-website && npx tsc --noEmit` 通过；本地 `npm run dev` 查看首页顶栏 Login 右侧为 App Store / Google Play 纵向排列，点击新开页；showcase 底部双按钮应与改前一致（`tone="onDark"` + 原 `mt-3 sm:mt-4`）。  
- **残留**：极窄屏顶栏右侧可能略挤，若需可再加 `hidden sm:flex` 或缩小字号。

**关联**  
- `vouchap-website/components/Navbar.tsx`、`vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/components/StoreDownloadBadges.tsx`、`vouchap-website/lib/storeLinks.ts`

### 2026-05-09（Vouchap 移动端：团队管理菜单顺序与「Subscription and billing」文案）

**User（提示词/原意）**  
- 团队管理菜单入口顺序：成员、权限、账户、entities、expense、income、order。  
- 「Order management」文案改为「Subscription and billing」。

**Assistant（实现前说明）**  
- `management.tsx` 中 `menuItems` 原顺序为 members → permissions → claim → expense → income → accounts → entities，且 space-orders 为独立块排在列表最前。  
- 将 `menuItems` 调整为 members → permissions → claim → accounts → entities → expense → income（`visibleMenuItems` 过滤逻辑不变）；space-orders 入口移至 `visibleMenuItems.map` 之后。  
- 同步 Stack 标题 `space-orders`、`space-manage` 链接卡与 management 副文案（英文）。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-app/src/mobile-ui/app/management.tsx` 与 `vouchap-app/app/management.tsx`（两处保持同步）、`src/mobile-ui/app/_layout.tsx`（`space-orders` 导航标题）、`src/mobile-ui/app/space-manage.tsx`。副标题为「Plans, invoices, and payment history」。  
- **验证**：Management 屏非 firm：Members → Accounts → Entities → Expense Settings → Income Settings → Subscription and billing；firm：Members → Permissions。

**关联**  
- `vouchap-app/src/mobile-ui/app/management.tsx`、`vouchap-app/app/management.tsx`、`vouchap-app/src/mobile-ui/app/_layout.tsx`、`vouchap-app/src/mobile-ui/app/space-manage.tsx`

---

### 2026-05-06（Vouchap 移动端：receipt 详情保存 — 重复名弹窗后一次确认即保存）

**User（提示词/原意）**  
- 「修改 receipt 详情时若同时改 entity、account、item，需多次点确认才保存；可能 entity/account 各自触发三选项弹窗。应优化为确认一次即可。」

**Assistant（实现前说明）**  
- `handleDuplicateNameReplace` / `Merge` 使用 `setPendingDuplicateChoice` 等异步 state，`handleSave` 仅在下次渲染后才读到 pending，用户必须在弹窗选择后再点一次底部 Confirm；若仍存在第二次重复名校验失败，还会再弹窗，体感「多次确认」。  
- 计划：用同步 `duplicateResolutionRef` 携带 replace/merge 与 payload；`handleSave` 优先消费 ref 并调用抽离的 `runDuplicateResolutionSave`；`triggeredBy === 'save'` 时在关闭弹窗后 `void handleSave()` 立即继续保存；在 `runDuplicateResolutionSave` 与主保存的 catch 中统一 `openDuplicateModalFromSaveError`（含 `ACCOUNT_NAME_EXISTS`）以便链式冲突时再次弹窗而非仅 toast。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`；移除 `pendingDuplicateChoice` / `pendingDuplicatePayload` state。  
- **验证**：编辑后点 Confirm → 若出现重复名，选 Replace/Merge 后应直接完成保存（无需再点 Confirm）；dropdown 来源仍写入 ref，下一次点 Confirm 时消费。收入详情 `invoice-details` 对 save 路径本已内联保存，本次未改。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`

---

### 2026-05-06（Vouchap 移动端：支出/收入详情 pending 确认 FAB 样式恢复）

**User（提示词/原意）**  
- 「昨天增加 expenses 详情页的重新识别和删除按钮，把之前样式很好的确认按钮改不好了，确认按钮的样式需恢复之前的。」

**Assistant（实现前说明）**  
- 对比 `7f7280b` 前：pending 确认为 `[styles.fab, styles.confirmFab]` 内直接 `<Ionicons name="checkmark-circle" size={32} color="#fff" />`；`2de4b3f` 后为与重试 FAB 统一套了 `fabRingInner` + `checkmark-circle-outline` 紫色，视觉上不像「确认」而像次要操作。  
- 计划：仅恢复 pending 确认 FAB 的 JSX（去掉内环、改回实心白勾）；收入详情 `invoice-details` 同步；`fabRingInner` 注释改为仅描述重试/删除。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`、`invoice-details/[id].tsx`。**验证**：pending 详情右下角上层确认钮应为整颗品牌紫底 + 白色实心 `checkmark-circle`（32）；`needs_retake` 仍为红底白环刷新/删除，与确认区分。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`、`invoice-details/[id].tsx`

---

### 2026-05-06（Vouchap 移动端：登录后角标与 continueAuthCheck 对齐）

**User（提示词/原意）**  
- 对话续作：核对 `continueAuthCheck` 在各成功进入首页分支是否在 `setIsLoggedIn(true)` 前调用 `scheduleHomeSidebarBadges`，避免首屏仅靠 `runHomeSessionRefresh` 才拉邀请/claim 角标；此前已针对重复 `getUserSpaces` 将 `runHomeSessionRefresh` 依赖收窄并抽出角标调度。

**Assistant（实现前说明）**  
- `scheduleHomeSidebarBadges` 原定义在 `continueAuthCheck` 之后，且仅由 `runHomeSessionRefresh` 调用；从登录页直达首页时若 focus 刷新未再跑完整段逻辑，角标可能延迟。  
- 计划：将 `scheduleHomeSidebarBadges` 上移到 `continueAuthCheck` 之前（hooks 顺序不变、闭包清晰）；在「有效当前空间」「单空间自动设当前」「多空间选最新」三处 `setIsLoggedIn(true)` 前调用 `scheduleHomeSidebarBadges`（多空间分支用 `badgeEmail` 覆盖 `updatedUser` 作用域）。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-app/src/mobile-ui/app/index.tsx`：上移 `useCallback(scheduleHomeSidebarBadges)`，删除重复块；三处进入应用前调度角标。  
- **验证**：登录后进首页，侧栏邀请/claim 数字应在首屏稍后（`InteractionManager.runAfterInteractions`）出现；日志上仍可能有一次 `getUserSpaces`（bootstrap 必要），不应因角标缺失而依赖第二次完整 session 刷新。

**关联**  
- `vouchap-app/src/mobile-ui/app/index.tsx`

---

### 2026-05-06（Vouchap 移动端：登录后进首页仍很慢 ~10s）

**User（提示词/原意）**  
- 「dev 环境现在只有一次加载没有闪屏了，但时间仍然非常长，我需数到 10 才出现首页。」

**Assistant（实现前说明）**  
- 登录页已 `initializeAuthCache`，但 `index` 的 `continueAuthCheck` 仍 `getCurrentUser(true)` + `getCurrentSpace(true)` + 再次 `getCurrentUser(true)`，与 `getCurrentSpace` 内部再拉用户叠加，RPC/查询链过长。  
- `checkAuth` 在缓存未初始化时曾 **后台** `initializeAuthCache` 与 `continueAuthCheck` **并行**，易重复打满一套请求。  
- `runHomeSessionRefresh` 在首屏后又强制全量刷新并与邀请/claim 串行。  
- 计划：冷启动改为 **await** 一次缓存初始化后再 `continueAuthCheck`；校验阶段优先 `getCurrentUser(false)` / `getCurrentSpace(false)` / `getCachedSpace()`；`setCurrentSpace` 后只强刷 user 一次；`runHomeSessionRefresh` 软缓存优先，角标请求 `InteractionManager.runAfterInteractions`；登录页 `getCurrentSpace(false)`；`getUserSpaces` 冗长日志仅 `__DEV__`。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `index.tsx`、`login.tsx`、`shared-logic/auth.ts`；**验证**：dev 登录后进首页应明显缩短（仍取决于 Supabase 与 `getUserSpaces` 单次延迟）。**残留**：若远端极慢，瓶颈在必要的一两次网络而非前端串行重复。

**关联**  
- `vouchap-app/src/mobile-ui/app/index.tsx`、`login.tsx`、`shared-logic/auth.ts`

---

### 2026-05-06（Vouchap 移动端：登录后首页二次加载 / 白屏久）

**User（提示词/原意）**  
- 「移动端 app 登录后出现两次加载（出现 index 页后又白屏重新加载），且时间很长。」

**Assistant（实现前说明）**  
- `index.tsx` 在 `continueAuthCheck` 里 `setIsLoggedIn(true)` 时**未**写入 `currentSpaceState`，而渲染要求 `currentSpace` 非空，否则 `return null` 全白；`currentSpace` 仅依赖异步 `runHomeSessionRefresh`，形成「已登录 → 长时间白屏 → 再出内容」，并易感知为二次加载。  
- `useEffect` + `useFocusEffect` 均调用 `runHomeSessionRefresh`，挂载后可能触发两轮完整拉取。  
- 计划：`setIsLoggedIn(true)` 前同步 `getCurrentSpace` + `setCurrentSpaceState`（并 `initializeAuthCache`）；去掉重复的 `useEffect`；认证/等空间时用 `ActivityIndicator` 占位；删除未使用的 `continueAfterAuth`。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/app/index.tsx`：按上修改；新增 `bootLoadingRoot` 样式。  
- **验证**：真机/模拟器登录后应明显减少白屏时长与「加载两次」感；若仍有个别网络慢，应只见 spinner 而非全白。

**关联**  
- `vouchap-app/src/mobile-ui/app/index.tsx`

---

### 2026-05-06（Vouchap Web：DataTable 切换模块列宽为 0 — ref 测量 + 换表重置列状态）

**User（提示词/原意）**  
- 「现在刷新页面后列宽计算没问题，切换模块时列宽全部成 0 了。」

**Assistant（实现前说明）**  
- 怀疑 `getElementById('data-table-wrapper')` 在 Stack 仍挂载上一屏时命中**隐藏**表格容器，`clientWidth` 为 0，分配异常。  
- 另：若 `DataTable` 实例在路由间复用，`orderIds`/`visibleIds` 不随新 `columns` 更新会导致 `orderedVisibleColumns` 为空并完成一次错误 capture。  
- 计划：根 `View` 使用 **`ref`** 读取本实例宽度；`storageKey` 或 **列 id 集合**变化时重置 order/visible 与列宽状态；可见列暂为空且 `columns` 非空时 **rAF 重试** capture。

**Assistant（实现后说明 / 本轮结论）**  
- `DataTable.tsx`：新增 `readWebDataTableWrapperWidthPx`、`dataTableWrapperRef`、`columnIdsFingerprint`；换表 identity 的 `useLayoutEffect` 同步 `orderIds`/`visibleIds`；capture 用 ref 宽度并增加空列重试；`layoutCaptureKey` 纳入 `columnIdsFingerprint`。  
- **验证**：Web 在模块间切换列宽应正常；刷新行为保持。  
- **残留**：仍依赖 RN Web 上 `View` ref 指向可测 DOM；若极端环境下 ref 无宽高，仍会重试至多约 40 帧。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`

---

### 2026-05-06（Vouchap Web：DataTable 初始列宽按容器 100% 比例分配、缓存至刷新、单元格水平可溢出）

**User（提示词/原意）**  
- 「初始计算分配的列宽，需按表格窗口宽度 100% 填满（考虑该页面的右侧栏是否默认打开），允许表格内单元格数据宽度溢出。在此基础上缓存列宽，直至下次加载或刷新时重算，中途后端数据变动 realtime 不改变列宽。」

**Assistant（实现前说明）**  
- 侧栏开闭由布局反映到 `#data-table-wrapper` 的 `clientWidth`，无需单独传参；首次进入表（`layoutCaptureKey` / `storageKey`）用 **齿轮列 40px + 未手动列按 `minWidth` 权重比例分配** 填满当前容器宽；已手动列先从可分配宽度中扣除。  
- 列宽缓存：`intrinsicWidths` + `columnWidths` 仅在上述 key 变化时重算；`data`/`sections` 不参与分配 effect，Realtime 只更行数据。  
- 表宽固定为各列像素之和（不用 `width:100%`），避免侧栏变宽后 `fixed` 表把列再拉伸；变窄则横向滚动、变宽则表窄于容器时右侧留白。  
- 单元格：`td` / `.data-table-cell-clip` 水平 `overflow: visible`，垂直仍限制行高。

**Assistant（实现后说明 / 本轮结论）**  
- `DataTable.tsx`：新增 `GEAR_COLUMN_PX`、`distributeFlexColumnWidths`；用 `useLayoutEffect` + `rAF` 读 wrapper 宽并写入 `intrinsicWidths`（合并时清掉已有手动列的 intrinsic）；表 `width` 改为 **`GEAR_COLUMN_PX + Σ列宽`**；`td`/`cellBodyClip`/注入 CSS 改为水平可溢出。未引入 ResizeObserver 重算列宽（仅初始按当时容器宽分配并冻结）。  
- **验证**：全页刷新或换 `storageKey` 后列宽和应等于当时表格区宽度；Realtime 更新行数据列宽不变；长文本可水平叠出单元格边界（若外层横向 ScrollView 裁剪则为容器限制）。  
- **残留**：极长内容可能与相邻列视觉重叠，依赖业务列仍可用 `ellipsis`/`title`。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`

---

### 2026-05-06（Vouchap Web：DataTable 初始列宽每开表重算、可缩小、拖拽 1～80% 视口）

**User（提示词/原意）**  
- 「现在在初始列宽基础上只能拉大，不能缩小列宽了。再强调下需求：1、每次打开一个表格时（或全页刷新时），按此前的规则计算列宽，并把列宽值缓存下来固定。2、用户手动可拖动各列调整列宽，列宽调整幅度可从1px-窗口宽度的80%范围内自由拖动。3、调整单列列宽不应影响其他各列，列宽之和小于窗口则右端留空，大于窗口则设置横向滚动条。」

**Assistant（实现前说明）**  
- 缩小失效主因：`table-layout:fixed` 下 **`<colgroup><col>`** 仍为 React 上一次渲染的较大宽度时，会压过表头 `th` 上拖拽写入的较小宽度。拖拽过程中需同步更新对应 **col** 节点。  
- 与需求 1 对齐：去掉列宽 **localStorage**，**storageKey 变化 / 进入该表 / 全页刷新** 时清空手动覆盖并重跑 intrinsic 测量；会话内数据刷新仍不重复测量。  
- 与需求 2 对齐：**手动**宽度用 **`clamp(1, floor(0.8 * window.innerWidth))`**；**初始 intrinsic** 仍按测量/列 minWidth，不套 80% 上限。

**Assistant（实现后说明 / 本轮结论）**  
- `DataTable.tsx`：删除 `readStoredColumnWidths` 与写入 localStorage；`useLayoutEffect([storageKey])` 清空 `columnWidths` + intrinsic 并允许重新 capture；`commitColumnWidth` 仅 state 且 clamp；拖拽 `mousemove/mouseup` 内 **`applyWidthPx`** 同步 **th、tbody td、colgroup col**；`columnSizeStyle` 对用户覆盖值 clamp；intrinsic 写入改为无测量结果时置 `{}`。  
- 历史键 `localStorage` `vouchap.dataTable.columnWidths.*` 不再读取，可手动清理。  
- **验证**：新开/刷新表格列宽应重新计算；列宽可拖窄；单列上限约 0.8×视口宽；总宽小于容器时右侧留白、大于时出现横向滚动。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`

---

### 2026-05-06（Vouchap Web：DataTable 列宽互不挤占、统一规则）

**User（提示词/原意）**  
- 「现在调整单列列宽仍会挤压/拉伸其他列宽，似乎是挤压到一定程度时才增加横向滚动条。web端各个模块的表格需统一交互规则。」

**Assistant（实现前说明）**  
- 根因：`table` 上 `minWidth:100%` 在 `table-layout:fixed` 下会让列宽向视口看齐并再分配；部分列仅有 `minWidth` 无 `width` 会参与吃剩余宽度；`td.max-width:0` 也会干扰列分配。  
- 计划：每列始终输出相同像素 `width`+`minWidth`；去掉表 `minWidth`（保留 ScrollView `contentContainerStyle.minWidth:100%`）；加 `<colgroup>`；移除数据 `td` 的 `max-width:0`；文件头注明 Web 统一规则（各业务仍只用本 `DataTable`）。

**Assistant（实现后说明 / 本轮结论）**  
- `DataTable.tsx`：按上修改；`columnSizeStyle` 未冻结列亦 `width=floor`；表仅 `width:max-content` + `fixed`。  
- **验证**：拖宽一列应即刻出现/增加横向滚动，他列像素宽度不变；窄表时滚动条区域仍至少视口宽（content minWidth）。**残留**：若某屏仍有非 `DataTable` 的 `<table>`，需单独对齐（当前主列表均为 `DataTable`）。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`

---

### 2026-05-06（Vouchap Web：DataTable 列宽拖拽无下限、总宽可溢出横向滚动）

**User（提示词/原意）**  
- 「手动调整列宽时不需控制最小列宽，调整单列列宽不需调整其他列宽，可以让列宽之和溢出窗口，横向滚动条浏览右端列。」

**Assistant（实现前说明）**  
- 去掉拖拽时的 `col.minWidth` 下限；表宽由 `100%` 改为可随列宽增长（`max-content` + `min-width: 100%`），并用 `table-layout: fixed` 减轻单列拖动时挤占他列；用户保存的列宽允许窄于列定义 `minWidth`，且不再被 `maxWidth` 限制。

**Assistant（实现后说明 / 本轮结论）**  
- `DataTable.tsx`：拖拽与持久化列宽使用 **`Math.max(1, …)`** 仅防止 0px，不再使用列定义 `minWidth`；拖拽过程中清除 **`maxWidth`** 内联以便拉宽。  
- **`columnSizeStyle`**：仅对 **`columnWidths`（用户保存）** 允许小于列 `minWidth`；`col.maxWidth` 仅在未手动保存该列宽度时作用于 th/td，避免用户拉宽后被定义 `maxWidth` 压回。  
- 表样式改为 **`width: max-content`** + **`minWidth: 100%`** + **`table-layout: fixed`**，列宽总和可超过视口，由原有横向 `ScrollView` 滚动查看。  
- localStorage 读取列宽允许 **`>= 1`**。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`

---

### 2026-05-06（Vouchap Web：DataTable 单元格单行缩略、Engagement 分类列不换行）

**User（提示词/原意）**  
- 「firm端engagement表格，打开右侧栏时，压缩了列宽，updated列内容溢出导致换行而改变了表格行高。内容溢出的改为缩略模式处理，不要自动换行影响行高，检查其他各表格的各列」

**Assistant（实现前说明）**  
- 根因：`Updated` 等列 `Text` 未限制行数；Classification 使用 `flexWrap: 'wrap'` 标签会在窄列多行。  
- 计划在 `DataTable` 数据单元格外包一层裁剪容器，并对 Web 注入 `td.data-table-td-cell` + `max-width: 0` 以利于列内缩略；各列 `Text` 统一 `numberOfLines={1}` + `ellipsizeMode="tail"`（日期类 Web 上补 `title` 展示全文）。Engagement / buildEngagement 的 Classification 改为单行 `formatCategory` 字符串（与列表密度一致）。

**Assistant（实现后说明 / 本轮结论）**  
- `DataTable.tsx`：数据 `td` 增加 `data-table-td-cell`，内容外包 `View` + `data-table-cell-clip`；全局样式收紧数据列高度与裁剪。  
- `engagementTableColumns.tsx`、`firm/engagements.tsx`：`updatedAt`/`createdAt`/Client/Classification 等按上处理；分类列去掉多行标签；删除仅用于旧分类渲染的 TAG 调色板与 `getTagColor`（engagements 页）。  
- `voucher-table-columns.tsx`：收据/收入/进销存/行项等补全单行缩略；`InputTypeCell` 禁止换行。  
- `firm/clients.tsx`：客户名与日期类列单行缩略。  
- **验证**：桌面端打开 Engagements 并展开右侧栏，行高应保持 40px，过长文案省略号；悬停 `title` 可看完整分类/时间（Web）。**残留**：行内下拉（Category/Attribution）列在极窄时可能截断控件，可再单独设 `minWidth`。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`  
- `vouchap-app/src/mobile-ui/components/engagementTableColumns.tsx`、`app/firm/engagements.tsx`  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/clients.tsx`

---

### 2026-05-06（Vouchap Web：DataTable 首列过宽 / 冻结规则与 auto 初始布局）

**User（提示词/原意）**  
- 「现在登录时自动计算的首列列宽太宽，导致表格大幅溢出窗口，无法看到和调整其他列宽了。初始列宽按此前的规则计算，只是数据加载或变动时不再重新计算」

**Assistant（实现前说明）**  
- 上一版 `table-layout: fixed` 在仅设 `minWidth` 时易让首列吃掉余量、整体过宽。改为默认 **auto** 表布局，使首帧与此前一致由浏览器按内容与 `minWidth` 分配。  
- 在 **paint 后**（`requestAnimationFrame`）对「无 localStorage 列宽」的列测量 `th` 宽度写入 `intrinsicWidths` 并固定；同一 `layoutCaptureKey`（storageKey + 列顺序 + 可见列）下 **不因数据/Realtime 刷新重测**；用户拖拽仍写入 localStorage 并优先生效。

**Assistant（实现后说明 / 本轮结论）**  
- `DataTable.tsx`：去掉 `tableLayout: 'fixed'`；新增 `intrinsicWidths` + 每 key 一次捕获；`storageKey` 仍用 `useLayoutEffect` 同步持久化列宽并清空冻结；捕获用 `useEffect`+rAF 避免与同步列宽同一周期读到旧 DOM。  
- **验证**：冷启动登录表格首列不应异常撑满；刷新列表或 Realtime 更新后未改列集合时列宽稳定；改列显隐/顺序后应重新冻结。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`

---

### 2026-05-06（Vouchap Web：DataTable 列宽持久化 + 列表 Realtime 含桌面端）

**User（提示词/原意）**  
- 「vouchap项目web端，前端缓存各表格列宽，数据加载时不进行列宽自动计算。然后让表格数据全面支持realtime。」

**Assistant（实现前说明）**  
- `DataTable` 已有拖拽改列宽但仅写 DOM，数据重渲染后丢失；`storageKey` 未接入持久化。计划在 Web 表格上使用 `localStorage`（`vouchap.dataTable.columnWidths.${storageKey}`）读写列宽，渲染时合并 `width`/`minWidth`，`table-layout: fixed`，避免依赖内容反复重算列宽。  
- 移除各列表页在 `isDesktopWeb` 时跳过 Supabase `postgres_changes` 的逻辑，使支出/收入/进销存/行项/实体/客户订单/Engagements 等在桌面 Web 与移动端一致订阅（保留防抖刷新）。

**Assistant（实现后说明 / 本轮结论）**  
- `DataTable.tsx`：列宽状态 + 拖拽结束 `commitColumnWidth` 写回 state 与 localStorage；`storageKey` 变化时重载缓存；表头/单元格统一应用 `columnSizeStyle`；表 `tableLayout: 'fixed'`。  
- 以下页面移除 Web 端 Realtime 早退并调整 effect 依赖：`receipts.tsx`、`invoices.tsx`、`inbound.tsx`、`outbound.tsx`、`receipt-items.tsx`、`entities-manage.tsx`、`firm/client/[clientSpaceId].tsx`、`firm/engagements.tsx`、`firm/clients.tsx`；`engagement-realtime.ts` 顶部注释同步。  
- **验证建议**：Web 上打开带 `storageKey` 的表格，拖拽列宽后触发列表刷新或 Realtime 更新，列宽应保持；两客户端协作改同一列表应能自动刷新（约 300ms 防抖）。**残留风险**：Realtime 高频写入时列表全量刷新仍有一定开销；极窄视口下 `table-layout: fixed` 与横向 ScrollView 需肉眼确认无回归。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`、`invoices.tsx`、`inbound.tsx`、`outbound.tsx`、`receipt-items.tsx`、`entities-manage.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/client/[clientSpaceId].tsx`、`firm/engagements.tsx`、`firm/clients.tsx`  
- `vouchap-app/src/mobile-ui/lib/engagement-realtime.ts`

---

### 2026-05-05（Vouchap：失败小票详情重试被额度拦截修复）

**User（提示词/原意）**  
- 「vouchap中，没有识别成功的receipt，详情中重试识别有如图报错。」（报错文案为“included recognitions for this month are used up...”）。

**Assistant（实现前说明）**  
- 排查 `receipt-details` 重试入口与 `reprocess-voucher-recognition` 调用链，确认失败小票（`needs_retake`）在详情页点击重试时也会先执行 `assertClientRecognitionAllowed`，被月度额度前置拦截。  
- 计划在重试逻辑中增加失败重试判定：仅对非失败重试场景执行额度前置校验，失败重试直接进入识别流程。

**Assistant（实现后说明 / 本轮结论）**  
- 在 `reprocessExpenseReceiptFromStoredMedia` 增加 `isFailedRecognitionRetry`（`status === 'needs_retake'` 或 `recognitionFailCount > 0`）分支；该分支不再触发额度前置拦截。  
- 对非失败场景仍保留原有额度校验与失败计数逻辑，避免影响正常配额控制。  
- 已对改动文件执行 `ReadLints`，无新增 lint 错误。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/reprocess-voucher-recognition.ts`  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`

---

### 2026-05-05（Vouchap：Expo / EAS 全平台 production 构建）

**User（提示词/原意）**  
- expo 构建全平台 production。

**Assistant（实现前说明）**  
- Web：`NODE_ENV=production npx expo export -p web` → `dist/`。  
- 原生：**EAS** `production`（`eas.json`）；需已登录；**appVersionSource: remote** 会递增云端 Android **versionCode** / iOS **buildNumber**。  
- 说明：`npx eas-cli` 若遇全局 npm 缓存权限错误，可用 **`NPM_CONFIG_CACHE=/tmp/npm-cache-$(whoami)`** 规避。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 `vouchap-app` 执行 **Web production export**，输出 **`dist/`**。  
- **Android**：已提交 EAS production（示例：`builds/4ed53995-d1c1-4589-b319-4e3baa6549c7`，Version **2.6.1**，versionCode **52**，进行中/请在 Expo 控制台查看最终状态）。  
- **iOS**：单独提交 production（**builds/be534944-2084-4c86-a245-05f0b8d65447**，云端递增 **buildNumber 36**）；CLI 可能在云端编译阶段阻塞较久，可在网页跟踪日志与 artifact。  
- 归档约 **337 MB**，可考虑 `.easignore` 减小上传体积。

**关联**  
- `vouchap-app/eas.json`、`docs/DEPLOY-CLOUDFLARE.md`（Web 部署）

---

### 2026-05-04（Vouchap：收入拍照单次识别客户税号/电话/地址并与支出对齐写库）

**User（提示词/原意）**  
- 收入拍照要和支出一样在一次结果里带齐客户税号/电话等。

**Assistant（实现前说明）**  
- 原因：收入拍照此前复用 **`recognizeReceipt`**（支出 prompt），客户侧字段偏离「买方/Bill To」，且 **`convertGeminiResultToInvoice`** 调用 **`findOrCreateEntity`** 未传入 **`supplierInfo`** 税号/电话/地址。  
- 计划：新增 **`recognizeInvoiceFromImage`**（收入分类 + 单次 JSON 含 **customerName + supplierInfo**）；抽取 **`loadImageUrlAsBase64ForGemini`** 供支出/收入共用下载逻辑；**`normalizePrintedPartyContact`** 统一解析 **supplierInfo / customerInfo**；收入文字/文档/语音 prompt 补充 **supplierInfo**；入口与 **`convertGeminiResultToInvoice`** 写入实体三字段。

**Assistant（实现后说明 / 本轮结论）**  
- `gemini.ts`：新增 **`recognizeInvoiceFromImage`**、**`buildInvoiceImageExtractionRules`**、**`loadImageUrlAsBase64ForGemini`**、**`normalizePrintedPartyContact`**；**`recognizeReceipt`** 改用共享下载；收入 **text / document / audio** 路径补充 **supplierInfo** 与归一化。  
- `receipt-helpers.ts`：**`convertGeminiResultToInvoice`** 中 **`findOrCreateEntity`** 传入税号/电话/地址（与支出一致）。  
- `index.tsx`、`chat-to-log.tsx`、`reprocess-voucher-recognition.ts`：收入 **图片** 改调 **`recognizeInvoiceFromImage`**。  
- **验证**：拍收入凭证一张，日志仅一轮识图；数据库 **entities** 在名称匹配时应写入（或补全）税号/电话/地址。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`、`receipt-helpers.ts`  
- `vouchap-app/src/mobile-ui/app/index.tsx`、`chat-to-log.tsx`  
- `vouchap-app/src/shared-logic/reprocess-voucher-recognition.ts`

---

### 2026-05-04（Vouchap：发布版本 2.6.1 Build 51）

**User（提示词/原意）**  
- 版本号 v2.6.1。

**Assistant（实现前说明）**  
- 按仓库准则同步 `package.json` / `package-lock.json` / `app.json` / `app.config.js` / Android `build.gradle` / iOS `Info.plist`；构建号由上一版 50 递增为 **51**，与 iOS `CFBundleVersion`、Android `versionCode` 一致。

**Assistant（实现后说明 / 本轮结论）**  
- 已全部写入 **2.6.1** / **51**；已执行 `git commit` + `git push`，提交说明：`发布版本号 2.6.1 (Build 51)`。

**关联**  
- `vouchap-app/package.json`、`app.json`、`app.config.js`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`

---

### 2026-05-04（Vouchap：入库/出库语音 — 去掉「转写 + 二次解析」双次 Gemini）

**User（提示词/原意）**  
- 把收入/其它凭证里类似的「二次识别」也扫一遍并优化（接续支出侧「同一张图不要为补字段再调一轮 API」的思路）。

**Assistant（实现前说明）**  
- 扫描结论：`recognizeInboundFromAudio` / `recognizeOutboundFromAudio` 原为 **`transcribeAudioToText` + `recognize*FromText`**，同一音频 **两次** Gemini；收入语音 **`recognizeInvoiceFromAudio`** 已是单次 multimodal，无需改。  
- 计划：入库/出库语音改为 **音频 inline + 与文字路径相同的 extraction 规则**，一次 `generateContent`，共用 **`parseInboundModelJson` / `parseOutboundModelJson`** 与 **`normalizeInboundItems` / `normalizeOutboundItems`**；删除仅被上述路径使用的 **`transcribeAudioToText`**。

**Assistant（实现后说明 / 本轮结论）**  
- `gemini.ts`：抽取 **`loadInboundOptionLists` / `buildInboundExtractionRules`**（出库同理）、解析函数；**`recognizeInboundFromText` / `recognizeOutboundFromText`** 改为复用规则字符串；**`recognizeInboundFromAudio` / `recognizeOutboundFromAudio`** 单次 multimodal（`audio/m4a` + `getAvailableImageModel` 与 `geminiModelsToTry` 与发票语音一致）；移除 **`transcribeAudioToText`**。  
- **验证**：入库/出库语音路径日志中「同一 URI」应只出现 **一轮**带音频的 `generateContent`；文本聊天入库/出库路径行为不变。  
- **残留**：收入 **拍照** 仍为 `recognizeReceipt` + `convertGeminiResultToInvoice`（单次）；若需客户税号/电话等与支出 `supplierInfo` 对齐，属字段与 prompt 扩展，未在本轮做。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`

---

### 2026-05-04（Vouchap：更正 — 保留重试；去掉「商户二次识别」重复传图）

**User（提示词/原意）**  
- 先前理解有误：**模型不可用 / 识别失败**的重复尝试机制需**继续保留**。  
- 真实诉求：避免为**不同信息**拆成多次 input；**整合提示词与输出格式**，让多次返回的内容在**一次识别**里完整返回并正确写库。

**Assistant（实现前说明）**  
- 根因：`receipt-processor` 在主链路 `recognizeReceipt` 之后仍 **`recognizeSupplierInfo(finalImageUrl)`**，对**同一图片**再跑一轮 Gemini（典型日志里「第二次空 / 第三次截断」常与「主识别 + 备用模型 + 商户二次」叠加有关）。  
- `convertGeminiResultToReceipt` 已从首次结果的 `supplierInfo` 写入 `findOrCreateEntity`，二次调用冗余。  
- 恢复：`runWithRecognitionRetry` **`maxAttempts: 5`**；`recognizeReceipt` / `recognizeReceiptFromDocument` 内 **`geminiModelsToTry`** 完整模型回退；移除 helper 中 **`receiptImageModelsToTry`** 截断。

**Assistant（实现后说明 / 本轮结论）**  
- `receipt-processor.ts`：删除异步 **`recognizeSupplierInfo`** 及其 entity 合并逻辑；供应商税号/电话/地址仅依赖 **`recognizeReceipt` 单次 JSON**。  
- `gemini.ts`：`buildReceiptExtractionRules` 增加 **single pass** 说明；**`recognizeSupplierInfo`** 标注为历史兼容、主链路勿再调。  
- 多处 **`maxAttempts`** 恢复为 **5**（processor / index / chat-to-log / reprocess）。  
- **验证**：成功路径应对同一 receipt **仅一次**主 multimodal（外加模型回退或外层重试时仍属「失败恢复」）；关联方字段随首次识别写库。

**关联**  
- `vouchap-app/src/shared-logic/receipt-processor.ts`  
- `vouchap-app/src/shared-logic/gemini.ts`

---

### 2026-05-04（Vouchap：小票识别减少 Gemini 调用次数 + 精简提示词）

**User（提示词/原意）**  
- AI API log 显示单次识别约 **3 次调用**，图片均重复提交；第二次空响应、第三次仅少量 JSON。  
- 要求：**整合提示词与识别流程**，减少调用次数；在**保证返回格式约束**前提下**精简提示词**以降低 input token。

**Assistant（实现前说明）**  
- 根因：`recognizeReceipt` 使用 `geminiModelsToTry` 合并「探测模型 + 长 fallback 列表」，单次函数内可能连续多次 `generateContent`（每次都带整图）；JSON 解析失败时原先 **`break`**，不再试后续模型；外层 `runWithRecognitionRetry(..., 5)` 会整轮重复下载图片并重跑。  
- 计划：`gemini-helper` 增加 **`receiptImageModelsToTry`**（每请求最多 **2** 个模型）；图片路径对空响应/解析失败 **`continue`** 换模型；精简 **`buildReceiptExtractionRules`** / intro / `RECEIPT_JSON_ITEMS_RULE`；外层 retry 改为 **2** 次（processor / index / reprocess / chat-to-log 中对 recognizeReceipt 的路径）。

**Assistant（实现后说明 / 本轮结论）**  
- `gemini-helper.ts`：`receiptImageModelsToTry`、`MAX_RECEIPT_VISION_MODEL_ATTEMPTS`。  
- `gemini.ts`：`recognizeReceipt` / `recognizeReceiptFromDocument` 改用上述列表；空响应显式报错；catch 对空/JSON 错误继续下一模型；支出规则与 schema 合并为短文案（下游 `ensureGeminiParsedReceiptItems` 仍兜底）。  
- 多处 `runWithRecognitionRetry` 的 `maxAttempts` 改为 **2**。  
- **验证**：同一识别在日志中应为「单次下载 base64 + 至多 2 次 multimodal + 至多 2 轮外层重试」的上限显著低于原先；抽查中英文小票 JSON 字段齐全。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`  
- `vouchap-app/src/shared-logic/gemini-helper.ts`

---

### 2026-05-04（Vouchap：duplicate 状态详情页编辑改为删除）

**User（提示词/原意）**  
- `duplicate` 状态的 **expenses / income** 详情页，**编辑**按钮也改成**删除**按钮。

**Assistant（实现前说明）**  
- 在 `receipt-details` / `invoice-details` 的 FAB 分支中，在 `needs_retake` 之后、默认编辑之前增加 `status === 'duplicate'`，复用已有删除确认与 `deleteReceipt` / `deleteInvoice`，样式与失败三次时的删除 FAB 一致（红底 `retryFab` + `trash-outline`）。  
- `VoucherStatus` 增加 `duplicate`，并补齐 `invoices` / `inbound` / `outbound` 列表的 status 色与文案映射以满足 `Record<VoucherStatus, …>`。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新详情页与上述列表映射；`ReadLints` 无新增问题。  
- 若业务侧收入单尚未写入 `duplicate` 状态，仅支出 duplicate 会立刻受益；类型已支持收入同态扩展。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`  
- `vouchap-app/src/mobile-ui/app/invoice-details/[id].tsx`  
- `vouchap-app/src/shared-logic/types/index.ts`

---

### 2026-05-04（Vouchap：重新识别用已有附件；失败≥3 次 FAB 改删除）

**User（提示词/原意）**  
- 「重新识别」应直接用凭证已关联的**图片或音频**再次识别，**不要**再提示相册/拍照重传。  
- 已累计识别失败次数 **≥3** 时，同一位置按钮改为**删除**，样式仍与同风格 FAB（红底白芯线形 icon）。

**Assistant（实现前说明）**  
- DB：`receipts` / `invoices` 增加 `recognition_fail_count`；识别结果为 `needs_retake` 或流水线失败时递增，成功识别后归零（支出后台处理器与收入首页失败分支对齐）。  
- 共享模块：`reprocessExpenseReceiptFromStoredMedia` / `reprocessIncomeInvoiceFromStoredMedia` 下载已有 Storage URL 或使用 chat log 语音 URL，再走与原入口一致的 Gemini 流程（图片→`processReceiptInBackground` 且跳过删除用户原图；PDF/音频分支单独拼接）；详情页 FAB 不再调用 `handleImagePicker`。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移：`vouchap-app/supabase/migrations/20260504130000_recognition_fail_count.sql`。  
- 逻辑：`recognition-fail-count.ts`、`reprocess-voucher-recognition.ts`；`receipt-processor.ts` 增加失败计数、`skipDeleteSourceUrl`；`index.tsx` 收入识别失败调用 `recordInvoiceRecognitionFailure`，成功 `resetInvoiceRecognitionFailCount`；`chat-logs.ts` 新增 `getChatLogsByInvoiceId`。  
- UI：`receipt-details` / `invoice-details` 中 `recognitionFailCount >= 3` 显示 `trash-outline` + `showConfirmDestructiveDialog` 删除；否则走重新识别并显示 loading。  
- **验证**：执行迁移后，对 needs_retake 凭证点重新识别应直接跑识别；连续失败三次后 FAB 变为删除。  
- **残留**：未跑迁移时插入/更新可能报未知列；详情摘要区无图时点按仍可打开相册（仅 FAB 行为改变）。

**关联**  
- `vouchap-app/src/shared-logic/reprocess-voucher-recognition.ts`  
- `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`  
- `vouchap-app/src/mobile-ui/app/invoice-details/[id].tsx`

---

### 2026-05-04（Vouchap：识别失败详情页将“编辑”改为“重新识别”）

**User（提示词/原意）**  
- 识别失败的 receipts / income，在详情页把编辑按钮替换为“重新识别”按钮，使用更合适 icon，配色更显眼。

**Assistant（实现前说明）**  
- 定位 `receipt-details/[id].tsx` 与 `invoice-details/[id].tsx` 的 FAB 区域；在 `status === 'needs_retake'` 且非编辑态时，将原编辑 FAB 替换为 re-recognize FAB。  
- 为避免引入新流程，按钮复用现有 `handleImagePicker`（引导用户重拍/重选图片），普通状态保持原编辑按钮不变。

**Assistant（实现后说明 / 本轮结论）**  
- `receipt-details/[id].tsx`：失败态显示橙红色 `retryFab`，icon 改为 `refresh`，文案 `Re-recognize`；点击走 `handleImagePicker`。  
- `invoice-details/[id].tsx`：同样改为失败态 `Re-recognize` 按钮（同 icon、同配色、同交互）。  
- 已通过 `ReadLints` 检查，两文件无新增报错。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/invoice-details/[id].tsx`

---

### 2026-05-04（Vouchap：去除“税额分析 + 拆分到 item”流程中的 AI 调用）

**User（提示词/原意）**  
- “去除分析和拆分税额到item这个流程对ai的调用”。

**Assistant（实现前说明）**  
- 当前 `receipt-item-tax` 本身是规则引擎，不直接调 Gemini；AI 依赖点在上游识别阶段（提示词要求输出税额/税区）以及保存后触发拆税队列。  
- 计划两步：  
  1) 小票识别提示词与解析中去掉税额/税区 AI 输出依赖，税额改为本地由 `totalAmount - itemsSum` 推导；  
  2) 保存/更新收据后不再触发 `enqueue_receipt_tax_reconcile`，停止“拆分税额到 item”流程运行。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/shared-logic/gemini.ts`：  
  - 删除小票 prompt 对 tax jurisdiction 字段的要求；  
  - 删除小票 text/document 输出 schema 中税区字段；  
  - 识别结果中 `tax` 改为本地推导（`max(totalAmount - itemsSum, 0)`，保留两位小数）；  
  - `taxJurisdictionCountry/Region` 固定置 `null`，不再使用 AI 回传税区。  
- `vouchap-app/src/shared-logic/database.ts`：  
  - 移除 `enqueueReceiptTaxReconcileFireAndForget` 引入与调用；  
  - 保存/更新收据后不再入队执行 item 税额拆分。  
- `ReadLints` 已检查改动文件，无新增报错。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/gemini.ts`  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/database.ts`

---

### 2026-05-04（Vouchap：去除“拆分税到 item”的 AI 依赖字段）

**User（提示词/原意）**  
- “拆分税到item的AI调用逻辑现在去除”。

**Assistant（实现前说明）**  
- 核对当前拆税链路：`receipt-item-tax` 为规则引擎 + 税率表，不直接调用 Gemini；与 AI 的耦合点主要是识别阶段把 `posTaxCode` 注入 item，后续拆税再消费该字段。  
- 计划：保留小票识别主流程，但移除“用于拆税”的 AI 输出字段约束与映射（`posTaxCode`），让拆税仅依赖税率规则/默认税级，不再依赖模型输出该字段。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 `vouchap-app/src/shared-logic/gemini.ts` 删除 `posTaxCode` 相关提示词与 schema 约束，并移除图片/文档/文本路径对 `item.posTaxCode` 的解析写入。  
- 已在 `vouchap-app/src/shared-logic/receipt-helpers.ts` 去除从 Gemini 结果向 `ReceiptItem` 回填 `posTaxCode`。  
- `ReadLints` 检查改动文件无新增报错。  
- 结果：拆税阶段不再依赖 AI 提供的 `posTaxCode` 字段（税额拆分走规则与税率表逻辑）。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/gemini.ts`  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/receipt-helpers.ts`

---

### 2026-05-01（vouchap-website：Showcase 关闭改为站内 `/` 非写死域名）

**User（提示词/原意）**  
- **showcase 右上角返回**不要写死链接，**返回网站首页**。

**Assistant（实现前说明）**  
- 去掉 **`SHOWCASE_HOME_URL`**；**`<Link href="/">`**（**`next/link`**）；**`aria-label`** 英文。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；本地 **`localhost`** / 任意部署域名均回站点根路径。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：顶栏精简 + 页脚 Vouchap 链 showcase）

**User（提示词/原意）**  
- **网站主页顶菜单**：去掉 **Marketplace**、**For firms & clients**、**Showcase**。  
- **页面底部** **Vouchap** 名称链接改为指向 **showcase**。

**Assistant（实现前说明）**  
- **`Navbar.tsx`** 移除三项 **`Link`**；**`Footer.tsx`** 品牌 **`Link`** **`/` → `/showcase`**。

**Assistant（实现后说明 / 本轮结论）**  
- 顶栏保留 **Product / Tax season pains / Roadmap / Help**；验证首页 **`/`** 与含 **`Footer`** 的页面。

**关联**  
- `vouchap-website/components/Navbar.tsx`; `vouchap-website/components/Footer.tsx`

### 2026-05-01（vouchap-website：Showcase 关闭钮改用 mouse 悬停适配触控板）

**User（提示词/原意）**  
- **没有出现**；所说触摸指 **电脑上鼠标/触控板**，不是手机触摸。

**Assistant（实现前说明）**  
- 海报容器：**`onMouseEnter` / `onMouseLeave`** 替代 **`pointerenter` / `pointerleave`**（桌面触控板合成指针更一致）；保留 **`onTouchStartCapture`** 给真机。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 触摸显示关闭 + 指向 vouchap.com）

**User（提示词/原意）**  
- **触摸海报**时返回按钮**没了**；需 **右上角保留**，**触摸出现**，点击 **`https://www.vouchap.com/`**。

**Assistant（实现前说明）**  
- **`pointerleave`** 在触屏上会在 **touchend** 后误触，**仅 `pointerType === 'mouse'` 时置 false**；**`onTouchStartCapture`** 在海报上先置 true。关闭链改为 **`<a href="https://www.vouchap.com/">`**，**`SHOWCASE_HOME_URL`** 常量；去掉未用 **`Link`** import。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；触一次海报后关闭钮保持可点直到再次鼠标移出（仅 hover 设备会移出隐藏）。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase QR 说明文案同宽居中 + 略加大）

**User（提示词/原意）**  
- 文案 **Scan to email and discuss** **加大到与二维码同宽**，并与二维码 **水平居中对齐**。

**Assistant（实现前说明）**  
- 外层 **`w-[168px]`**（**112×1.5** 与缩放后视觉同宽）；二维码 **`origin-bottom`** + 行内 **居中**，与下方 **`w-full text-center`** 文案同一竖轴。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`** **`ShowcaseEmailQr`**；字号 **0.72 / sm 0.78 rem**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 邮箱 QR 视觉 1.5× 不占排版）

**User（提示词/原意）**  
- **二维码放大 1.5 倍**，**不影响其他内容的位置**。

**Assistant（实现前说明）**  
- **占位仍为 112×112**，**`scale-[1.5]` + `origin-bottom-right`**；**qrserver** **`size=180`**；外层 **`overflow-visible`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`** **`ShowcaseEmailQr`**；扫码区域视觉上更大，**TAM / platform** 流式位置不变（可能向画布内侧视觉溢出）。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 右下角 QR 改为 mailto jamesgao@aim.link）

**User（提示词/原意）**  
- **右下角二维码更换成扫码发 email 的码**：**jamesgao@aim.link**。

**Assistant（实现前说明）**  
- **`SHOWCASE_QR_*`** 改为 **`mailto:jamesgao@aim.link`**；**qrserver** **`data`** 编码该字符串；**alt / 说明**英文；组件 **`LinkedInQr` → `ShowcaseEmailQr`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；扫码一般会打开手机邮件客户端并填入收件人。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase TAM / total 区块再下移）

**User（提示词/原意）**  
- **total 部分再下移一点**。

**Assistant（实现前说明）**  
- 加大 **Flow gap**（**`h-40·44·48`**）；**TAM 行** **`mt`/`pt`** 各加一档（含 **`sm`/`lg`** 与 **`lg:pt`** arbitrary）。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 底区 **TAM** 相对中部内容更低。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 副标题与 TAM 脚注强制单行）

**User（提示词/原意）**  
- **不要换行**。

**Assistant（实现前说明）**  
- **`subtitleLead`**、**`tamNote`** 段落：**`whitespace-nowrap`**；外层 **`overflow-x-auto`**，窄屏可横向滑动读完。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 两处文案不换行。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase TAM 脚注改为 IBISWorld & Statista）

**User（提示词/原意）**  
- **`Reliable data for a scalable future`** 改为 **`Based on IBISWorld & Statista Tax Services Analytics 2024-2026`**。

**Assistant（实现前说明）**  
- 更新 **`COPY.tamNote`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** TAM 区块第三行。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 副标题补后半句 tax filing scenarios）

**User（提示词/原意）**  
- **`Based on aim.link — The Intelligent Collaborative Infrastructure — in tax filing collaboration scenarios.`**；**slogan 下一句**增加后半句。

**Assistant（实现前说明）**  
- 更新 **`COPY.subtitleLead`** 全文。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 主标题下分隔线区块文案。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 顶栏 aim.link 左移 + 右上关闭回首页）

**User（提示词/原意）**  
- **左上 logo 左移**；**返回按钮放右上角**；**icon 改为关闭样式**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides`** 顶栏：**`justify-between`**；aim.link 外包一层 **`translate-x` 负向**左移；**`Link` `/`** 置右；**chevron** → **叉线 SVG**；隐藏态用 **`translate-x-2`** 从右侧收起。

**Assistant（实现后说明 / 本轮结论）**  
- 已改；**`aria-label`**：**Close and return home**。验证 **`/showcase`** 指针进入画布后右上出现关闭钮。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 仅画布 + 悬停/指针进入显示返回）

**User（提示词/原意）**  
- **海报画布以外的内容都去掉**；**鼠标/触摸海报时**，在**左上 logo 左侧**显示**返回 icon**。

**Assistant（实现前说明）**  
- **`app/showcase/page.tsx`**：移除固定顶栏（画布外）。**`ShowcaseSlides`**：移除底部 footer；主区域全屏居中；**`PosterFrame`** 的 **16:9** 最大宽由 **`100svh-8rem`** 改为 **`100svh-5rem`**（无顶栏/footer）。海报卡片容器 **`onPointerEnter` / `onPointerLeave`** 控制状态；**aim.link** 行左侧 **`Link` `/`** + **chevron**；隐藏时用 **`max-w-0`** 不占位。

**Assistant（实现后说明 / 本轮结论）**  
- 已按上实施；验证 **`/showcase`** 仅见海报、指针进入画布后左上角出现返回、点击回首页。

**关联**  
- `vouchap-website/app/showcase/page.tsx`; `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 三图第一张 collaboration → engagement）

**User（提示词/原意）**  
- **三张图片**里 **collaboration** 图改为 **engagement** 图。

**Assistant（实现前说明）**  
- **`SHOTS[0]`**：`web_tax_collaboration.png` → **`web_firm_engagement.png`**；核对 PNG 像素；**`intrinsicW/H`** 与 **`alt`**（英文）。

**Assistant（实现后说明 / 本轮结论）**  
- **`web_firm_engagement.png`** 为 **1024×632**，与旧图一致，**`intrinsicW/H`** 不变；**`alt`**：**Firm engagement workspace**。验证 **`/showcase`** 左侧第一张截图。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`; `public/vouchap_landing_assets/web_firm_engagement.png`

### 2026-05-01（vouchap-website：Showcase 副标题 Powered by → Based on）

**User（提示词/原意）**  
- **`Powered by aim.link`** 改为 **`Based on aim.link`**（后半句不变）。

**Assistant（实现前说明）**  
- **`COPY.subtitleLead`** 文案替换。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 分隔副标题行。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase TAM 再下移 + platform/QR translate 补偿）

**User（提示词/原意）**  
- **二维码和链接位置不变**；**total** **再下移一点**。

**Assistant（实现前说明）**  
- **TAM** 行：**`mt`/`pt` 各加一档**（**`mt-10·12·14`**, **`pt-14·16·18`**）；**platform** **`translate-y-4/6` → `2/4`**；**QR** **`4.5/7.5rem` → `4/7rem`**，抵消 TAM 增高对底区的连带下移。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase TAM 文案约 1.3×字号）

**User（提示词/原意）**  
- **total** 部分文字**同比加大约 1.3 倍**。

**Assistant（实现前说明）**  
- **`tamHead`/`tamLine`/`tamNote`** 由 **`0.8·0.9` / `0.75·0.82` / `0.7` rem** → **`1.04·1.17` / `0.975·1.065` / `0.91` rem**（×**1.3**）；**`space-y-1` → `space-y-1.5`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase TAM 单独下移 + platform/QR 微调补偿）

**User（提示词/原意）**  
- **二维码和链接位置理想**；**Total** **部分没动**，需**下移**，与 **Solving** 一行**间距**。

**Assistant（实现前说明）**  
- **TAM** 行：**`mt-8 sm:mt-10 lg:mt-12`** + **`pt` 加大**（**`pt-12 sm:pt-14 lg:pt-16`**），与上方 **Innovation** 拉开（**不改** **spacer `h-36–44`**）；**platform / QR** **`translate-y`** 略减以**抵消** TAM 增高对底区的连带下移。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 三部分再略下移）

**User（提示词/原意）**  
- **三部分再多下移一点**（空白带 + platform + QR）。

**Assistant（实现前说明）**  
- **spacer**：**`h-36 sm:h-40 lg:h-44`**；**platform**：**`translate-y-6 sm:translate-y-8`**；**QR**：**`translate-y-[5rem] sm:translate-y-32`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase spacer / translate 取中间值）

**User（提示词/原意）**  
- **矫枉过正**，取**介于二者之间**。

**Assistant（实现前说明）**  
- **spacer**：**`h-10–12` 与 `14–18rem` 之间** → **`h-32 sm:h-36 lg:h-40`**（**8/9/10 rem**）。  
- **platform**：**`translate-y-4 sm:translate-y-6`**；**QR**：**`translate-y-[4.25rem] sm:translate-y-28`**（介于 **14/24** 与 **20/32**）。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 缩小 spacer + 恢复底栏 mt-auto）

**User（提示词/原意）**  
- **移动太多**；**链接与二维码**两段被**推移**不适。

**Assistant（实现前说明）**  
- **spacer**：**`14/16/18rem` → `h-10 sm:h-11 lg:h-12`**；**TAM+platform** 外包 **`mt-auto`**，底栏再贴海报底。  
- **platform**：**`translate-y-6/10` → `translate-y-2 sm:translate-y-3`**；**`LinkedInQr`**：**`20/32` → `14/24`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；若与 Innovation 又叠再略增 **spacer `h-*`**（勿回到 **rem 两位数**）。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase spacer 移出 mt-auto 块 + 加高 h-*）

**User（提示词/原意）**  
- **无效、没动**，**继续下移**（TAM 与左栏间距）。

**Assistant（实现前说明）**  
- **原因**：**spacer 放在 `mt-auto` 底栏包内**时，与 **flex-1 grid** 的分配易表现为「加 min-h 也不动」。  
- **改法**：**spacer 为 grid 的下一兄弟**（**`h-[14rem] sm:16 lg:18`** 固定高，**非**内层 min-h）；**TAM+platform** 再其后；**去掉**整段底栏外包层的 **`mt-auto`**（避免整块贴底挤掉内层空白感知）。  
- 去掉误加在 platform 上的 **`mt-auto`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **16:9** 海报滚动与底区。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 底区 spacer 加高）

**User（提示词/原意）**  
- **继续下移一点**，**间距不足**。

**Assistant（实现前说明）**  
- **spacer `min-h`**：**`7/8/9rem` → `9/10/12rem`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase TAM 用底区 wrapper + 流式 spacer 治重叠）

**User（提示词/原意）**  
- **TAM 下移**仍**无效**，**仍与 Innovation 重叠**。

**Assistant（实现前说明）**  
- 仅加 **TAM `pt` / grid `mb`** 在 **`mt-auto` 单列 flex** 下未形成可靠流式间隔。  
- 将 **TAM + platform** 与 **固定 `min-h` 的块级 spacer** 同包在 **`mt-auto flex flex-col`** 内；**spacer 在文档流中**（**`min-h-[7rem] sm:8rem lg:9rem`**），再接 **`border-t` TAM**；**`mt-auto` 改挂在外层 wrapper**，不再单独挂 TAM。  
- 去掉中段 **grid** 的 **大 `mb-*`**，改由 **spacer** 负责分隔。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证海报 **16:9** 下左栏第三段与 **TAM** 首行。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase TAM 块下移避 Innovation 重叠）

**User（提示词/原意）**  
- **Total Addressable Market** 部分需**下移**，与左栏 **Innovation** 描述**重叠较多**。

**Assistant（实现前说明）**  
- **TAM 行**：**`pt-8 sm:pt-12` → `pt-14 sm:pt-16 lg:pt-20`**；中段 **grid `mb`**、左栏 **`pb`** 略增（**`mb-8 sm:mb-10 lg:mb-12`**，**`pb-12 sm:pb-14 lg:pb-16`**）。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 左栏第三段与 TAM 首行间距。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 左栏底留白避叠 TAM）

**User（提示词/原意）**  
- **左边文字最下部分需下移**，现在**重叠**了。

**Assistant（实现前说明）**  
- 左栏三部曲容器增 **`pb-10 sm:pb-12 lg:pb-14`**；中段 **`grid`** 增 **`mb-5 sm:mb-6 lg:mb-8`**，与 **TAM** 区分隔。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** `lg` 与窄屏。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 左栏三部曲下移 + QR 再 translate）

**User（提示词/原意）**  
- **左部文字区整体下移**；**右下角二维码再下移**。

**Assistant（实现前说明）**  
- 左列 **`lg:col-span-5`** 加 **`pt-6 sm:pt-8 lg:pt-10`**；**`LinkedInQr`** **`translate-y-14/24` → `translate-y-20/32`**（仅 transform）。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 左栏与底右 QR。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase platform 块撤回 mt 改用 translate）

**User（提示词/原意）**  
- **上一步改坏了**，其他内容**错位**；**撤回**；**换办法**下移链接与市场标识。

**Assistant（实现前说明）**  
- **撤回**：**`mt/pt` 大增**、**`LinkedInQr` translate 减小**；恢复 **`LinkedInQr`** **`translate-y-14 sm:translate-y-24`**；**platform** 区回到 **`pt-4 sm:pt-5`** 量级而不叠 **`mt-14`**。  
- **新办法**：仅在 **platform + `ShowcaseStoreBadges`** 外包 **`translate-y-6 sm:translate-y-10`**（**transform** 不落排版）；保留轻度 **`z-[12]`**（>`QR z-10`）叠绘。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase platform 与商店标下移避叠）

**User（提示词/原意）**  
- **链接和两个市场标识下移**，与**其他内容不重叠**。

**Assistant（实现前说明）**  
- **platform + `ShowcaseStoreBadges`** 容器：**`mt-10 sm:mt-14`**、**`pt-6 sm:pt-10`**、**`relative z-[15]`**（高于 QR **`z-10`**）；**`LinkedInQr`** **`translate-y`** 略减（**`14/24` → `10/16`**）降低侵入下方区块。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 底区与右下 QR。（后续已由「撤回 + translate」替代。）

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 底栏 platform 下增加 App Store / Google Play）

**User（提示词/原意）**  
- **`platform.vouchap.com`** 链接下方再摆 **Apple App Store**、**Google Play**；**素材用站内已有**。

**Assistant（实现前说明）**  
- 站内无单独徽章 PNG；与 **`client-join`** 一致使用 **`NEXT_PUBLIC_APP_STORE_URL` / `NEXT_PUBLIC_PLAY_STORE_URL`** 及默认 **`apps.apple.com`**、**`play.google.com`**；新增 **`ShowcaseStoreBadges`**（SVG + **App Store** / **Google Play** 文案），深色海报样式 **`border-white/15`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 外链与 `.env` 覆盖。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/app/client-join/page.tsx`

### 2026-05-01（vouchap-website：Showcase QR translate 再加大）

**User（提示词/原意）**  
- **继续往下**（二维码）。

**Assistant（实现前说明）**  
- **`LinkedInQr`**：**`translate-y-8 sm:translate-y-14` → `translate-y-14 sm:translate-y-24`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase QR 单独 translate 下移）

**User（提示词/原意）**  
- **继续下移**；**单独容器**下移，**不影响其他内容位置**。

**Assistant（实现前说明）**  
- **`LinkedInQr`** 增加 **`translate-y-8 sm:translate-y-14`**（与 **`sm:absolute`** 叠加）；**transform 不参与文档流**，TAM / 平台 URL / 梯形占位不变。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；若与底部链接视觉重叠可略减 **`translate`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 右下 QR 下移避梯形）

**User（提示词/原意）**  
- **右下角二维码下移**，与**梯形不重叠**。

**Assistant（实现前说明）**  
- **TAM+QR** 行 **`pt-4` → `pt-8 sm:pt-12`** 增高该区，**`sm:bottom-0`** 的 QR 相对梯形整体上移开的空隙变大；**`LinkedInQr`** **`sm:z-10`**；容器 **`overflow-visible z-[2]`**（避免用 **`translate-y`** 压住下方平台 URL）。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 右下与双层梯形间隙。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 底部平台链接加大 + 下移）

**User（提示词/原意）**  
- **底部正中链接**文字**加大**、**往下移**。

**Assistant（实现前说明）**  
- 平台 URL 区块 **`pt-1 sm:pt-2` → `pt-4 sm:pt-5`**；**`a`** 字号 **`0.72/0.78` → `0.95/1.05/1.1` rem** 断点。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 海报底区。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase collaboration 图 intrinsic 修正以实现三图同高）

**User（提示词/原意）**  
- **保持三张图片一样的高度**。

**Assistant（实现前说明）**  
- **`web_tax_collaboration.png`** 实测 **1024×632**，代码曾误写 **550×1024**，框比例错误导致横屏图在竖框内 **`object-contain`** 上下留白、看似更矮；**`SHOTS`** 第一项改为 **`intrinsicW: 1024`, `intrinsicH: 632`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；三帧共享 **`shotRowHeight`**，横屏占更宽宽、竖屏更窄，像素高度一致。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 三图同高、比例不裁不拉）

**User（提示词/原意）**  
- **collaboration** 图**不必同宽**；**三张同高**；**原图宽高比**、**不裁剪不拉伸**。

**Assistant（实现前说明）**  
- 保留行统一高度 + 每帧 **`aspectRatio: intrinsicW/intrinsicH`**（宽度随比例）；**`Image`** 去掉 **`h-full w-full`**，改为 **`max-h-full max-w-full object-contain object-center`**，避免在框内被拉满变形；外框 **`flex` 居中**。

**Assistant（实现后说明 / 本轮结论）**  
- **`RatioScreenshot`**；若某 PNG 与声明 intrinsic 比例不一致，会出现对称留白而非裁切。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 三图同高 + 宽度随各自比例）

**User（提示词/原意）**  
- **三张图片保持同高**，**宽度按图片自身比例**。

**Assistant（实现前说明）**  
- 去掉 **`flex-1`** 均分宽；每帧 **`aspectRatio: intrinsicW / intrinsicH`** + **`h-full w-auto shrink-0`**，高度由行统一、宽度由比例导出；**`Image`** **`h-full w-full object-contain`**；行上 **`overflow-x-auto`** 防极窄屏撑破。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`** · **`RatioScreenshot`**；验证 **`/showcase`** 三图宽度差异与单行。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 三图等高）

**User（提示词/原意）**  
- **保持三张图片高度一致**。

**Assistant（实现前说明）**  
- 将 **`shotRowHeight`** 固定在**三图行容器**上；**`items-center` → `items-stretch`**；子卡片 **`h-full`**；**`RatioScreenshot`** 内 **`Image`** 使用 **`h-full object-contain`**（取代 **`max-h-full`**），保证栅格内像素高度一致。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 三图列宽变化时仍单行等高。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 三图强制单行 + 撤销右栏 pr）

**User（提示词/原意）**  
- **上一步改坏了**，图片**换行**；**三张图应保持水平一行**。

**Assistant（实现前说明）**  
- **`sm:pr-36 lg:pr-40`** 挤压右栏宽度导致三图 **`flex-wrap`** 换行；**移除**右栏 **`pr`**；三图行 **`flex-wrap` → `flex-nowrap`**，**`RatioScreenshot`** 容器 **`shrink-0` → `min-w-0 flex-1`** 以便窄宽下等分收窄仍单行。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 各宽下三图一行；QR 避让用户若仍需再议布局。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 右栏整体上移避 QR）

**User（提示词/原意）**  
- **两张梯形和三张图整体上移**，与 **二维码不重叠**。

**Assistant（实现前说明）**  
- 右栏 **`pt-12 sm:pt-16 lg:pt-[5rem]` → `pt-6 sm:pt-8 lg:pt-10`** 上移整块；**`sm:pr-36 lg:pr-40`** 与底部 TAM 区 **`sm:pr-36`** 思路一致，避免与右下 **QR** 抢宽；**`ShowcaseTripleStack`** **`pb-4→pb-2`**、透视容器 **`pb-8→pb-5 sm:pb-6`** 略收底沿。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** `sm+` 宽屏右栏与 QR、窄屏布局。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase platform URL 移入海报内底部居中）

**User（提示词/原意）**  
- **文字链接加在海报页面内底部正中**（非页面最外 footer）。

**Assistant（实现前说明）**  
- **`SHOWCASE_PLATFORM_URL`**；在海报 **`showcase-dualcore-bg`** 内层、**TAM+QR 行下方**增加 **`flex justify-center`** 区块；从 **`main` 外沿 `footer`** 移除同一链接。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 卡片底正中 URL 与外链行为。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 页脚居中 platform URL）

**User（提示词/原意）**  
- **底部正中**加上文字 **`https://platform.vouchap.com/`**。

**Assistant（实现前说明）**  
- 在 **`ShowcaseSlides`** 页脚 **`footer`**（已居中）中增加 **外链**，**`target="_blank"`** + **`rel="noopener noreferrer"`**，文案为完整 URL。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 页脚展示与点击跳转。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 主 slogan 加入 Tax Filing）

**User（提示词/原意）**  
- **Tax filing Collaboration**（主 slogan 措辞）。

**Assistant（实现前说明）**  
- **`COPY.titleEn`**：**Tax Collaboration → Tax Filing Collaboration**（标题大小写 **Tax Filing**）。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 主标题。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase slogan Collaboration + 左上 logo 再下移）

**User（提示词/原意）**  
- **主 slogan** 中 **Coordination → Collaboration**；**左上角 logo 单独再下移一点**，**不影响其他内容位置**。

**Assistant（实现前说明）**  
- **`COPY.titleEn`** 替换用词；**`header`** 保持 **`pt` 与 `-mb` 等量**（**`pt-2.5 -mb-2.5 sm:pt-3 sm:-mb-3`**），仅增高 logo 绘制区并抵消 flex 占位。

**Assistant（实现后说明 / 本轮结论）**  
- **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 标题文案与顶区其余垂直节奏。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 仅下移左上角 logo，其余不动）

**User（提示词/原意）**  
- **上一步不对**：**只动左上角 logo**，**下面主标题等内容不要跟着移动**。

**Assistant（实现前说明）**  
- 撤销内层 **`pt-[4%] sm:pt-[5%]`**，恢复 **`pt-2 sm:pt-2.5`**；在 **`header`** 上加 **`pt-1.5 sm:pt-2`** 下移 aim.link，并用同等 **`-mb-1.5 sm:-mb-2`** 抵消 header 增高，避免 flex 后续块下移。

**Assistant（实现后说明 / 本轮结论）**  
- 仅 **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 顶区主标题与左栏是否与改全文件 **`pt`** 前对齐，仅 logo 略低。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 左上角 logo 顶边与左边距对齐）

**User（提示词/原意）**  
- **左上角 logo 下移一点**；**左边距与上边距保持一致**。

**Assistant（实现前说明）**  
- 海报内层原为 **`pt-2 sm:pt-2.5`**，左右为 **`px-[4%] sm:px-[5%]`**，顶远小于左右百分比留白；改为 **`pt-[4%] sm:pt-[5%]`**，与左右同一百分比，CSS 百分比 padding 与宽度同源，顶/左视觉对齐；logo 随整块下移。

**Assistant（实现后说明 / 本轮结论）**  
- 仅 **`ShowcaseSlides.tsx`** 内层容器；验证 **`/showcase`** 顶区密度是否可接受。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 三图高度 +20%）

**User（提示词/原意）**  
- **三张图片高度增加 20%**，**宽度等比**，**间距不变**。

**Assistant（实现前说明）**  
- **`ShowcaseTripleStack`** 的 **`shotHeight`** 三档 **`9.25 / 11.5 / 13.25 rem`** 各乘 **1.2 → 11.1 / 13.8 / 15.9 rem**；**`RatioScreenshot`** 已 **`object-contain` + `w-auto`**，宽度随比例变化；**`gap-1.5 sm:gap-2`** 不动。

**Assistant（实现后说明 / 本轮结论）**  
- 仅改 **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 三图与梯形是否仍对齐、窄屏是否换行正常。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 右栏下移 + 双梯形间距减半）

**User（提示词/原意）**  
- **三张图片和大梯形再下移一点**；**大小梯形间距保留现状的一半**。

**Assistant（实现前说明）**  
- 右栏 **`pt-10 sm:pt-14 lg:pt-[4.25rem]` → `pt-12 sm:pt-16 lg:pt-[5rem]`**，整块（三图 + 双梯形）下移；下层梯形 **`mt-6 sm:mt-8` → `mt-3 sm:mt-4`**（约为原一半）。

**Assistant（实现后说明 / 本轮结论）**  
- 仅改 **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 右栏垂直位置与两梯形间距。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 收紧三图与梯形间距）

**User（提示词/原意）**  
- **下移太多**；**大梯形与图片之间不需要留空隙**。

**Assistant（实现前说明）**  
- 撤销 **`ShowcaseTripleStack`** 父级 **`gap-8 sm:gap-10 lg:gap-12`**，改为 **`gap-0`**；梯形透视容器 **`pt-1` → `pt-0`**；保留 **`shrink-0`** 以免 flex 挤压。

**Assistant（实现后说明 / 本轮结论）**  
- 三图与上层梯形视觉紧贴（无刻意纵向间距）；验证 **`/showcase`** 右栏密度是否符合预期。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 梯形下移与三图分离）

**User（提示词/原意）**  
- **两套梯形下移**，须**整体在三张图片下方**、**不与图片重叠**。

**Assistant（实现前说明）**  
- **`ShowcaseTripleStack`** 原 **`mt-3 sm:mt-4`** 间距偏小，透视/投影易与上图视觉相交；改为父级 **`flex-col` + `gap-8 sm:gap-10 lg:gap-12`**，三图行与梯形块均 **`shrink-0`**；去掉梯形容器 **`mt-*`**，略减梯形顶 **`pt`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新 **`ShowcaseSlides.tsx`**；验证 **`/showcase`** 右栏宽屏与窄屏下三图与双层底座之间是否有清晰空隙。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 梯形填充变浅 + 双边框）

**User（提示词/原意）**  
- **两套梯形边框几乎看不见**；**把填充改浅**，在**深色背景**上更突出。

**Assistant（实现前说明）**  
- 原先 **`showcase-circuit-base` + Tailwind `shadow-[inset…]`** 会**整段覆盖 `box-shadow`**，inset 白边与底图对比度弱；计划新增专用类 **`.showcase-trapezoid-tier` / `--lower`**，在 **`globals.css`** 统一定义**更亮 slate 填充**、**2px+1px 双层白 inset** 与内暗角；**`ShowcaseSlides`** 两层梯形改挂新类并去掉长 shadow 工具类；下层遮罩 **`from-black/35` → `from-black/15`**，避免再压暗。

**Assistant（实现后说明 / 本轮结论）**  
- 已添加上述类并替换组件 class；验证：本地打开 **`/showcase`** 看右下双梯形**边缘与平面**是否清晰。残留：若仍觉边淡，可再提 **inset alpha** 或 **filter: drop-shadow**（注意与 clip-path 组合）。

**关联**  
- `vouchap-website/app/globals.css`、`vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 梯形白边框）

**User（提示词/原意）**  
- **两套梯形要加白色边框**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides`** 两层梯形 **`box-shadow inset`** 由青色描边改为 **`rgba(255,255,255,0.5–0.55)`** 1px，内光改为淡白。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 再下移、梯形间距与边框、去内横线）

**User（提示词/原意）**  
- **还要下移**；**两套梯形增加上下间距**；**梯形增加边框**；**去除中间两条横线**。

**Assistant（实现前说明）**  
- 右栏 **`pt`** 加大（**`pt-10 sm:pt-14 lg:pt-[4.25rem]`**）；下层梯形 **`mt-6 sm:mt-8`**（取代 **`-mt-1`**）；两层梯形用 **`box-shadow inset 1px`** 描边 + 淡内光；**删除**内侧 **`clip-path + border`** 装饰层（易产生横线段）；略减弱渐变。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 右列图 + 梯形整体下移）

**User（提示词/原意）**  
- **图片和两套梯形要下移**。

**Assistant（实现前说明）**  
- 右栏容器 **`justify-center` → `justify-start`**，并加 **`pt-6 sm:pt-9 lg:pt-11`**，使 **三图 + 双梯形**整体下移（避免居中抵消 margin）。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 透视可见化 + 三图留缝）

**User（提示词/原意）**  
- **网格透视效果没出来**；**三张图片留一点间距**（不应为 0）。

**Assistant（实现前说明）**  
- **`overflow-hidden` / 滚动层会破坏 `preserve-3d`**：海报壳改为 **`overflow-visible`**，内容列 **`overflow-visible`**；透视容器 **`perspective: 520px`**（原 1400 过弱）；上层 **`rotateX(22deg)`**、下层 **`rotateX(32deg)` + `translateZ(-12px)`**，加 **`transform-gpu`**、**`pb-8`** 留投影空间；三图 **`gap-1.5 sm:gap-2`**。

**Assistant（实现后说明 / 本轮结论）**  
- 圆角外若偶有像素溢出可再收紧或改用 **mask**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 恢复顶区 Vouchap + 网格区 logo 减半）

**User（提示词/原意）**  
- **顶部中间的 logo 要保留**；**网格区两套 logo / 名称减小一半**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：在 **header** 与 **主标题** 之间**恢复**居中 **Vouchap** 大图锁区；**梯形上层**：**Vouchap** 图 **`h` ~原一半**，字 **`clamp` ~一半**，**padding** 收紧；**梯形下层**：**partner-aimlink** **`h-5 / sm:h-6`**（约为原 **`h-10/12`** 的一半）。

**Assistant（实现后说明 / 本轮结论）**  
- 网格区内 **Vouchap** 不再 **`priority`**（顶区已占优先加载）。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 三图更密 + 双层梯形电路底座）

**User（提示词/原意）**  
- **右下角三张图间距再减小**；**aim.link 网格**做成**上宽下窄梯形**、**内层也梯形透视**；**上大下小两层梯形**，**上层 Vouchap+logo**，**下层 aim.link logo**。

**Assistant（实现前说明）**  
- **`ShowcaseTripleStack`**：三图行 **`gap-0`**；底座改为 **双层 `showcase-circuit-base`**，**`clip-path: polygon(…)`** 梯形，**`perspective` + `rotateX`** 透视；**内层**用 **`clip-path` 边框条** 做内梯形；**Vouchap** 从页中独立区移入**上层梯形**，页中**删除**重复锁区。

**Assistant（实现后说明 / 本轮结论）**  
- 小屏下层面 **`max-w-[64–70%]`** 更窄以体现「台基」；参数可再调百分比。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase logo 透明底、去白块、缓存穿透）

**User（提示词/原意）**  
- **logo 仍未更新**；**`public/logo.png` 四周透明**，**不需填充**。

**Assistant（实现前说明）**  
- 再次 **`cp`** **`assets/logo.png` → `vouchap-website/public/logo.png`**；**`ShowcaseSlides`** 去掉 **`bg-white` 圆角容器**，Logo 仅用 **`object-contain` + `h-* w-auto` + 轻 `drop-shadow`**；**`?v=VOUCHAP_LOGO_V`** 穿透缓存。

**Assistant（实现后说明 / 本轮结论）**  
- **`VOUCHAP_LOGO_V`**（当前 **`20260501b`**）更换 **`logo.png`** 后请顺手递增。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/public/logo.png`

### 2026-05-01（vouchap-website：Showcase 使用 `public/logo.png` 紫盾标）

**User（提示词/原意）**  
- **logo 用** `vouchap-website/public/logo.png`（用户提供的紫盾 **AI** 标）。

**Assistant（实现前说明）**  
- 将工作区内 **`…/assets/logo.png`** **覆盖写入** **`vouchap-website/public/logo.png`**；**`ShowcaseSlides`** 已引用 **`VOUCHAP_LOGO_MARK = "/logo.png"`**，无需改路径。

**Assistant（实现后说明 / 本轮结论）**  
- 全站 **`/logo.png`** 现为该文件；若需与旧站并存可另存 **`logo-legacy.png`** 再切引用（未做）。

**关联**  
- `vouchap-website/public/logo.png`、`vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 收紧顶留白 + Vouchap 紫标白底 + 字色）

**User（提示词/原意）**  
- **Vouchap 上方留白太多**；**青色渐变名称与金色 logo 不协调**；**logo 用网站紫色白底版**；**名称与 logo 配色匹配**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：`section` **`py`** 减小；内层改为 **`px/pb` + 更小 `pt`**，块间 **`gap`** 略收；**Vouchap** 使用 **`/logo.png`** 置于 **白底圆角容器**；**`showcase-aurora-text`** 改为 **`font-poppins` + 紫系渐变**（**`violet-200` → `#7c3aed`**）；常量改名为 **`VOUCHAP_LOGO_MARK`**。

**Assistant（实现后说明 / 本轮结论）**  
- 若需改用单独导出的 **紫底透明 PNG**，可只换 **`VOUCHAP_LOGO_MARK`** 路径。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 盾牌 logo、底座与图距、LinkedIn 二维码）

**User（提示词/原意）**  
- **Vouchap logo** 用网站**盾牌形**，不用最早那张图；**aim.link 网格底座放在图片下方**；**三图间距再减小一半**；海报右下角二维码链接 **LinkedIn**：`https://www.linkedin.com/in/james-aim-link/`。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：居中锁区改用 **`/logo3.png`**（常量 **`VOUCHAP_SHIELD_LOGO`**）；三图行 **`gap-1` / `lg:gap-1.5`**（约为原先一半）；**电路底座块**紧接在截图行下（**`mt-2`**），全宽 **`showcase-circuit-base`**；**`LinkedInQr`** 编码 **`SHOWCASE_QR_URL`**，文案 **LinkedIn profile**。

**Assistant（实现后说明 / 本轮结论）**  
- 若 **`logo3.png`** 非盾牌最终稿，可替换文件或改常量路径。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`、`public/logo3.png`

### 2026-05-01（vouchap-website：Showcase 海报密度 + 底座网格 + 顶栏与中轴 Vouchap）

**User（提示词/原意）**  
- **图片再加高**，**间距减小**；**aim.link 作为底座**此前的**网格保留**，要有**底座支撑**的视觉效果；**主 slogan 文字加大**；删除 **General collaboration primitives…** 一句；**顶行 aim.link logo 维持现状**；**Vouchap 及 logo 放大**放在**页面水平居中**；**右上角 Investor 去除**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：顶栏仅 **`partner-aimlink-dark`**；其下**居中**大号 **Vouchap** lockup；**`titleEn` clamp 加大**；删 **`subtitleSupport`** 与渲染；内层 **`gap`/`padding`/`py`** 收紧；**`RatioScreenshot` 行**增高 **`shotHeight`**、栏间距减小；**底座**恢复 **`showcase-circuit-base`** + 渐变衬「托起」感；右侧栈去掉重复的 **Vouchap** 小标题行。

**Assistant（实现后说明 / 本轮结论）**  
- **`Powered by aim.link…`** 单独保留为窄副标题带；**`Investor`** 已移除。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`、`app/globals.css`（沿用 `.showcase-circuit-base`）

### 2026-05-01（vouchap-website：Showcase 右侧恢复三层 + 等高三图 + 宽随宽高比）

**User（提示词/原意）**  
- **保持三层结构**；**aim.link 是底座**；**三张图片高度一致**；**宽度按图片宽高比**。

**Assistant（实现前说明）**  
- **`ShowcaseTripleStack`**：纵排 **① Vouchap**、**② 三图行**、**③ aim.link**（**`border-t`** 作底座区隔）；**`RatioScreenshot`** 用 **固定 `heightClass` + `Image` `width/height` 内联尺寸 + `max-h-full w-auto`**，宽随比例；**`intrinsicW/H`** 与 **`landingAssets`** 中 portal/cody 一致，collaboration 暂同 550×1024。

**Assistant（实现后说明 / 本轮结论）**  
- 已弃用 **`fill` 的 SoftShot** 等比实现；若 **collaboration** 源文件比例不同，可只改 **`SHOTS[0]` 的 intrinsic**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 右侧横排：Vouchap + 三图 + aim.link logo）

**User（提示词/原意）**  
- **图片按顺序水平一排摆放**；**Vouchap 及其 logo 还要保留**。

**Assistant（实现前说明）**  
- **`ShowcaseTripleStack`** 改为单行 **`flex-row`**：顺序 **Vouchap（`/logo.png` + 字）→ collaboration → portal → cody → aim.link（`/partner-aimlink-dark.png`）**；截图统一高度 **`stripH`**；窄屏 **`overflow-x-auto`** 保一排语义。

**Assistant（实现后说明 / 本轮结论）**  
- **`SoftShot`** 改为接收 **`className`**（含高度与 **`flex-1`**）；去掉纵向三层布局。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 右侧图放大、去掉图片标题）

**User（提示词/原意）**  
- **图片放大**；**不需图片的标题**。

**Assistant（实现前说明）**  
- **`ShowcaseTripleStack`**：提高 **`SoftShot` `min-h`**；去掉 **Collaboration / Portal / Cody / Infrastructure** 及首层 **Vouchap** 标题行；底层仅 **aim.link** logo（略加大 **`h-10` / `sm:h-12`**）。

**Assistant（实现后说明 / 本轮结论）**  
- 首层为单张 collaboration 全宽；**`sizes`** 略增；**`SoftShot`** 内边距略减以露更多画面。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 右侧恢复三层 + 无底框 aim.link OS + logo）

**User（提示词/原意）**  
- 右侧保持**此前的三层结构**；配图**不要套框**的 **aim.link OS**；**aim.link 换成 logo 图片**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：以 **`ShowcaseTripleStack`** 替换 **bento Collage**：自上而下 **① Vouchap + Collaboration**、**② Portal | Cody**、**③ aim.link**（**`/partner-aimlink-dark.png`**）；去掉 **`showcase-circuit-base` / “aim.link OS”** 底板；截图用 **`SoftShot`**（圆角 + 轻阴影，无 ring / 无底栏边框）。

**Assistant（实现后说明 / 本轮结论）**  
- 三层与 pillars 叙事一致；底层仅 logo + 小字 **Infrastructure**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 左列品牌加粗放大 + 右侧三图拼贴）

**User（提示词/原意）**  
- 左侧列出的 **aim.link** 和 **Vouchap** 要**加大加粗**；右侧要**美观摆放**多张界面截图：**portal、cody、collaboration** 三张图。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：pillars 渲染时对 **`name === "aim.link"` / `"Vouchap"`** 使用 **`font-extrabold` + clamp 字号**；移除原 **LegoStack**，新增 **`ShowcaseScreenshotCollage`**：**Collaboration** 大图占左 **`lg:col-span-7`** **`row-span-2`**，**Portal / Cody** 叠放在右 **`lg:col-span-5`** 两行；小屏 Collaboration **`sm:col-span-2`** 通栏，其下两列 Portal | Cody；**`CollageTile`** 统一圆角、细边框、底栏标签、Collaboration 加强 **`ring`**。

**Assistant（实现后说明 / 本轮结论）**  
- 资源：`web_tax_collaboration.png`、`web_secure_portal_invite.png`、`web_cody_assistant.png`；**`Image`** 区域 **`relative` + `fill`** + **`object-contain`**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 再次去除中文 — 仅英文）

**User（提示词/原意）**  
- **不要中文**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：删除 **titleZh / subtitleZh** 与中文段落；副标题用 **`subtitleLead` + `subtitleSupport`** 两句英文承载原「智能底座 → 税务生产力」语义。

**Assistant（实现后说明 / 本轮结论）**  
- 海报对外文案均为英文；**aim.link** 仍为小写。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 海报文案 — 落地与价值 + aim.link 全小写）

**User（提示词/原意）**  
- **聚焦落地与价值**：主标题 **AI Implementation: Solving the Last Mile of Tax Coordination** / **AI 落地：重构税务协同「最后一公里」**；副标题 **Powered by aim.link — The Intelligent Collaborative Infrastructure** / 中文支撑句；**aim.link 文字全部小写**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：用主标题（英+中）、副标题（英+中）替换原 slogan + 旧主标题；**Foundation** 名称与 Lego 底座 **`aim.link OS`** 统一小写品牌（**OS** 保持大写）；去除顶部独立 **Build Once** 行以免抢占层级。

**Assistant（实现后说明 / 本轮结论）**  
- 副标题区增加浅分隔（上下 border）；**metadata** 中品牌改为 **aim.link**。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/app/showcase/page.tsx`

### 2026-05-01（vouchap-website：Showcase 去除中文 — 仅英文文案）

**User（提示词/原意）**  
- **去除所有中文文案**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：删除 slogan / 主标题 / 三部曲之 **Zh** 字段与渲染；**pillars** 仅保留 **phaseEn + name + lineEn**（**lineEn** 略写一句补足原双语信息量）。

**Assistant（实现后说明 / 本轮结论）**  
- 海报与用户可见字符串均为英文；**`app/showcase/page.tsx`** metadata 去掉「bilingual」表述。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/app/showcase/page.tsx`

### 2026-05-01（vouchap-website：Showcase「Power & Implementation」双核海报重做）

**User（提示词/原意）**  
- 海报方案 **Dual-Core**：**深邃底漆 Navy + 极光绿 / 科技蓝**；**由下至上阶梯**：底部 **Aim.Link** 厚实底座（半透明电路纹）、上方悬浮 **Vouchap** 轻盈界面；**大量留白**。  
- **文案中英文对照**：主标题 From Infrastructure… / 从底层底座…；**三部曲** Foundation(Aim.Link)、Application(Vouchap)、Innovation(Last Mile)；**底部 TAM** $175.8B+，USA | Canada 分列；(Reliable data…)  
- **视觉**：中心 **Lego 积木**示意，底层发光 **Aim.Link OS**、顶层 **Vouchap**；**Slogan**「Build Once, Implement Everywhere. / 一次构建，随处落地」最显眼；**右下角二维码**「Get the Full Whitepaper」。

**Assistant（实现前说明）**  
- **重写** **`ShowcaseSlides.tsx`**：去掉原 A–D 四屏，改为**单张 16:9** 海报；**`globals.css`** 增加 **`showcase-dualcore-bg` / `showcase-circuit-base` / `showcase-aurora-text`**。  
- **`showcase/page.tsx`**：页底色与 header 对齐 Deep Navy；metadata 更新。  
- QR：**未新增 npm 依赖**（环境 npm 权限失败），使用 **`api.qrserver.com`** 生成图 + `<img>`；目标 URL **`NEXT_PUBLIC_WHITEPAPER_URL`** 缺省 **`https://vouchap.com`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已落地阶梯 Lego 区（上 **Vouchap** 卡片含产品截图、下 **Aim.Link OS** 电路底）；全稿中英对照；底部 TAM 与右下角 Whitepaper 文案。  
- **`npm run lint`** 触发了 Next **交互式 ESLint 初始化**（仓库无现成 `.eslintrc`），未完成自动化 lint。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/app/globals.css`、`vouchap-website/app/showcase/page.tsx`

### 2026-05-01（vouchap-website：Showcase 主标题三句三行 + 更顺口英文）

**User（提示词/原意）**  
- 原英文主文案拟得更**朗朗上口**；**三句分三行**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：将 **`MERGED.head`** 改为 **`headLines`** 三句；新增 **`HeadlineBlock`** 用 **`span.block`** 分行；**CopyBlock** 与 **Poster D** 共用。

**Assistant（实现后说明 / 本轮结论）**  
- 三行文案：**aim.link 协作底座 → Vouchap 门户+CRM → 最后一公里 AI**；紧凑模式略收紧字号与行距。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 叙事 — aim.link 底座 / Vouchap 垂直 + TAM 仅美加两数）

**User（提示词/原意）**  
- **市场规模**只需列 **145.5B + 30.3B** 两个数字。  
- **体现**：**aim.link** 是**协同工作平台**；**Vouchap** 是基于 aim.link 的 **AI 税务协同 portal**、**firm 的 CRM**，用 **AI** 服务税务协同**最后一公里**；**总可触达市场规模** **145.5B + 30.3B**。

**Assistant（实现前说明）**  
- 更新 **`ShowcaseSlides.tsx`** 中 **`MERGED.head` / `MERGED.sub`**（英文）；**`StatsInline`** 仅保留 **United States $145.5B** 与 **Canada $30.3B CAD**；**Variant B** 芯片标签改为 **aim.link platform / AI tax portal / Firm CRM**，去掉 **$160B+ NA**。

**Assistant（实现后说明 / 本轮结论）**  
- 已按上落地；与全站 **`npm run build`** 的 **`/privacy`** 缺失问题无新增耦合。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 去「层层套框」— 轻渐变海报 + 截图单一阴影）

**User（提示词/原意）**  
- **视觉效果都很差**，**层层套框毫无美感**。

**Assistant（实现前说明）**  
- 与既有 **`globals.css`** 中 **`showcase-hero-title` / `showcase-tagline` / `showcase-lede`** 对齐，**不再使用**已移除的 **`showcase-hero-panel`**。  
- 重写 **`ShowcaseSlides.tsx`**：**SlideCanvas** 用大圆角渐变底 + 单层柔和投影（无粗边框）；**Screen / MiniScreen / Mosaic** 仅保留 **圆角 + 一层阴影**，**图注在图下方**小字；**Stat** 改为行内排版；**Variant D** 标题区为纯文字块，无套框。

**Assistant（实现后说明 / 本轮结论）**  
- 已落地上述结构；**`next build`** 在 **Compile / Lint / TS** 阶段通过，但在 **collect page data** 因项目内 **`/privacy` 页面模块缺失**失败（与本次 Showcase 改动无关）。本地 **`/showcase`** 建议人工核对四屏比例与限高。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/app/globals.css`

### 2026-05-01（vouchap-website：Showcase Variant A Insights 撑满屏 — 图片带限高）

**User（提示词/原意）**  
- **Insight 图片满屏**，其他内容都看不到。

**Assistant（实现前说明）**  
- 根因：Variant **A** 底部三图容器使用 **`flex-1`**，`next/image` **`fill`** 随弹性行增高，**Insights** 列占宽最大，视觉上占满屏。  
- 拟去掉该行 **`flex-1`**，改为 **`shrink-0` + 固定 `clamp` 高度**；**Banner / Stat** 包 **`shrink-0`**；**Shot** 加 **`h-full min-h-0`**。Variant **C** 双图区同样去掉无界 **`flex-1`** 并限高。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`ShowcaseSlides.tsx`**；**`npm run build`** 通过。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Showcase 合并主题为一张 · 四构图版本 A–D）

**User（提示词/原意）**  
- 前述**两个内容重点合并在一张**，出**三四个版本**。**文字精简**，**图片需密切联系内容主题**。

**Assistant（实现前说明）**  
- **`ShowcaseSlides.tsx`**：共用常量 **`MERGED.head` / `MERGED.sub`**（一句标题 + 一句副文案）；**四屏 scroll-snap**，构图分别为：**A** 数据条 + Insights / Collaboration / Expenses（TAM+AI 证据）；**B** 左文案+芯片 + 大 engagement + 底栏 CRM·Portal·Catalog·Marketplace；**C** 双大 AI 屏 + 底四格迷你数据；**D** 顶精简标题 + **2×2** 四宫格（协作/意图/需求侧/规模化）。  
- 更新 **`app/showcase/page.tsx`** metadata。

**Assistant（实现后说明 / 本轮结论）**  
- 已实现；**`npm run build`** 通过。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/app/showcase/page.tsx`

### 2026-05-01（vouchap-website：Showcase 重做 — 仅两幅海报：底座协作 vs AI+市场）

**User（提示词/原意）**  
- Showcase **越做越差**，需兼顾**构图与主题**；**必要时多张图**。集中精力：**①** 基于 **aim.link** 基础架构，**Vouchap** 垂直用于 **firm 与 client** 协作落地；**②** **AI** 服务最后一公里，**税务服务市场规模**很大。

**Assistant（实现前说明）**  
- 将 **`ShowcaseSlides.tsx`** 从五屏收束为 **两幅 16:9 海报**（scroll-snap）。  
- **Poster 1**：左栏文案（aim.link 底座 → Vouchap 税务垂直、低边际、双方便利）+ 右栏 **1 大 3 小** 构图：主图 **engagement**，三缩略 **Clients / Portal / Service catalog** 并加短标注。  
- **Poster 2**：**AI 最后一公里** 与 **TAM 数据**同屏：上段主文案、**四格数据**、下 **双图**（tax collaboration + expenses）+ 图注。  
- 更新 **`app/showcase/page.tsx`** metadata。

**Assistant（实现后说明 / 本轮结论）**  
- 已替换实现；**`npm run build`** 通过。

**关联**  
- `vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/app/showcase/page.tsx`

### 2026-05-01（vouchap-website：营销截图「发糊」—`unoptimized` + `images.deviceSizes`）

**User（提示词/原意）**  
- 提供的图片分辨率很高，**为何网站上全是模糊的**？

**Assistant（实现前说明）**  
- 根因通常有三：**①** Next.js `Image` 默认经 Sharp 缩图并转 WebP（`quality` 默认 75），细文字易糊；**②** 仓库内 `web_*.png` 曾测得约 **1024px 宽**，在 **2× Retina** 上铺满栏宽时像素不足；**③** `sizes` 过小会拉更小的衍生图。  
- 拟新增 **`lib/screenshotImage.ts`**（`unoptimized: true`）供 **Hero / Firm invite / Tax pains / Marketplace / Showcase 配图** 使用，**跳过优化管线**直出 `public` PNG；**`next.config.mjs`** 放宽 **`images.deviceSizes`**。并在日志中说明：若需极锐，**源图需约 2× 展示 CSS 宽度**（如 1920–2400px 宽）并覆盖 `public` 文件。

**Assistant（实现后说明 / 本轮结论）**  
- 已落地；**`npm run build`** 通过。

**关联**  
- `vouchap-website/lib/screenshotImage.ts`、`next.config.mjs`、`components/Hero.tsx`、`FirmInviteHighlight.tsx`、`TaxPainSolutions.tsx`、`ServiceMarketplaceHighlight.tsx`、`ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Hero / Firm invite 用新 Portal 主图 + Cody 副图，清理旧 landing 图）

**User（提示词/原意）**  
- 网站**主图仍用**新的 **Secure Portal** 截图；**此前旧图清理掉**。  
- 「**A branded, secure landing page every time you invite a client**」模块：**主图**用新截的 **portal**，**副图**用 **Cody**。

**Assistant（实现前说明）**  
- 将 portal 存为 **`web_secure_portal_invite.png`**，**`landingAssets`** 以 **`webSecurePortalInvite`** 暴露；**Hero** 与 **FirmInviteHighlight** 主卡均用该资源；Firm invite 副卡保持 **`webCodyAssistant`**。  
- **`ASSET_V`** 递增至 **`20260502`**。删除不再引用的 **legacy** `vouchap_landing_assets` 下旧 PNG 及根目录 **`dashboard.png`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已移除 **`client_auto_invite`**、**`secure_portal_invitation`** 等共 **9** 个旧资源文件 + **`public/dashboard.png`**。  
- **`npm run build`** 通过。

**关联**  
- `vouchap-website/lib/landingAssets.ts`、`components/Hero.tsx`、`components/FirmInviteHighlight.tsx`、`public/vouchap_landing_assets/web_secure_portal_invite.png`

### 2026-05-01（vouchap-website：全站 Web 截图换新 + Showcase 同步，`object-contain`）

**User（提示词/原意）**  
- 重新截取软件截图，**按主题替换**网站上现有 **Web 端**截图；**尽量不裁剪、不拉伸**。**Showcase** 也用新图。

**Assistant（实现前说明）**  
- 将用户提供的 8 张图复制到 **`public/vouchap_landing_assets/`**，统一命名为 **`web_*.png`**；**`lib/landingAssets.ts`** 用 **`ASSET_V=20260501`** 做缓存穿透；Hero / Firm invite 扇形卡 / Tax pains / Marketplace 模块 / Showcase 全部改引用。  
- Showcase **`SlideFigure`** 默认 **`object-contain`** + 深色 letterbox，避免裁切。

**Assistant（实现后说明 / 本轮结论）**  
- 映射：**Expenses**→收据痛点；**Tax collaboration**→协同/任务+Tina；**Firm clients**→CRM 列表+Cody；**Insights**→全局洞察；**Engagement**→共享 engagement；**Service catalog**→firm 发布模板；**Tax filing marketplace**→客户端集市；**Cody**→邀请区副卡。Hero 主图改为 **Firm clients**；原 invite 落地长图引用已移除。  
- **`npm run build`** 通过。

**关联**  
- `vouchap-website/public/vouchap_landing_assets/web_*.png`、`lib/landingAssets.ts`、`Hero.tsx`、`FirmInviteHighlight.tsx`、`TaxPainSolutions.tsx`、`ServiceMarketplaceHighlight.tsx`、`ShowcaseSlides.tsx`

### 2026-05-01（vouchap-website：Marketplace 截图 / 首页模块 / Showcase 全幅独立海报字阶）

**User（提示词/原意）**  
- **Marketplace** 用用户提供的 **Service Marketplace** 实机截图；**网站首页**增加同主题模块。  
- Showcase 仍不够友好；场景为 **10 秒轮播**、文字要更突出；只向主办方交 **2–3 幅**、**可能只采用一页**—**每一页都要完整设计**。

**Assistant（实现前说明）**  
- 将截图保存为 **`public/vouchap_landing_assets/service_marketplace.png`**；新增 **`ServiceMarketplaceHighlight`**（`/#marketplace`，CTA 指向 **`platform…/tax-filing/service-catalog`**）。  
- Showcase：**去掉分列弱视觉**，改为统一 **「顶部 aim.link + Vouchap + chip｜中间 showcase-hero-panel 超大标题 + 单行 tagline｜底部整幅配图 flex-1」**；**globals** 增加 **`showcase-hero-panel` / `showcase-hero-title` / `showcase-tagline`**；Marketplace 屏配图 **`object-contain`**；页脚说明「任选 2–3 屏」。

**Assistant（实现后说明 / 本轮结论）**  
- 已实现并 **`npm run build`** 通过。  
- **Navbar** 增加 **Marketplace** 锚点链接。

**关联**  
- `vouchap-website/public/vouchap_landing_assets/service_marketplace.png`、`vouchap-website/components/ServiceMarketplaceHighlight.tsx`、`vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/app/globals.css`、`vouchap-website/app/page.tsx`、`vouchap-website/components/Navbar.tsx`

### 2026-05-01（vouchap-website：Showcase 配图 / 可读性 / 去掉底部四格 / marketplace 屏）

**User（提示词/原意）**  
- 每一幅增加**必要配图**（从网站现有资源选取）；**文字可读性更好**（主办方 PPT 上轮播，每家 **10 秒**）；**不需要底部页签**（即移除 InvestorQuad）；再增加宣传点：**tax filing marketplace**—firm 发布服务模板，吸引 client **直接下单报税服务**。

**Assistant（实现前说明）**  
- 拟用 `public/vouchap_landing_assets/*.png` 与 `dashboard.png` 等与各屏语义对齐；在 **`globals.css`** 增加 **`.showcase-*`** 对比面板与字重阴影类；**重写 `ShowcaseSlides.tsx`**：左/右图文分栏、删 **`InvestorQuad`**、精简英文文案；**新增第 5 屏** marketplace（`secure_portal_invitation.png` 贴合品牌化获客闭环）。

**Assistant（实现后说明 / 本轮结论）**  
- 已实现上述：**五屏**（CRM / AI / Market / aim.link / Marketplace）；配图分别为 firm client detail、client tasks、dashboard、shared tax todo、portal invitation；可读性靠半透明 **`showcase-text-panel`** + **`showcase-title`/`showcase-body` 阴影**与更大字号；底部四格已移除；元数据 description 已更新。

**验证建议**  
- `npm run dev` 打开 **`/showcase`**，全屏模拟 **1920×1080** 远距可读性；轮播计时自行对齐 **10s/屏**。

**关联**  
- `vouchap-website/app/globals.css`、`vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/app/showcase/page.tsx`

### 2026-05-01（vouchap-website：投资人 Showcase 多幅 16:9 海报页）

**User（提示词/原意）**  
- 在 **vouchap-website** 增加 **Showcase** 页面；面向天使投资人；每幅按 **1920×1080** 海报基准、多幅 **向下步进滚动**；各幅需覆盖：①税务 firm 与 client 协同 CRM；② AI 解决报税协同最后一公里（业务意图，非仅识别）；③ 北美税务市场规模（从根目录 **Vouchap BP2.5.5-202603** 取数）；④ Vouchap 为 **aim.link** 垂直落地、统一底座、垂直研发边际成本低；主品牌 **aim.link**，内容侧重 Vouchap；投资人视角文案；**UI 英文**。

**Assistant（实现前说明）**  
- 在 **`/Users/macbook/vouchap-website`** 新增 **`app/showcase/page.tsx`**（元数据 + 顶栏含 aim.link 标）与 **`components/ShowcaseSlides.tsx`**（`scroll-snap` 四屏，内层 **`aspect-ratio: 16/9`** 画布随视口缩放，等价 1920×1080 设计基准）。  
- 从 BP 文档（`textutil` 转 TXT）摘录：**北美合规约 $160B+**、**美国约 $145.5B / ~157K firms**、**加拿大 2024 约 $30.3B CAD / 30,427 firms**、**加拿大微所占比 74.6%（少于 5 人）** 等用于第三屏。  
- 导航 **`components/Navbar.tsx`** 增加 **Showcase** 链接。

**Assistant（实现后说明 / 本轮结论）**  
- 已落地上述文件与导航；四屏分别以 CRM、AI 意图、市场规模、aim.link 平台为视觉中心，底部 **InvestorQuad** 四格在每屏重复四个主题（高亮随屏变化）。  
- **`npm run build`** 阶段 **编译与类型检查通过**；收集 page data 时出现 **`/_document` PageNotFoundError**（疑为环境/既有 Next 配置问题，非本页独有语法错误）。

**验证建议**  
- 本地 **`cd vouchap-website && npm run web`**（或 `npm run dev`）打开 **`/showcase`**，竖向滚动确认 snap 与 16:9 画布；导出 PNG 时可用浏览器全屏 1920×1080 截屏每帧。

**关联**  
- `vouchap-website/app/showcase/page.tsx`、`vouchap-website/components/ShowcaseSlides.tsx`、`vouchap-website/components/Navbar.tsx`；市场数字出处：仓库根 **`Vouchap BP2.5.5-202603.docx`**（执行摘要 / 第 2 章）。

### 2026-05-01（Vouchap：`20260501120000` 移除 storage.objects 上 COMMENT ON POLICY）

**User（提示词/原意）**  
- `db push` 应用 `20260501120000_storage_tax_filing_scoped_policies.sql` 报错：`must be owner of relation objects (42501)`，停在 `COMMENT ON POLICY ... ON storage.objects`。

**Assistant（实现前说明）**  
- 托管 Supabase 上 **`storage.objects`** 属系统侧；迁移所用角色通常不是 owner，**`COMMENT ON POLICY`** 会触发 42501。策略 DDL 本身一般可执行。  
- 拟删除该迁移文件末尾的 **`COMMENT ON POLICY`**，说明改写入文件头注释。

**Assistant（实现后说明 / 本轮结论）**  
- 已编辑 **`20260501120000_storage_tax_filing_scoped_policies.sql`**：去掉对 `storage.objects` 策略的 COMMENT，并加 NOTE。  

**验证建议**  
- 若上次 push **整文件在单事务内回滚**，直接再次 **`supabase db push`**。若曾部分提交（少见），需在 Dashboard SQL 核对 `storage.objects` 上 `tax-filing` 策略后再决定是否手工补跑。

**关联**  
- `vouchap-app/supabase/migrations/20260501120000_storage_tax_filing_scoped_policies.sql`

### 2026-05-01（Vouchap：拆分重复迁移版本 `20250313330000` 以消除 db push 歧义）

**User（提示词/原意）**  
- `db push` 仍要求 `--include-all`，且仅列出 `20250313330000_invitee_clients_single_email_and_clients_space_id.sql`。

**Assistant（实现前说明）**  
- 根因：同一目录下曾存在 **两个** `20250313330000_*.sql`，`schema_migrations.version` 只能对应一行，CLI 无法与两条本地文件对齐。  
- 拟将较小且无顺序依赖的 **`drop_firm_projects_project_todos`** 重命名为 **`20250313330001_...`**（紧接在 invitee 迁移之后）。

**Assistant（实现后说明 / 本轮结论）**  
- 已重命名：`20250313330000_drop_firm_projects_project_todos.sql` → **`20250313330001_drop_firm_projects_project_todos.sql`**（内容未改，仍为 `DROP TABLE IF EXISTS`）。  
- 更新 **`scripts/backfill-remote-migration-history.sh`** 注释。  

**验证建议**  
- 再次 **`supabase db push`**；若远程曾只 repair 过 `20250313330000` 一次，可再对 **`20250313330001`** 执行 **`migration repair --status applied`** 或让 push 执行该条（`IF EXISTS` 安全）。

**关联**  
- `vouchap-app/supabase/migrations/20250313330001_drop_firm_projects_project_todos.sql`

### 2026-05-01（Vouchap：`db push` 提示 include-all — 历史迁移与 remote_schema 时序）

**User（提示词/原意）**  
- 终端：`Found local migration files to be inserted before the last migration on remote database`，要求使用 `--include-all`。

**Assistant（实现前说明）**  
- 含义：远程 **`schema_migrations` 仅登记了较晚的基线**（如 `20260109040027`），本地大量更早版本在远程表中缺失；CLI 拒绝默认 push。**勿**在生产库上对已有对象盲跑 `--include-all`（会重放 DDL，易 `already exists`）。  
- 拟新增脚本：对链接项目批量 **`supabase migration repair --status applied <version>`**（只补历史表、不执行迁移 SQL），并 **跳过** 仍待真实执行的版本（当前为 **`20260501120000`**）。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 **`vouchap-app/scripts/backfill-remote-migration-history.sh`**：默认 dry-run 打印 repair 命令；**`--execute`** 执行。内置跳过 `20260109040027` 与待推送的 `20260501120000`；注释说明 **`20250313330000`** 两文件共版号。  
- 流程建议：先 dry-run → 再 `--execute` → 最后 **`supabase db push`**（应仅剩未登记的新迁移）。  

**关联**  
- `vouchap-app/scripts/backfill-remote-migration-history.sh`

### 2026-05-01（Vouchap：补齐远程 `remote_schema` 迁移记录以修复 db push）

**User（提示词/原意）**  
- 提供 `schema_migrations` 查询结果：`version = 20260109040027`，`statements = null`，`name = remote_schema`。

**Assistant（实现前说明）**  
- 判定为 **`supabase db pull`（或同类基线）**在远程写入的历史行，本地缺少同版本 `.sql` 导致 `db push` 报 “Remote migration versions not found in local migrations directory”。拟在本地新增 **`20260109040027_remote_schema.sql`**，内容为无实际 DDL 的占位（`SELECT 1`），与远程已登记版本对齐。

**Assistant（实现后说明 / 本轮结论）**  
- 已新增 **`vouchap-app/supabase/migrations/20260109040027_remote_schema.sql`**。远程已存在该 version 时 **`db push` 不应重复执行**；若在新库从零应用迁移链，该文件为无害占位。  

**验证建议**  
- 在 `vouchap-app` 下执行 `supabase migration list` / `supabase db push`，确认不再因缺版本失败。  

**残留风险**  
- 若远程库 **`schema_migrations` 与真实 DDL 严重不一致**（仅一条 remote_schema 但库已含大量对象），后续 push 仍可能对「未登记」的旧迁移报错或冲突，需结合 `migration list` 全表排查。

**关联**  
- `vouchap-app/supabase/migrations/20260109040027_remote_schema.sql`

### 2026-05-01（Vouchap：安全整改 — Edge 鉴权、tax-filing 存储、日志与预览 XSS）

**User（提示词/原意）**  
- 「列 todo，逐项立即整改。」（承接前序安全审计：Gemini 代理、邀请邮件、存储公读、敏感日志、表格预览等。）

**Assistant（实现前说明）**  
- 计划：① `gemini-proxy` 网关 `verify_jwt=true`，函数内 `getUser` 二次校验；可选 CORS 白名单环境变量；禁止向客户端返回 Google listModels 原始错误体。② `send-invitation-email` 改为 `verify_jwt=true`，用 service role 校验 `space_invitations` 与 inviter 后再 `inviteUserByEmail`；客户端 body 增加 `invitationId`。③ 新迁移收紧 `tax-filing` 桶 RLS（去掉 `public` SELECT，按路径首段 `client_space_id` + `user_spaces` / `firm.can_access_client`）；上传函数禁止空 `clientSpaceId`。④ `gemini.ts` / `auth/confirm.tsx` 脱敏日志；⑤ `office-inline-preview` 对 SheetJS 输出做脚本/事件剥离。⑥ 更新 README 与溯源。

**Assistant（实现后说明 / 本轮结论）**  
- **`supabase/config.toml`**：`gemini-proxy`、`send-invitation-email` 均 **`verify_jwt = true`**。  
- **`gemini-proxy/index.ts`**：`requireAuthenticatedUser`；`GEMINI_PROXY_ALLOWED_ORIGINS`；错误响应不附带 Google 响应 body；同源校验对带 `Origin` 的跨站请求生效。  
- **`send-invitation-email/index.ts`**：同上 CORS 策略（`INVITE_EMAIL_ALLOWED_ORIGINS`）；校验邀请行与 inviter / email / `pending`；`isExistingUser` 仍短路不发邮件。  
- **`space-invitations.ts`**：`invoke` body 增加 **`invitationId`**。  
- **新迁移 `20260501120000_storage_tax_filing_scoped_policies.sql`**：删除 `tax_filing_public_select`，读写删选均按文件夹与成员/事务所权限收紧。**部署后**建议在 Dashboard 将 **`tax-filing` 桶改为 Private**（迁移注释已说明）。  
- **`supabase.ts`**：`uploadTaxFilingFile` / `uploadTaxFilingFileBytes` 无 `clientSpaceId` 时抛错；税表上传成功日志仅在 dev。  
- **`gemini.ts`**：`geminiDevLog` 包裹原 `console.log`，避免生产打印 URL/解析内容。  
- **`auth/confirm.tsx`**：`authConfirmDevLog`，不再打印含 token 的完整 URL。  
- **`office-inline-preview.ts`**：`sanitizePreviewTableHtml`。  
- 新增 **`supabase/functions/gemini-proxy/README.md`**；更新 **`send-invitation-email/README.md`**。  

**验证建议**  
- 部署两枚 Edge Functions 后：匿名/无效 JWT 应 401；邀请邮件仅合法 inviter 可发。  
- 执行迁移后：匿名应无法 SELECT `tax-filing`；成员与 firm 可读路径需与业务一致；将桶改为 Private 后验证 `getTaxFilingViewUrl` 签名打开。  

**残留风险**  
- 未实现按用户 Gemini **配额/限流**（仍依赖后续产品策略）。  
- `marketplace` 存储仍为 public SELECT（本次未改）。  
- Sheet 预览消毒为规则型，非完整 HTML 消毒器。

**关联**  
- `vouchap-app/supabase/functions/gemini-proxy/index.ts`  
- `vouchap-app/supabase/functions/send-invitation-email/index.ts`  
- `vouchap-app/supabase/config.toml`  
- `vouchap-app/supabase/migrations/20260501120000_storage_tax_filing_scoped_policies.sql`  
- `vouchap-app/src/shared-logic/space-invitations.ts`、`supabase.ts`、`gemini.ts`  
- `vouchap-app/src/mobile-ui/app/auth/confirm.tsx`  
- `vouchap-app/src/shared-logic/office-inline-preview.ts`

### 2026-05-01（aim.link-v2：Web 顶栏通知 icon 与相邻 icon 对齐）

**User（提示词/原意）**  
- icon 的位置没有跟旁边的 icon 对齐。

**Assistant（实现前说明，若有）**  
- 对照 **`AppNavHeader`**：铃铛包在 **`Badge`** 内且 **`fontSize: 18`**，相邻 Help/Settings 为 **16px** 裸图标；**`.ant-badge`** 为 **`inline-block`**，在 **`inline-flex`** 的 **24×24** 按钮内可能产生与直接 **`anticon`** 不同的视觉中心。

**Assistant（实现后说明 / 本轮结论）**  
- **`BellOutlined`** 改为 **16px**；**`.aimlink-header-icon-btn .ant-badge`** 改为 **`inline-flex`** + **`align-items/justify-content: center`**（**不**将 **Badge** 铺满 **24×24**，避免未读角标锚到按钮角而远离铃铛）。已追加 **aim.link-v2** **`PROMPTS-LOG`** / **`PRD`** 变更记录。

**关联**  
- `/Users/macbook/aim.link-v2/apps/web/src/components/app-chrome/AppNavHeader.tsx`  
- `/Users/macbook/aim.link-v2/apps/web/src/styles/aimlink-web-app-shell.scss`

### 2026-05-01（aim.link-v2：Web 顶栏通知 icon 与设置同色）

**User（提示词/原意）**  
- Web 端顶栏的通知 icon，颜色应改为和旁边的设置 icon 一样的浅色。

**Assistant（实现前说明，若有）**  
- 对照 **`AppNavHeader`** 与 **`aimlink-web-app-shell.scss`**：Help / Settings 为裸 **`anticon`**，消息为 **`Badge`** 包 **`BellOutlined`**；怀疑 **`.ant-badge`** 默认字色覆盖顶栏继承色。

**Assistant（实现后说明 / 本轮结论）**  
- 根因：**antd** **`.ant-badge`** 默认 **`color: rgba(0, 0, 0, 0.85)`**。在 **`aimlink-web-app-shell.scss`** 为 **`.aimlink-header-icon-btn .ant-badge`** 与内部 **`.anticon`** 增加 **`color: inherit`**（并 **`font-size` / `line-height: inherit`**），铃铛与相邻设置/帮助一致继承导航浅色。  
- **aim.link-v2** 侧已同步 **`docs/PROMPTS-LOG.md`** 与 **`docs/PRD.md`** 变更记录。验证：登录后 **`/app/*`** 顶栏对比消息与设置图标色。

**关联**  
- `/Users/macbook/aim.link-v2/apps/web/src/styles/aimlink-web-app-shell.scss`  
- `/Users/macbook/aim.link-v2/docs/PROMPTS-LOG.md` · `/Users/macbook/aim.link-v2/docs/PRD.md`

### 2026-05-01（Vouchap：Gemini 调用下沉 Supabase，移除 Expo/Web 对 AI Key 依赖）

**User（提示词/原意）**  
- “按你的设计方案执行修改。expo 上构建 app，cloudflare 上部署 web，最好更换模型时不需重新构建，统一在 supabase 一套调用。”

**Assistant（实现前说明，若有）**  
- 采用最小侵入改造：保留现有 `gemini.ts`/报税识别业务流程与模型重试逻辑，新增与 `GoogleGenerativeAI` 接口兼容的客户端代理层，把真实 Gemini 调用迁移到 Supabase Edge Function。  
- 计划触达文件：`src/shared-logic/gemini*.ts`、`src/shared-logic/tax-filing-*.ts`、`supabase/functions/` 与 `app.config.js`；目标是客户端不再携带真实 AI Key，模型默认值与切换策略可在 Supabase 环境变量调整。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `supabase/functions/gemini-proxy/index.ts`：服务端统一处理 `generateContent` 与 `listModels`，真实密钥仅从 `GEMINI_API_KEY` 读取；新增 `GEMINI_MODEL_DEFAULT` 与 `GEMINI_ENFORCE_SERVER_MODEL` 以支持服务端模型切换。  
- 新增 `src/shared-logic/gemini-server-sdk.ts`：提供兼容 `GoogleGenerativeAI` 的代理实现，内部通过 `supabase.functions.invoke('gemini-proxy')` 调用，避免重写大量既有业务代码。  
- 已将 `tax-filing-recognition-run.ts`、`tax-filing-task-matcher.ts`、`gemini.ts`、`gemini-helper.ts` 切换为代理调用；`app.config.js` 中 `extra.geminiApiKey` 改为非敏感占位标识 `server-side-gemini-proxy`，不再依赖 `EXPO_PUBLIC_GEMINI_API_KEY`。  
- `ReadLints` 对本次变更文件检查通过（无新增 lint 错误）。部署后仅需在 Supabase Functions 侧更新环境变量与函数版本即可完成 key/模型切换，无需重新构建 Expo App 或 Cloudflare Web 前端。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/supabase/functions/gemini-proxy/index.ts`  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/gemini-server-sdk.ts`  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/gemini-helper.ts`  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/gemini.ts`  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/tax-filing-recognition-run.ts`  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/tax-filing-task-matcher.ts`  
- `/Users/macbook/Vouchap/vouchap-app/app.config.js`

### 2026-04-30（aim.link：排查 GCP 部署 YAML 配置）

**User（提示词/原意）**  
- “给我找一下aim.link的各个项目中有没有用于GCP部署用的yaml文件”。

**Assistant（实现前说明，若有）**  
- 对 `aim.link`、`aim.link-v2`、`aim-link-website` 及 `Project-map` 进行 YAML 全量检索（`*.yml`/`*.yaml`）并补充按常见 GCP 部署命名（如 `cloudbuild.yaml`、`app.yaml`）二次筛查，确认是否存在可直接用于 GCP 部署的配置文件。

**Assistant（实现后说明 / 本轮结论）**  
- 检索结果：上述项目均未发现任何 `.yml/.yaml` 文件，也未发现 `cloudbuild.yaml`、`app.yaml`、`skaffold.yaml` 或名称含 `gcp` 的 YAML 配置。  
- 结论：当前这些 aim.link 相关项目内，不存在可识别的 GCP 部署 YAML 文件。

**关联**  
- `/Users/macbook/aim.link`  
- `/Users/macbook/aim.link-v2`  
- `/Users/macbook/aim-link-website`  
- `/Users/macbook/Project-map`

### 2026-04-30（aim.link v2：任务表列序/显隐项目级持久化）

**User（提示词/原意）**  
- 列序和显隐需要保存，项目级统一并让项目成员一致。

**Assistant（实现前）**  
- 给 DataTable 增加受控布局输入/回调，在项目页读取与写回 `projects.project_rules`，实现成员共享。

**Assistant（实现后说明）**  
- `DataTable` 已支持 `columnLayout` / `onColumnLayoutChange`。  
- `ProjectDetailPage` 加入 `task_table_layout` 读取与防抖保存（250ms）到 `project_rules`；同项目成员会看到统一配置。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/components/vouchap-web/DataTable.tsx`  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`

### 2026-04-30（aim.link v2：项目任务表默认列序重排）

**User（提示词/原意）**  
- 默认列序中三个计数列放右端，`assignee`/`reviewer` 左移。

**Assistant（实现前）**  
- 调整 `ProjectDetailPage` DataTable 默认列数组顺序，不改列定义含义。

**Assistant（实现后说明）**  
- 已将 `Assignee`、`Reviewer` 提前；`Subtasks`、`Predecessors`、`Discussions` 放到最右侧。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`

### 2026-04-30（aim.link v2：标题缩略裁剪二次修复）

**User（提示词/原意）**  
- 缩略后的 title 仍超列宽，末端被裁剪。

**Assistant（实现前）**  
- 改为基于按钮真实可用宽度与实时字体测量做截断，避免“估算宽度 + CSS ellipsis”叠加造成二次裁剪。

**Assistant（实现后说明）**  
- `ProjectTaskTableTitleLink` 现在观测按钮真实宽度并用 `getComputedStyle` 字体参与 `truncateMiddleByWidth` 测量。  
- 任务表标题链接样式改为 `display:block; width:100%`，并移除 CSS `text-overflow: ellipsis`。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`  
- `aim.link-v2/apps/web/src/styles/aimlink-web-project-port.scss`

### 2026-04-30（aim.link v2：任务表标题缩略末端裁剪修复）

**User（提示词/原意）**  
- 缩略后的 title 仍超列宽，末端被裁剪。

**Assistant（实现前）**  
- 调整标题缩略可用宽度预算并移除链接默认左右 padding，保证计算宽度与实际绘制一致。

**Assistant（实现后说明）**  
- `ProjectTaskTableTitleLink` 可用宽度从 `w-2` 调整为 `w-18`（留出安全余量）。  
- 标题链接补 `px-0`，去除默认横向 padding。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`

### 2026-04-30（aim.link v2：任务表 Title 列约 50 字符上限）

**User（提示词/原意）**  
- title 列控制在 50 字符左右宽度；短标题完整显示，超出改中部缩略。

**Assistant（实现前）**  
- 在 `ProjectDetailPage` 给标题列增加像素上限（约 50 字符视觉宽度），继续沿用按溢出触发的中间缩略。

**Assistant（实现后说明）**  
- `Task title` 列新增 `maxWidth: 420`；短标题保持完整，超长标题仍由 `truncateMiddleByWidth` 做中部缩略。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`

### 2026-04-30（aim.link v2：项目任务表列扩展、标题列宽、内置 Task 工作流修复）

**User（提示词/原意）**  
- 标题列仍未充满；表增加起止、子任务数、前序数、讨论数；去掉 deadline 列。  
- 系统内置 Task 任务流转不生效，可能要刷新旧团队数据。

**Assistant（实现前）**  
- 用 `ResizeObserver` + 表单元格 `width:100%` 解决标题占满列；补查询与列；任务抽屉打开前 `ensureDefaultPdcaWorkflow` 并在种子后迁移 open/done 任务到 PDCA 相位。

**Assistant（实现后说明）**  
- 已实现上述逻辑；`typecheck` 通过。  
- 讨论数仅计 `message_scope` 非 `workflow_outcome` 的线程消息；前序为 `task_precedence_links` 指入当前任务；子任务为同项目内 `parent_task_id` 计数。

**关联**  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`  
- `aim.link-v2/apps/web/src/components/TaskDetailDrawer.tsx`  
- `aim.link-v2/apps/web/src/lib/task-workflow-default-seed.ts`  
- `aim.link-v2/docs/PROMPTS-LOG.md`、`aim.link-v2/docs/PRD.md`

### 2026-04-30（aim.link v2：项目任务表状态标签修复）

**User（提示词/原意）**  
- 自定义任务类型的状态标签在表格中显示不正确，出现 id。

**Assistant（实现前）**  
- 调整项目详情页状态标签加载逻辑：不再仅取默认类型的状态字典，改为根据当前项目任务实际状态 id 集合加载标签映射。

**Assistant（实现后说明）**  
- `ProjectDetailPage` 已改为基于任务实际 `workflow_state_id` 查询 `task_workflow_status.display_label`。  
- 自定义类型状态在任务表中不再回退显示为 id（除非数据库确实无对应状态行）。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`

### 2026-04-30（aim.link v2：任务表标题改为按列宽中间缩略）

**User（提示词/原意）**  
- 标题缩略需按列宽溢出后触发，不用固定 15 汉字上限。

**Assistant（实现前）**  
- 新增基于像素宽度测量的中间缩略函数，并将项目任务表标题列改为按列宽预算动态截断。

**Assistant（实现后说明）**  
- `breadcrumb-label.ts` 增加 `truncateMiddleByWidth`：仅在文本实际宽度超过阈值时执行中间省略。  
- `ProjectDetailPage` 的 `Task title` 列改为调用该函数；列宽与文本预算分离配置，未溢出时不截断。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/lib/breadcrumb-label.ts`  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`

### 2026-04-30（aim.link v2：项目任务表标题列宽与中间省略）

**User（提示词/原意）**  
- 项目内任务 table 的 `Task title` 列限制最大宽度，超长用和面包屑一样的中间缩略。

**Assistant（实现前）**  
- 调整 `ProjectDetailPage` 数据表标题列配置：设置 `maxWidth`，并将标题渲染改为复用 `truncateBreadcrumbSegment`。

**Assistant（实现后说明）**  
- `Task title` 列已增加 `maxWidth: 320`。  
- 列内容已改为中间省略（与面包屑同函数 `truncateBreadcrumbSegment`）；`Tooltip` 保留完整标题。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`

### 2026-04-30（aim.link v2：停用任务类型从新建/切换候选移除）

**User（提示词/原意）**  
- Active 关闭的任务类型，在任务类型切换和新建任务时不可再用；已有任务不受影响。

**Assistant（实现前）**  
- 在任务详情类型下拉与新建任务默认类型解析两处加入 `retired_at` 过滤；保留存量任务当前类型显示，不做强制迁移。

**Assistant（实现后说明）**  
- `TaskDetailDrawer` 已过滤停用类型，仅展示可用类型用于切换；若当前任务类型已停用，仍保留当前值显示，确保历史任务可正常查看。  
- `project-workflow.pickTaskBlueprintOpenState` 已过滤停用类型，避免新建任务选中停用类型。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/components/TaskDetailDrawer.tsx`  
- `aim.link-v2/apps/web/src/lib/project-workflow.ts`

### 2026-04-30（aim.link v2：Task types — System 标签进一步减小）

**User（提示词/原意）**  
- `system` 标进一步减小。

**Assistant（实现前）**  
- 在 `TaskTypesSettingsPage` 缩小 `System` 标签样式（字体、内边距、行高），保持其在名称后弱化展示。

**Assistant（实现后说明）**  
- 已将 `System` 标签进一步缩小（`10px` 字号，收窄 padding，降低行高）。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/pages/settings/TaskTypesSettingsPage.tsx`

### 2026-04-30（aim.link v2：Task types 列表 — 强化 Type name，弱化 System）

**User（提示词/原意）**  
- Task types 列表上强化 `Type name`；`System` 标签弱化，且放在名称列紧跟名称。

**Assistant（实现前）**  
- 调整 `TaskTypesSettingsPage` 表格列：强化 `Type name` 信息密度与可读性；将 `System` 从 `Creator` 列移回 `Type name` 且弱化样式；`Creator` 列恢复纯创建人。

**Assistant（实现后说明）**  
- `Type name` 列已加宽并提升名称字重；`System` 标签改为浅灰低对比样式，紧跟在名称后同列显示。  
- `Creator` 列已移除 `System` 标签，仅显示创建人。  
- `apps/web` 执行 `npm run typecheck` 通过。

**关联**  
- `aim.link-v2/apps/web/src/pages/settings/TaskTypesSettingsPage.tsx`

### 2026-04-30（aim.link v2：Task types 详情去 internal_code + 默认类型码 task）

**User（提示词/原意）**  
- 任务类型详情页去掉 `internal_code`；默认 Task 类型的 `internal_code` 改为 `task`。

**Assistant（实现前）**  
- 前端移除详情页 `internal_code` 可见项，并调整新建逻辑不再暴露 code 输入；新增 DB 迁移将系统默认类型码从 `general` 调整为 `task`，同时保留对历史数据兼容；同步项目默认蓝本选择逻辑。

**Assistant（实现后说明）**  
- `TaskTypesSettingsPage`：详情头部已移除 `internal_code` 标签；创建弹窗去除 `Internal code` 输入，创建时由标题自动生成内部 code。  
- 新增迁移 `20260430214000_task_blueprint_default_internal_code_task.sql`：将系统默认类型码切到 `task`（无冲突 workspace 自动迁移），并更新 workspace 默认种子函数优先写入 `task`，兼容历史 `general`。  
- `apps/web/src/lib/project-workflow.ts`：默认蓝本查找优先 `task`，回退 `general`。  
- 已同步 `aim.link-v2/docs/PROMPTS-LOG.md`、`aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/DATABASE-SCHEMA.md`。

**关联**  
- `aim.link-v2/apps/web/src/pages/settings/TaskTypesSettingsPage.tsx`  
- `aim.link-v2/apps/web/src/lib/project-workflow.ts`  
- `aim.link-v2/supabase/migrations/20260430214000_task_blueprint_default_internal_code_task.sql`

### 2026-04-30（aim.link v2：Task types — Linked tasks 列左对齐）

**User（提示词/原意）**  
- `linked tasks` 一列也靠左。

**Assistant（实现前）**  
- 修改 `TaskTypesSettingsPage` 表格列配置，移除 `Linked tasks` 的右对齐参数；随后执行类型检查。

**Assistant（实现后说明）**  
- `Linked tasks` 列已改为左对齐显示。  
- `apps/web` 执行 `npm run typecheck` 通过。  
- 已同步 `aim.link-v2/docs/PROMPTS-LOG.md`、`aim.link-v2/docs/PRD.md` 以及本溯源日志。

**关联**  
- `aim.link-v2/apps/web/src/pages/settings/TaskTypesSettingsPage.tsx`

### 2026-04-30（aim.link v2：Task types — System 标识移到 Creator 列）

**User（提示词/原意）**  
- `system` 标识放在 `creator` 一列。

**Assistant（实现前）**  
- 调整 `TaskTypesSettingsPage` 表格列渲染：从 `Type name` 列移除 `System` 标签，改到 `Creator` 列；完成后跑 `typecheck` 校验。

**Assistant（实现后说明）**  
- 已将 `System` 标签移动至 `Creator` 列，与创建人同列显示；`Type name` 列仅保留类型名。  
- `apps/web` 执行 `npm run typecheck` 通过。  
- 已同步 `aim.link-v2/docs/PROMPTS-LOG.md` 与 `aim.link-v2/docs/PRD.md` 记录。

**关联**  
- `aim.link-v2/apps/web/src/pages/settings/TaskTypesSettingsPage.tsx`

### 2026-04-30（aim.link v2：Task types — Type name 第二行移除）

**User（提示词/原意）**  
- `type name` 的第二行是什么，去掉。

**Assistant（实现前）**  
- 定位 `Task types` 表格 `Type name` 列渲染，移除第二行 `internal_code`，保留主标题与系统标识标签；随后跑 `typecheck` 确认无回归。

**Assistant（实现后说明）**  
- 已在 `TaskTypesSettingsPage` 删除 `Type name` 列内的 `row.internal_code` 第二行文案，仅保留类型名。  
- `apps/web` 执行 `npm run typecheck` 通过。  
- 已同步 `aim.link-v2/docs/PROMPTS-LOG.md` 与 `aim.link-v2/docs/PRD.md` 变更记录。

**关联**  
- `aim.link-v2/apps/web/src/pages/settings/TaskTypesSettingsPage.tsx`

### 2026-04-30（aim.link v2：Task types 设置页 — 列表布局与文档同步）

**User（提示词/原意）**  
- **Task types** 整页：去除 **Create task type** 模块、**Create new** 放右上、去掉 **Existing task types** 外层、标题下直接表格；列含类型名、创建人、创建/更新时间、关联任务数、活跃开关、编辑等。

**Assistant（实现前）**  
- 无新增实现；续作：确认 **`apps/web` `typecheck` 通过**；补 **`aim.link-v2`** 的 **`docs/DATABASE-SCHEMA.md` / `PROMPTS-LOG.md` / `PRD.md` 变更记录**（与 Task types 页及 **`task_blueprints.created_by_user_id`** 迁移一致）。

**Assistant（实现后说明）**  
- **`npm run typecheck`**（`@aimlink/web`）**通过**。  
- 已更新 **`aim.link-v2/docs/DATABASE-SCHEMA.md`**（`task_blueprints` 行含 **`created_by_user_id`**、**`retired_at`**）；**`PROMPTS-LOG.md`** 与 **`PRD.md` 变更记录** 已追加 2026-04-30 条。  
- 部署须执行 Supabase 迁移（含 **`20260430193000_task_blueprints_created_by_user.sql`**），否则新列查询/写入会失败。

**关联**  
- `aim.link-v2/apps/web/src/pages/settings/TaskTypesSettingsPage.tsx`、`aim.link-v2/supabase/migrations/20260430193000_task_blueprints_created_by_user.sql`

### 2026-04-29（aim.link v2：工作流画布 — 右侧未到边即限位）

**User（提示词/原意）**  
- 画布右侧拖动**未到边缘**就被限制。

**Assistant（实现后说明）**  
- **`nodeExtent`** 的 **`maxNX`** 改为 **`w - 148`**（与 **`.aimlink-wf-node` min-width** 一致），不再用 **`WF_NODE_W` 176**。

**关联**  
- `aim.link-v2/apps/web/src/components/settings/TaskWorkflowVisualEditor.tsx`

### 2026-04-29（aim.link v2：工作流画布 — 节点不可拖出画布）

**User（提示词/原意）**  
- 左右仍无滚动条；改为**限制不要拖出画布**。

**Assistant（实现后说明）**  
- **`TaskWorkflowVisualEditor`**：**`ResizeObserver`** + **`nodeExtent`/`translateExtent`**；**`clampWorkflowNodePosition`**；**`autoLayout`** 与初始节点写入前钳制；样式内层 **100%** 宽。

**关联**  
- `aim.link-v2/apps/web/src/components/settings/TaskWorkflowVisualEditor.tsx`、`aim.link-v2/apps/web/src/styles/aimlink-web-task-workflow-visual.scss`

### 2026-04-29（aim.link v2：工作流画布滚轮不滚动 / 无横向条）

**User（提示词/原意）**  
- 有上下滚动条但滚不动；拖动滚动条可动画布；左右不完整且无横向滚动条。

**Assistant（实现后说明）**  
- **`TaskWorkflowVisualEditor`**：**`preventScrolling={false}`**，避免 React Flow **`preventDefault`** 吞掉滚轮。样式：**`width: max(100%,960px)`**、**`overflow-x/y: auto`**、**`scrollbar-gutter: stable`**。

**关联**  
- `aim.link-v2/apps/web/src/components/settings/TaskWorkflowVisualEditor.tsx`、`aim.link-v2/apps/web/src/styles/aimlink-web-task-workflow-visual.scss`

### 2026-04-29（aim.link v2：工作流画布溢出 / 滚动）

**User（提示词/原意）**  
- 画布需**限制不能溢出**，或**支持滚动**。

**Assistant（实现后说明）**  
- **`aim.link-v2`**：**`aimlink-web-task-workflow-visual.scss`** — 根 **`overflow:hidden` + max-width**；画布列 **`overflow:hidden`**；滚动区 **`flex:1 1 0`**、**`min-height/min-width:0`**、**`overflow:auto`**，移除与 **`min-height:0`** 冲突的 **`min-height:440px`**；**`overscroll-behavior:contain`**。工具栏文案补充在灰色面板内滚动、不溢出页面。

**关联**  
- `aim.link-v2/apps/web/src/styles/aimlink-web-task-workflow-visual.scss`、`aim.link-v2/apps/web/src/components/settings/TaskWorkflowVisualEditor.tsx`

### 2026-04-29（aim.link v2：工作流画布区与屏显左右错位）

**User（提示词/原意）**  
- 画布区与屏显区域**左右错位**：画布**左侧溢出**，**右侧**不到显示边缘，**右侧内容被裁剪**。

**Assistant（实现后说明）**  
- 在 **`aim.link-v2`** 调整 **`aimlink-web-task-workflow-visual.scss`**：画布列 **`flex: 1 1 0`**、侧栏 **`flex: 0 0 min(440px,42%)`** 并去掉重复 **`width:42%`**；内层由固定 **960×440** 改为 **`width:100%` + min 尺寸 + `height:100%`**，**`TaskWorkflowVisualEditor`** 去掉对应行内样式。**`npm run typecheck`**（`apps/web`）通过。

**关联**  
- `aim.link-v2/apps/web/src/styles/aimlink-web-task-workflow-visual.scss`、`aim.link-v2/apps/web/src/components/settings/TaskWorkflowVisualEditor.tsx`

### 2026-04-29（aim.link v2 / 多根 Workspace：工作流画布 — 拖动连线端点改锚点）

**User（提示词/原意）**  
- 允许用户自行**拖动连线的起终点**，选择节点上的**其他锚点**（与自动贪心锚点分配配合）。

**Assistant（实现前说明）**  
- 在 **`aim.link-v2`** 的 **`TaskWorkflowVisualEditor`** 启用 React Flow **`onReconnect`**，用 **`reconnectEdge(..., { shouldReplaceId: false })`** 保持边 id 与 **`task_workflow_rules.id`** 一致；持久化 **`from_state_id` / `to_state_id`** 与 **`conditions.source_handle` / `target_handle`**；与 **`transitionExists`** 业务校验冲突则提示并拒收。为使 DB 锚点生效，在贪心结果上叠加 **`parsePersistedHandleOverride`**。同步 **`aim.link-v2` 的 `docs/PRD.md` / `PROMPTS-LOG.md`**，不修改 Vouchap 产品 PRD 正文。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`/Users/macbook/aim.link-v2/apps/web/src/components/settings/TaskWorkflowVisualEditor.tsx`**；**`npm run typecheck`**（`apps/web`）通过。  
- **验证建议**：在 Task types → 流程可视化中拖动某条 transition 的端点改接四向锚点或另一状态对，保存后刷新应仍按持久化锚点绘制；尝试与已有「同路径同角色」冲突时应报错并回滚为服务端数据（**`onReload`**）。

**关联**  
- `aim.link-v2/apps/web/src/components/settings/TaskWorkflowVisualEditor.tsx`；`aim.link-v2/docs/PRD.md`；`aim.link-v2/docs/PROMPTS-LOG.md`

### 2026-04-26（Vouchap：Engagement 详情 / Todos — 手机浏览器与 App 对齐）

**User（提示词/原意）**  
- vouchap 手机浏览器端，engagement 详情页 / todo 页仍与 App 不一致，需优化对齐。

**Assistant（实现前说明）**  
- 根因：`ProjectDetailView` 用 `isMobile = !isWeb`，凡 `Platform.OS === 'web'`（含手机浏览器）都走桌面顶栏单行标题、顶栏右侧操作、内联 Todo 筛选；`TaxFilingTodosView` 亦凡 Web 即桌面表格/拖放/悬停布局。  
- 计划：接入已有 `useWebViewportKind()` / `isMobileWebWidth`，使 **移动 Web** 与原生共用「紧凑顶栏 + 底部主操作 + 筛选浮层」；Todo 树通过 **Context** 在窄屏 Web 上走与 App 相同的行布局（`Pressable` 行、移动进度/状态列、无桌面拖放与 Depends 列等）。

**Assistant（实现后说明 / 本轮结论）**  
- **`ProjectDetailView`**：`useMobileEngagementChrome = !isWeb || isMobileWeb`；桌面 Web 仍用顶栏操作与内联筛选；移动 Web 用底部操作条与筛选 Modal。`ProjectDetailHeaderTitle` 在移动 Web 使用与 App 相同的两行紧凑顶栏。`onPersistTodoTitle` 仅 `isDesktopWeb` 时下发（与既有父级 `persistTodoTitle` 门控一致）。  
- **`TaxFilingTodosView`**：新增 `TaxFilingTodoDesktopWebLayoutContext`，`isDesktopWebTodoLayout = web && !isMobileWebWidth(width)`；`TodoTree` 通过 Context 分支替代多处 `Platform.OS === 'web'` 的布局逻辑；拖放、`createPortal` 幽灵层、「Add a phase」、行内重命名附件悬停等仅桌面 Web。  
- **验证建议**：手机浏览器打开 firm/client engagement 详情与 client project todos，对比原生 App：顶栏两行、Todos/Info、底部 Terminate/Complete/Accept、筛选入口与列表行布局应一致；桌面宽窗 Web 行为应保持不变。  
- **残留**：`StyleSheet.create` 内部分样式仍以 `Platform.OS === 'web'` 静态分支，窄屏下个别间距可能与原生略有差异；若需像素级一致可后续改为按 `isDesktopWebTodoLayout` 的动态样式。

**关联**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`  
- `vouchap-app/src/mobile-ui/components/TaxFilingTodosView.tsx`

### 2026-04-26（Vouchap：手机浏览器优先采用 App 页面，启动第 1 批落地）

**User（提示词/原意）**  
- 用户询问「网页端适配手机浏览器并采用 App 页面，改造幅度大不大」；随后要求「列出可直接改代码的 TODO，并立即开始」。
- 用户补充更正：**移动浏览器首页不采用 App 版 index，应继续使用 Dashboard**；并要求将该点纳入修订后的列表后继续第二批。

**Assistant（实现前说明，若有）**  
- 先做第 1 批高收益改造：建立统一的 Web 视口判定（区分 desktop web / mobile web），并将根布局与首页、收支列表从“`Platform.OS === 'web'` 全量走桌面分支”改为“仅桌面 Web 走桌面分支”，使手机浏览器回落到移动端单栏与 App 风格交互。
- 同批次继续覆盖同类列表页（`inbound` / `outbound` / `receipt-items`），避免手机浏览器仍落入桌面 DataTable 分支。
- 计划触及文件：`vouchap-app/src/mobile-ui/lib/web-viewport.ts`、`vouchap-app/src/mobile-ui/app/_layout.tsx`、`vouchap-app/src/mobile-ui/app/index.tsx`、`vouchap-app/src/mobile-ui/app/receipts.tsx`、`vouchap-app/src/mobile-ui/app/invoices.tsx`、`vouchap-app/src/mobile-ui/app/inbound.tsx`、`vouchap-app/src/mobile-ui/app/outbound.tsx`、`vouchap-app/src/mobile-ui/app/receipt-items.tsx`。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `web-viewport` 工具，提供 `MOBILE_WEB_MAX_WIDTH`、`isMobileWebWidth()` 与 `useWebViewportKind()`，用于统一判定移动 Web。
- `_layout` 已改为仅桌面 Web 显示 `WebSidebar`、固定 `WebChatPanel` 与桌面 chat FAB；移动 Web 不再走桌面双栏结构。
- `index` 页改为仅桌面 Web 使用 `WebDashboardView/CrmDashboardView`；移动 Web 走原移动页路径。space 切换后的“刷新页面”弹窗仅桌面 Web 显示。
- `receipts` / `invoices` 已接入视口判定：`DataTable`、Web 浮窗、Web 专属 FAB 仅桌面 Web 启用；移动 Web 回落到移动列表与交互分支。
- `inbound` / `outbound` / `receipt-items` 已同步接入视口判定：Web 浮窗和桌面表格仅桌面 Web 启用，手机浏览器回落到移动列表交互。
- 按用户更正已回调首页策略：`index` 在移动浏览器仍走 Dashboard（与桌面 Web 一致），不再落回 App 首页布局。
- 第二批已推进：`firm/clients`、`firm/engagements`、`firm/client/[clientSpaceId]` 的 DataTable/浮窗/Realtime 路径改为仅桌面 Web 启用；移动浏览器回落移动端列表/卡片交互。`tax-filing/index` 仅桌面 Web 走 `TaxFilingWebScreen`，移动浏览器改走 `TaxFilingMobileScreen`；`tax-filing/order/[orderId]` 与 `tax-filing/project/[projectId]` 的 Web 专属提示/交互（alert/confirm、树缩进判定、Tina FAB 开关）改为仅桌面 Web 触发。
- 本轮已检查改动文件的 lint，未发现新增错误。

**关联**  
- `vouchap-app/src/mobile-ui/lib/web-viewport.ts`  
- `vouchap-app/src/mobile-ui/app/_layout.tsx`  
- `vouchap-app/src/mobile-ui/app/index.tsx`  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`  
- `vouchap-app/src/mobile-ui/app/invoices.tsx`  
- `vouchap-app/src/mobile-ui/app/inbound.tsx`  
- `vouchap-app/src/mobile-ui/app/outbound.tsx`  
- `vouchap-app/src/mobile-ui/app/receipt-items.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/clients.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/engagements.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/client/[clientSpaceId].tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/index.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/index.tsx`

### 2026-04-26（Vouchap：手机浏览器 Web 分流 — 第 3 批：Management / Chat / 详情与目录）

**User（提示词/原意）**  
- 「继续第三批」：在已有 `useWebViewportKind` / `isMobileWebWidth` 策略下，补齐 management、chat、设置/实体、服务目录及若干详情页的「仅桌面 Web」与「移动 Web 走 App 交互」分流。

**Assistant（实现前说明，若有）**  
- 将仍按 `Platform.OS === 'web'` 一律走桌面分支的屏，改为 `isDesktopWeb` 或 `isDesktopCatalog`（服务目录：宽屏 Web + `!isMobileWebWidth(width)`），使移动浏览器与原生一致或可订阅 Realtime；桌面 Web 保留整页刷新提示、侧栏 Chat、Web 专用控件与浮层。

**Assistant（实现后说明 / 本轮结论）**  
- **`management`**：Space 切换成功后，仅 **桌面 Web** 弹出「Refresh page」；**移动 Web** 与原生一样就地 `loadData()` 更新。  
- **`chat-to-log`**：`drawer` 模式、桌面式输入区、文件 input / 文件夹选择仅 **桌面 Web**；移动 Web 使用与 App 一致的底部输入与 `ImagePicker` 选图。  
- **`firm/engagement/[id]`**：自动打开 `WebChatPanel`、`window.confirm` 拒单、Tina FAB 显示条件、`persistTodoTree*` 仅 **桌面 Web**；移动 Web 可走 Tina FAB + 全屏 chat 路由。  
- **`receipt-details/[id]`**：`input type="date"`、行内 Web 下拉（category/attribution）仅 **桌面 Web**；移动 Web 用日期触控与 Modal 选择器。  
- **`entities-manage`**：`entities` Realtime 在 **桌面 Web** 禁用，**移动 Web** 启用；原 `StyleSheet` 内针对 Web 的 `supplierCard` 溢出样式改为仅 `isDesktopWeb` 时叠加。  
- **`tax-filing/order/[orderId]/info`**：拒单确认 **桌面 Web** 用 `window.confirm`，否则 `Alert`（含移动 Web）。  
- **`tax-filing/service-catalog`**、**`firm/service-catalog`**：默认视图、列宽/网格、Filter 浮层（portal）与横向 padding 仅 **桌面目录宽**；移动 Web 用双列卡片宽与内联 Filter 下拉。  
- 已对上述改动文件跑过 IDE lint，无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/app/management.tsx`  
- `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`  
- `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`  
- `vouchap-app/src/mobile-ui/app/entities-manage.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/info.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/service-catalog.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/service-catalog.tsx`

### 2026-04-26（Vouchap：窄窗 Web — Expenses/Income 列表 + 直达 Chat）

**User（提示词/原意）**  
- 浏览器窄窗模式下，expenses / income 列表页右下角 + 按钮不要二次选择，去掉激活相机的二层选项，直接打开 chat。

**Assistant（实现前说明，若有）**  
- 列表页 FAB：`isDesktopWeb` 仍用 `WebChatFab`；**原生** 仍保留「+ 展开聊天/相机」；**窄窗 Web**（`Platform.OS === 'web' && !isDesktopWeb`）单独分支，主按钮一次性 `router.push` 到 `chat-to-log`（invoice 带 `type=invoice`）。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipts.tsx`**、**`invoices.tsx`**：在桌面 Web 与原生之间增加 **仅 Web 且非桌面** 的单按钮 FAB，点击即进入 Chat to log；原生逻辑未改。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`  
- `vouchap-app/src/mobile-ui/app/invoices.tsx`

### 2026-04-26（Vouchap：窄窗 Web 首页对齐 App — Dashboard 单列图表 + 顶栏底栏）

**User（提示词/原意）**  
- 浏览器窄窗模式：1）Dashboard 不要压扁 chart 宽高比，单列排列；2）底部与 App 相同路由按钮；3）顶部与 App 相同：通知、Space 切换、设置。概括：窄窗与 App 差异仅在 index 主区由 slogan + 两圆钮改为 4 个 chart，其余布局一致。

**Assistant（实现前说明，若有）**  
- 沿用 `useWebViewportKind`：仅 **桌面 Web** 首页仍只渲染 Dashboard（配合侧栏）；**移动 Web** 走与原生相同的 `index` 壳层（顶栏、ScrollView、底栏）。  
- `WebDashboardView` / `CrmDashboardView` 在窄 Web 上改为与原生一致的 **单列** 与 **按宽度定图表高度**（避免 2×2 按视口高度切半导致压扁）。  
- `WebDashboardView` 嵌入首页时去掉重复「Dashboard」标题行（`homeCompact`）。

**Assistant（实现后说明 / 本轮结论）**  
- **`index.tsx`**：`Platform.OS === 'web' && isDesktopWeb` 才整页只放 Dashboard；**移动 Web** 落入原原生 `ScrollView + topBar + bottomNav + modals` 路径；client 空间在 **移动 Web** 用 `<WebDashboardView homeCompact />` 替代 slogan 与双圆按钮；Space 切换后「刷新页」弹窗仅 **桌面 Web**（与 management 策略一致）。  
- **`WebDashboardView.tsx`**：`!isMobileWebWidth(width)` 为桌面 2×2；否则单列，`chartHeight` 由 `chartWidth` 比例与上下限约束；`homeCompact` 时仅输出图表栅格供首页嵌入。  
- **`CrmDashboardView.tsx`**：将原「凡 `Platform.OS === 'web'` 即 2×2」改为 **仅宽屏桌面 Web** 2×2；窄 Web 与原生同为单列；「Insights」顶栏仅桌面宽屏；饼图/条形/折线 padding 在移动 Web 上与原生一致（`isMobileWebWidth`）。  
- 已对相关文件跑 IDE lint，无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/app/index.tsx`  
- `vouchap-app/src/mobile-ui/components/WebDashboardView.tsx`  
- `vouchap-app/src/mobile-ui/components/CrmDashboardView.tsx`

### 2026-04-26（Vouchap：测试服务器 Web 白屏修复）

**User（提示词/原意）**  
- 「测试服务器浏览器白屏」。

**Assistant（实现前说明，若有）**  
- 先读取正在运行的 Expo 终端日志，定位是打包失败还是运行时错误；若为模块解析失败，直接修正导入路径并让 Metro 增量重编译。

**Assistant（实现后说明 / 本轮结论）**  
- 白屏根因是 **Web Bundling failed**：`src/mobile-ui/app/receipt-details/[id].tsx` 无法解析 `../lib/web-viewport`。  
- 已将该文件 import 改为 `../../lib/web-viewport`（当前目录为 `app/receipt-details/`，需回退两级到 `mobile-ui/lib`）。  
- 本地 lint 对该文件无新增报错。若浏览器仍显示旧白屏，请强制刷新一次（`Cmd+Shift+R`）或在 Expo 终端按 `r` 触发 reload。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`

### 2026-04-26（Vouchap：Web 列表分组/筛选 — 窄屏走 Modal、桌面仍走 Portal）

**User（提示词/原意）**  
- Web 端宽屏、窄屏模式下列表上的分组、筛选功能都不可用（改坏）。

**Assistant（实现前说明，若有）**  
- 根因：分组/筛选底部 **Modal** 仍用 `Platform.OS !== 'web'` 包裹；窄屏 Web 已不走桌面 **Portal**（`isDesktopWeb === false`），但也不渲染 Modal，点击仅切 state、无菜单。  
- 将两处 Modal 外层条件改为 **`!isDesktopWeb`**：桌面 Web 继续仅用 Portal + `nativeID` 量位；窄屏 Web 与原生用底部 Modal。同步改 **receipts / invoices / inbound / outbound** 四处同类写法。

**Assistant（实现后说明 / 本轮结论）**  
- 上述四文件中 **`{Platform.OS !== 'web' && (`** 已替换为 **`{!isDesktopWeb && (`**（各 2 处：Group、Filter）。原生 `isDesktopWeb` 恒为 false，行为与原先一致。  
- 已对改动文件跑 IDE lint，无新增报错。验证：桌面宽 Web 点 Group/Filter 仍为浮层；浏览器宽度 ≤920 或移动 Web 点同一按钮应出现底部 Sheet。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`  
- `vouchap-app/src/mobile-ui/app/invoices.tsx`  
- `vouchap-app/src/mobile-ui/app/inbound.tsx`  
- `vouchap-app/src/mobile-ui/app/outbound.tsx`

### 2026-04-22（aim.link-v2：Timeline 左栏宽度对齐左轨）

**User**  
- 左侧栏应按规范统一的宽度。

**Assistant（实现后）**  
- **`aim.link-v2`**：**`aimlink-timeline-filters`** 与 **`aimlink-drawer-static`** 同用 **`220px × --aimlink-ui-scale`**（**`--menu-width`**）。

**关联**  
- `aim.link-v2/apps/web/src/styles/aimlink-web-dynamic-port.scss`

### 2026-04-22（aim.link-v2：Timeline 主区纵向错位修复）

**User**  
- 主显示区被放在页面下部了，布局不对。

**Assistant（实现后）**  
- **`aim.link-v2`**：**`aimlink-web-dynamic-port.scss`** 去掉 **`aimlink-web-app-shell-main > .aimlink-timeline-page`** 上的 **`flex-direction: column`** 与 **`aimlink-dynamic-tab-main`** 的共用规则，避免覆盖 Timeline 横向布局。

**关联**  
- `aim.link-v2/apps/web/src/styles/aimlink-web-dynamic-port.scss`

### 2026-04-22（跨仓：aim.link-v2 Timeline 独立与 work map 流水）

**User（提示词/原意）**  
- Timeline 不应嵌 Work Map 模块；左栏筛选；主区按日分组；project/task/work map 可跳转；参考 legacy timeline。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 **`aim.link-v2`** 落地 **`ActivityPage`** 重构与 **`workmap.mind_maps`** → **`activity_timeline_events`** 迁移草案；并更新 **`aim.link-v2/docs/PRD.md`** / **`DATABASE-SCHEMA.md`**。

**关联**  
- `aim.link-v2/apps/web/src/pages/ActivityPage.tsx`、`aim.link-v2/supabase/migrations/20260422100000_timeline_workmap_mind_map_events.sql`

### 2026-04-23（aim.link-v2：全仓 ant4 迁移 + Work Map 左栏修复）

**User（提示词/原意）**  
- Work Map 左侧栏被改坏需核查修复；并要求整个 aim.link-v2 完整替换 `ant4` 等代号。

**Assistant（实现后说明 / 本轮结论）**  
- 已修复 Work Map 左栏；并在 `aim.link-v2/apps/web/src` 全量将 `ant4-` 迁移为 `aimlink-`（含页面与样式）。类型检查与 lints 通过。

**关联**  
- `aim.link-v2/apps/web/src/pages/WorkMapPage.tsx`、`aim.link-v2/apps/web/src/styles/aimlink-web-app-shell.scss`、`aim.link-v2/apps/web/src/styles/aimlink-web-work-map-port.scss`

### 2026-04-23（aim.link-v2：Work Map ant4 前缀替换）

**User（提示词/原意）**  
- 代码中还有大量 `ant4`，应全面替换成 `aimlink`。

**Assistant（实现后说明 / 本轮结论）**  
- 已先在 **Work Map 模块**落地：`WorkMapPage.tsx` 与 `aimlink-web-work-map-port.scss` 的 `ant4-*` 替换为 `aimlink-*`，模块内残留清零；其余模块仍有历史前缀，待继续分批迁移。验证：`npx tsc --noEmit`（`apps/web`）。

**关联**  
- `aim.link-v2/apps/web/src/pages/WorkMapPage.tsx`、`aim.link-v2/apps/web/src/styles/aimlink-web-work-map-port.scss`

### 2026-04-22（aim.link-v2：Work Map WBS 提示词 @ / # 与深度）

**User（提示词/原意）**  
- AI 输出未按设计格式（**@** 指派人、**#** 截止时间）；深化提示词：WBS 更深更具体，合理起止时间。

**Assistant（实现后说明 / 本轮结论）**  
- **`aim.link-v2/apps/web`**：**`gemini-work-map-wbs.ts`** 强化系统提示（叶子 **@/#**、双日期、行数/深度、锚日）；**`WorkMapPage`** 传入 **`getWorkspaceMembersForMindMap`** 无空格姓名列表；PRD/PROMPTS 已更新。验证：**`npx tsc --noEmit`**（**`apps/web`**）。

**关联**  
- `aim.link-v2/apps/web/src/lib/gemini-work-map-wbs.ts`、`aim.link-v2/apps/web/src/pages/WorkMapPage.tsx`  
- `aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/PROMPTS-LOG.md`

### 2026-04-22（aim.link-v2：Work Map WBS 模型级联对齐 Vouchap）

**User（提示词/原意）**  
- 参考 Vouchap 代码配置，选择合适用来拆解工作计划的优先模型。

**Assistant（实现后说明 / 本轮结论）**  
- **`aim.link-v2/apps/web/src/lib/gemini-work-map-wbs.ts`**：模型尝试顺序与 **`Vouchap/vouchap-app/src/shared-logic/gemini-helper.ts`**（**`buildGeminiModelOrder` / `inferComplexGeminiContent`**）对齐，并增加失败自动换模；**`VITE_GEMINI_MODEL`** 为单模覆盖。已更新 **`aim.link-v2`** 的 PRD / PROMPTS / README 等。验证：**`npx tsc --noEmit`**（**`apps/web`**）。

**关联**  
- `aim.link-v2/apps/web/src/lib/gemini-work-map-wbs.ts`、`Vouchap/vouchap-app/src/shared-logic/gemini-helper.ts`  
- `aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/PROMPTS-LOG.md`

### 2026-04-22（aim.link-v2：Gemini 默认模型 2.5 Flash）

**User（提示词/原意）**  
- Google 提示 **`gemini-2.0-flash`** 对新用户不可用，要求代码改用更新模型。

**Assistant（实现后说明 / 本轮结论）**  
- **`aim.link-v2/apps/web/src/lib/gemini-work-map-wbs.ts`**：默认模型改为 **`gemini-2.5-flash`**；**`aim.link-v2`** 内 README / PRD / PROMPTS 已同步。验证：**`npx tsc --noEmit`**（**`apps/web`**）。

**关联**  
- `aim.link-v2/apps/web/src/lib/gemini-work-map-wbs.ts`、`aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/PROMPTS-LOG.md`

### 2026-04-22（aim.link-v2：Work Map Chat — Gemini WBS → mind_map_document）

**User（提示词/原意）**  
- 开发 AI：env 已加 Gemini key；用户在 chat 页输入项目目标与规范需求，大模型拆 WBS，JSON 写入 **`mind_maps.mind_map_document`**，并拟定 **`name`**。

**Assistant（实现前说明）**  
- 在 **`aim.link-v2/apps/web`** 落地：Gemini JSON → **`documentFromOutlineAndTitle`** → **`createMindMap`**；Vite 合并 Gemini 相关 env；更新 **`aim.link-v2`** 的 **PRD / PROMPTS** 与 **`apps/web`** 文档示例；本条目记入 Vouchap 溯源（跨仓工程交付）。

**Assistant（实现后说明 / 本轮结论）**  
- 代码与文档位于 **`aim.link-v2`** 路径见上；密钥走浏览器直连存在暴露与 CORS 风险，PRD **REQ-WEB-AI-001** 已注明后续可迁 Edge。验证：**`npx tsc --noEmit`**（**`aim.link-v2/apps/web`**）。

**关联**  
- `aim.link-v2/apps/web/src/lib/gemini-work-map-wbs.ts`、`aim.link-v2/apps/web/src/pages/WorkMapPage.tsx`、`aim.link-v2/apps/web/vite.config.ts`  
- `aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/PROMPTS-LOG.md`

### 2026-04-22（aim.link-v2：Todo 与 Task 模块合并为单一 Todo）

**User（提示词/原意）**  
- Todo 模块整合到 Task 模块（现 todo 模块移除，Task 模块更名为 Todo）；My todo 替代 My tasks；三个 pending 作为 My Todo 的子集。

**Assistant（实现前说明）**  
- 以 **`TasksPage`** 为唯一实现；路由 **`/app/todo`**，**`/app/tasks`** 重定向；顶栏 **`effectiveTodoNavEnabled`**；左栏嵌套三项 **Pending** 与 **`work_tasks`** 过滤对齐旧 **`TodoPage`**；删除 **`TodoPage.tsx`**、**`TodoLeftRail.tsx`** 与 **`aimlink-web-todo-port.scss`**；更新 **`aim.link-v2/docs/PRD.md`**、**`PROMPTS-LOG.md`** 与 **`FeaturePermissions`** 中 **`tasks`** 与 **`todo`** 同步写入。

**Assistant（实现后说明 / 本轮结论）**  
- 改动位于 **`aim.link-v2/apps/web`** 上述路径；**`npx tsc --noEmit`**（**`apps/web`**）通过。

**关联**  
- `aim.link-v2/apps/web/src/App.tsx`、`TasksPage.tsx`、`TasksLeftRail.tsx`、`AppNavHeader.tsx`、`AppLayout.tsx`  
- `aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/PROMPTS-LOG.md`

### 2026-04-22（aim.link-v2：Task 侧栏 CTA 文案 New Todo → New Task）

**User（提示词/原意）**  
- 「+ New Todo 还是规范为 + New Task」。

**Assistant（实现前说明）**  
- 对齐域模型与产品英文：**Task** 模块左栏 **`aimlink-sidebar-hero-cta`** 与无障碍/悬停文案由 **New Todo** 改为 **New Task**；同步 **`apps/web` README**、**`aim.link-v2/docs/PRD.md`**（REQ-WEB-UI-002、变更表）、**`aim.link-v2/docs/PROMPTS-LOG.md`**；**`TaskCreateCenterModal`** 已为 **New Task** 则不改逻辑。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`TasksLeftRail.tsx`**、**`app-chrome/README.md`**、上述 PRD/PROMPTS；**`npx tsc --noEmit`**（`aim.link-v2/apps/web`）通过。

**关联**  
- `aim.link-v2/apps/web/src/components/app-chrome/TasksLeftRail.tsx`  
- `aim.link-v2/apps/web/src/components/app-chrome/README.md`  
- `aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/PROMPTS-LOG.md`

### 2026-04-20（aim.link-v2：修复 project-map SCSS 未定义 `$aimlink-web-text`）

**User（提示词/原意）**  
- Vite/Sass：`Undefined variable` `$aimlink-web-text`（`aimlink-web-project-map-port.scss`）。

**Assistant（实现后说明 / 本轮结论）**  
- 在该文件顶部定义与 **`aimlink-web-shell-layout.scss`** 一致的 **`$aimlink-web-*`** 变量（该样式由 **`root.tsx`** 独立引入，不继承 shell 文件中的变量作用域）。**`npm run build -w @aimlink/web`** 通过。

**关联**  
- `aim.link-v2/apps/web/src/styles/aimlink-web-project-map-port.scss`

---

### 2026-04-20（aim.link-v2：Project map 按业务逻辑实现编辑—保存闭环）

**User（提示词/原意）**  
- 不要只「抄样子」；先按业务逻辑理解原项目；先实现**可编辑保存**闭环；按业务逻辑对齐复用。

**Assistant（实现前说明，若有）**  
- 区分数据模型：独立 **Project-map** 用 **`workmap`** 元数据 + 编辑器内存树（导出 JSON，未见写回 `mind_map` 文档表）；v2 用 **`workspace_project_maps.mind_map_document`**。  
- 定 **`mind_map_document` v1** 契约并实现 **`mind-map-document.ts`**；首版编辑用与 **Project-map Text 模式**相同的大纲缩进算法；新增草稿编辑路由与 **Save**（带 `workspace_id` + `published_project_id IS NULL`）、**Discard**、干净状态下 **Publish**。

**Assistant（实现后说明 / 本轮结论）**  
- 代码与文档均在 **`aim.link-v2`** / **`Vouchap/docs`** 已列路径；**`npm run typecheck -w @aimlink/web`** 通过。

**关联**  
- `aim.link-v2/apps/web/src/lib/mind-map-document.ts`  
- `aim.link-v2/apps/web/src/pages/ProjectMapDraftEditorPage.tsx`  
- `aim.link-v2/apps/web/src/pages/ProjectMapPage.tsx`  
- `aim.link-v2/apps/web/src/App.tsx`  
- `aim.link-v2/docs/DATABASE-SCHEMA.md`、`docs/PRD.md`、`docs/PROMPTS-LOG.md`、`docs/COMPONENT-LIBRARY.md`、`apps/web/README.md`

---

### 2026-04-20（aim.link-v2：Project map 续作 — root 样式引入、Create 空标题、文档）

**User（提示词/原意）**  
- 对话续作（摘要）：核对 **`root.tsx`** 是否引入 **`aimlink-web-project-map-port.scss`**、类型检查、PRD/组件库/README；**Create** 允许空标题；页头标题样式类名与 **`h2`** 一致。

**Assistant（实现前说明，若有）**  
- 在 **`aim.link-v2`** 仓库：`root.tsx` 增加 project-map 端口样式 import；**`ProjectMapPage`** 去掉 Create 对空名的禁用；SCSS 页头选择器对齐 **`aimlink-project-map__header-title`**；跑 **`npm run typecheck -w @aimlink/web`**；更新 **`docs/PRD.md`**、**`docs/PROMPTS-LOG.md`**、**`docs/COMPONENT-LIBRARY.md`**、**`apps/web/README.md`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已按上项完成；类型检查通过。改动均在 **`aim.link-v2`**，**Vouchap** 代码无变更。

**关联**  
- `aim.link-v2/apps/web/src/root.tsx`  
- `aim.link-v2/apps/web/src/pages/ProjectMapPage.tsx`  
- `aim.link-v2/apps/web/src/styles/aimlink-web-project-map-port.scss`  
- `aim.link-v2/docs/PRD.md`、`PROMPTS-LOG.md`、`COMPONENT-LIBRARY.md`  
- `aim.link-v2/apps/web/README.md`

---

### 2026-04-20（aim.link-v2：重启测试服务器，仅保留一个实例）

**User（提示词/原意）**  
- 启动 `aim.link-v2` 项目的测试服务器；随后要求“关掉全部，重新启动一个”。

**Assistant（实现前说明，若有）**  
- 先检查当前终端中是否已有 `aim.link-v2` dev server 在运行，避免重复拉起；再停止相关 `npm run dev` / `vite` 进程，仅重启一个实例。

**Assistant（实现后说明 / 本轮结论）**  
- 已停止现有 `aim.link-v2` 开发进程，并在 `aim.link-v2` 根目录重新启动单一 dev server（`npm run dev`）。  
- 当前可访问地址：`http://localhost:5173/`。

**关联**  
- `aim.link-v2`（本轮为运行命令，无代码文件变更）

---

### 2026-04-20（Vouchap：receipt 分类提示词再增强——引入 entity 与票面上下文）

**User（提示词/原意）**  
- 提示词需进一步优化：准确判断 `category` 与 `attribution` 还需结合 receipt 的 `entity` 等票面其他可用信息。

**Assistant（实现前说明，若有）**  
- 继续在 `gemini.ts` 的 receipt 提示词层面增强判定约束，除 `name + itemAlias` 外，加入 receipt-level 语义信号（entity/merchant profile、税区线索、票面抬头关键词、支付账户线索、同单据 basket pattern）作为分类与归属决策依据。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新 `buildReceiptExtractionRules` 的分类规则：明确 `categoryName/attributionName` 需同时参考行级信息与票据级上下文，避免与商家/实体画像冲突；遇到单行歧义时，先结合同票据其他行与购物篮模式再判断。  
- 已更新 `recognizeReceiptFromText` 的文字识别 prompt，同步加入 entity 与票面上下文联合判定要求，保证图片/文档/文字路径规则一致。  
- 说明：当前 `gemini.ts` 存在两条历史类型断言 lint（`GeminiReceiptResult` 到 `Record<string, unknown>`），与本次提示词文本修改无直接关系，本轮未改动该逻辑。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`

---

### 2026-04-20（Vouchap：Web 生产 receipt 识别失败 + category/attribution 错分优化）

**User（提示词/原意）**  
- 连续在 Web 生产环境通过 chat 提交 receipt 图片识别失败；dev 环境可识别但 `category` 与 `attribution` 识别明显错误，要求优化提示词：在客户备选选项中结合 `item_alias` 一起判断。

**Assistant（实现前说明，若有）**  
- 排查 chat 上传链路后，优先处理两点：  
  1) Gemini Key 在生产注入占位符（如 `${EXPO_PUBLIC_...}`）时，现有判定可能误认为“有值”，导致请求失败；  
  2) receipt 提示词虽有候选列表，但对 `name` 与 `itemAlias` 联合判定约束不够强，导致错分。  
- 计划修改 `gemini.ts` 与 `tax-filing-recognition-run.ts` 的 key 安全校验，并增强 receipt extraction prompt 的分类/归属选择规则。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/shared-logic/gemini.ts`：新增 `getCurrentGeminiApiKey()`，统一过滤无效 key（空值、`placeholder-key`、`undefined`、包含 `${` 的占位符）；并在 receipt 相关入口（图片、文档、文本、supplier info）改为使用该安全函数，降低 Web 生产环境因占位符注入导致的识别失败。  
- `vouchap-app/src/shared-logic/tax-filing-recognition-run.ts`：同样补充无效 key 判定（含 `${`/`undefined`），避免 tax-filing 识别链路出现同类生产失败。  
- `vouchap-app/src/shared-logic/gemini.ts`：强化 receipt 提示词，明确 `categoryName` / `attributionName` 必须结合每行 `name + itemAlias` 联合判断；当 `name` 为 code-like 时优先参考 `itemAlias` 语义；优先命中客户备选项，仅在无合理匹配时新增值。  
- 已对改动文件执行 lints 检查，无新增 lint 错误。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`  
- `vouchap-app/src/shared-logic/tax-filing-recognition-run.ts`

---

### 2026-04-18（Vouchap：改币种保存失败且 items 被清空）

**User（提示词/原意）**  
- receipt 详情改币种时保存失败，随后 items 消失。

**Assistant（实现前说明，若有）**  
- 排查 `updateReceipt`：当 `receipt.items` 传入时先 `delete receipt_items`，再做插入与校验；若后续抛错会导致旧 items 已被删，出现“保存失败 + items 没了”。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/shared-logic/database.ts`：将 items 流程改为 **先校验并构造 payload，再删除旧行**；删除前先抓取 snapshot。若插入失败，执行 **best-effort 回滚**（把 snapshot 重插）并继续抛错，避免明细永久丢失。  
- 该修复不改变币种字段逻辑，仅修正失败路径的数据安全。

**关联**  
- `vouchap-app/src/shared-logic/database.ts`

---

### 2026-04-16（aim.link-v2：第二批20项连续执行（ProjectDetail/ProjectList/Task/Messages收口））

**User（提示词/原意）**  
- 要求继续并新增 20 项待办；强调“列 todo 是为了让助手连续工作”，并要求持续推进。

**Assistant（实现前说明，若有）**  
- 新建第二批 20 项复刻任务（replica2-01 ~ replica2-20），优先顺序：  
  1) Project Detail 二级导航/工具条/TaskList结构；  
  2) Project List list/card 细节；  
  3) Task list 头部与行内信息；  
  4) Messages 未读样式与时间布局；  
  5) 全局 icon/圆角/gap 收口与构建验证。  

**Assistant（实现后说明 / 本轮结论）**  
- 已完整执行并完成第二批 20 项，核心结果：  
  - `ProjectDetailPage`：新增旧版风格二级 subnav（WBS/Gantt/Process/Table/Kanban/TaskList/Overview/Files）；TaskList 增加列头与元信息图标（执行/审核/截止），行尾加入更多+进入动作；Table/Kanban/Files/MindMap/Overview 均加紧凑样式类并统一密度。  
  - `ProjectListPage`：list 模式加入列头条；每行增加左侧缩略占位块；右侧指标区尺寸/字段间距/进度条宽度精修；card 模式列宽、卡片高度与文字层级进一步贴近旧版。  
  - `TasksPage`：标题列改为“主标题 + 次级 chip（state/due）”双层信息，表格行高继续压缩。  
  - `MessagesPage`：未读行加 `news-box-item--unread`，标题字重与时间对齐更突出；dot 偏移位置调整。  
  - 全局：导航菜单与 operator item 圆角统一收口为 2px。  
- 质量：`npm run build -w @aimlink/web` 多次验证通过；lints 无新增报错。  

**关联**  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`  
- `aim.link-v2/apps/web/src/pages/ProjectListPage.tsx`  
- `aim.link-v2/apps/web/src/pages/TasksPage.tsx`  
- `aim.link-v2/apps/web/src/pages/MessagesPage.tsx`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-project-port.scss`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-task-port.scss`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-news-port.scss`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-app-shell.scss`

---

### 2026-04-16（aim.link-v2：20项复刻清单执行（导航/Todo/Task/Project/Timeline/Map））

**User（提示词/原意）**  
- 要求不要停下来，先按代码复刻实现；并要求助手自己列出 20 项待办后逐项完成。

**Assistant（实现前说明，若有）**  
- 建立 20 项执行清单并按模块推进：  
  1) 顶部导航与右侧工具区；  
  2) 左侧菜单统一密度；  
  3) Todo/Task/Project 的工具栏与列表结构；  
  4) Messages/Search/Timeline/Project map 页面骨架与信息流密度；  
  5) 最后进行 lint 与构建验证。  
- 计划触及：`components/pc40/*`、`pages/*`、`styles/saas-pc4-*.scss`、`styles/pc40-app.scss`。

**Assistant（实现后说明 / 本轮结论）**  
- 已执行并完成该 20 项清单，核心落地如下：  
  - 顶部导航补齐独立 `Timeline` 入口；`More` 菜单去重；右侧加入 `Help` / `Settings` 快捷图标并统一 icon/search 密度。  
  - Todo：左侧文案改为 `My To-Do / Pending execute / Pending review / Pending assign / Pending approve`；标题区、搜索/排序控件和列表行高进一步压缩到旧版密度。  
  - Task：工具栏收敛为 `Earliest End time / No Grouping / View / Save View / Search / Filter / Refresh / More` 的同层结构，列表行字体与内边距进一步紧凑。  
  - Activity（Timeline）：改为紧凑工具栏 + 自定义信息流列表（非 antd List 默认密度）。  
  - Project map：页面头部、Collapse、list card/tree 区统一紧凑布局与字号。  
- 质量验证：已执行 `npm run build -w @aimlink/web`，构建通过；lints 无新增报错。  

**关联**  
- `aim.link-v2/apps/web/src/components/pc40/Pc40NavHeader.tsx`  
- `aim.link-v2/apps/web/src/components/pc40/TodoLeftRail.tsx`  
- `aim.link-v2/apps/web/src/components/pc40/TaskOperateBlock.tsx`  
- `aim.link-v2/apps/web/src/pages/TodoPage.tsx`  
- `aim.link-v2/apps/web/src/pages/ActivityPage.tsx`  
- `aim.link-v2/apps/web/src/pages/ProjectMapPage.tsx`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-app-shell.scss`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-todo-port.scss`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-task-port.scss`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-dynamic-port.scss`  
- `aim.link-v2/apps/web/src/styles/pc40-app.scss`

---

### 2026-04-16（aim.link-v2：Timeline 主导航 + Activity 紧凑流 + Todo 侧栏文案）

**User（提示词/原意）**  
- 要求直接继续推进对齐。

**Assistant（实现前说明，若有）**  
- 对照旧版主导航结构：增加独立 **Timeline** 入口；**Activity** 页首 tab 改为 Timeline 并改为紧凑信息流；**Todo** 左侧与主区标题文案对齐截图中的英文菜单命名。

**Assistant（实现后说明 / 本轮结论）**  
- `Pc40NavHeader`：在 `Project` 与 `More` 之间增加 `Timeline`（`/app/activity`，`LineChartOutlined`），并从 `More` 菜单移除重复的 Activity 项。  
- `ActivityPage`：首 tab 文案改为 `Timeline`，内容区改为 `ant4-activity-workspace` 工具栏 + 自定义 `ant4-activity-feed` 列表行（hover、字号、边线）；样式追加在 `saas-pc4-dynamic-port.scss`。  
- `TodoLeftRail` / `TodoPage`：侧栏与 `NAV_TITLE` 更新为 `My To-Do`、`Pending execute/review/assign/approve`、`Work report`；占位提示文案同步。  
- `npm run build -w @aimlink/web` 已通过。

**关联**  
- `aim.link-v2/apps/web/src/components/pc40/Pc40NavHeader.tsx`  
- `aim.link-v2/apps/web/src/pages/ActivityPage.tsx`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-dynamic-port.scss`  
- `aim.link-v2/apps/web/src/components/pc40/TodoLeftRail.tsx`  
- `aim.link-v2/apps/web/src/pages/TodoPage.tsx`

---

### 2026-04-16（aim.link-v2：Messages / Search 页结构继续对齐 pc4.0）

**User（提示词/原意）**  
- 要求直接继续推进逐页对齐，不停顿。

**Assistant（实现前说明，若有）**  
- 在已完成 Projects 卡片收敛基础上，继续处理 `/app/messages` 与 `/app/search`：消息页增加紧凑变体类并收紧标题栏与列表行；搜索页从居中 Card+List 改为全宽双栏工作台布局与自定义结果行。

**Assistant（实现后说明 / 本轮结论）**  
- `MessagesPage` 根节点增加 `news-content--pc40-tight`，在 `saas-pc4-news-port.scss` 中覆盖标题栏高度、边距、字号及列表行内边距与详情字号。  
- `SearchPage` 移除 Ant `Card`/`List`，改为 `ant4-search-workspace` 双栏面板 + 结果列表行（hover、边框、链接样式）；样式写入 `pc40-app.scss`。  
- 已执行 `npm run build -w @aimlink/web`，构建通过。

**关联**  
- `aim.link-v2/apps/web/src/pages/MessagesPage.tsx`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-news-port.scss`  
- `aim.link-v2/apps/web/src/pages/SearchPage.tsx`  
- `aim.link-v2/apps/web/src/styles/pc40-app.scss`

---

### 2026-04-16（aim.link-v2：Projects 卡片视图按对照图收敛）

**User（提示词/原意）**  
- 继续具体对比当前与目标截图，指出差距依然很大，要求继续推进细化对齐。

**Assistant（实现前说明，若有）**  
- 重点收敛 `/app/projects` 的 card 模式结构差异：从“图文卡片墙”调整为目标图中的“紧凑纯文本项目卡”，并同步顶部操作栏文案细节（`Save View`）。  
- 修改 `ProjectListPage` 卡片 DOM 与 `saas-pc4-project-port.scss` 卡片样式体系。

**Assistant（实现后说明 / 本轮结论）**  
- 已将 project card 视图改为小尺寸纯文本卡：标题、摘要占位、时间、右上角设置按钮；收紧边框、阴影、字号与间距，去除原先大图感的视觉风格。  
- 已在项目操作栏左侧补 `Save View` 占位项，接近目标图工具条信息结构。  
- 本地构建验证通过（`npm run build -w @aimlink/web`），无新增 lint 报错。  

**关联**  
- `aim.link-v2/apps/web/src/pages/ProjectListPage.tsx`  
- `aim.link-v2/apps/web/src/components/pc40/ProjectOperatorBlock.tsx`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-project-port.scss`

---

### 2026-04-16（aim.link-v2：修复 Cloudflare 构建失败）

**User（提示词/原意）**  
- 提供 Cloudflare Pages 构建日志，报错为 `src/pages/ProjectDetailPage.tsx` 从 `antd` 导入了 `CaretRightOutlined`，导致打包失败，要求继续推进并修复。

**Assistant（实现前说明，若有）**  
- 先定位 `ProjectDetailPage` 导入源，将图标改为从 `@ant-design/icons` 导入，再执行 `npm run build -w @aimlink/web` 复现验证。

**Assistant（实现后说明 / 本轮结论）**  
- 已修复导入错误：`CaretRightOutlined` 从 `antd` 移除，改为 `@ant-design/icons` 正确来源。  
- 本地已验证 `@aimlink/web` 构建通过（Vite build 成功，产物输出完成）；当前仅剩 Sass legacy-js-api 的 deprecation warning，不影响发布。  

**关联**  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`

---

### 2026-04-16（aim.link-v2：Web 端 pc4.0 逐页对齐持续改造）

**User（提示词/原意）**  
- 继续把 UI 往 pc4.0 靠紧，默认先细抠 `/app/tasks`、`/app/projects`、`/app/messages`、`/app/search`；并明确反馈“菜单结构、文案、页面结构差距巨大”，要求助手不要停，自己逐页检查推进。  
- 用户提供多张对照截图（Task 主列表、Project 列表、Project 详情 TaskList）作为目标样式基准。

**Assistant（实现前说明，若有）**  
- 计划分两层推进：  
  1) 全局壳层（顶部导航、左侧菜单、操作栏密度）先做结构和文案收敛；  
  2) 逐页补列表行结构、信息层级和 hover/间距细节，优先 Project 列表与 Project 详情 TaskList。  
- 触及模块：`apps/web/src/components/pc40/*`、`pages/*` 与 `styles/saas-pc4-*.scss`。

**Assistant（实现后说明 / 本轮结论）**  
- 已完成并持续推进以下改造（本轮）：  
  - 顶部导航与左栏菜单结构重排（`Todo/Task/Project/More` + Task/Project 左栏分组文案收敛）。  
  - `ProjectDetailPage` 增加更接近截图的紧凑 TaskList 行：序号、标题、状态标签、逾期标签、执行人信息与右侧进入按钮。  
  - `ProjectDetailPage` 操作栏补齐 Search/Filter/More 入口占位，压缩间距与字号。  
  - `ProjectListPage` 列表行新增右侧指标区：Overdue、Completed/All 与进度条，向旧版项目行结构靠拢。  
  - 样式层新增 `ant4-project-detail` 与任务行密度规则，统一小字号、紧凑行高与 hover。  
- 已运行 lints，当前无新增 lint 报错。  
- 后续继续：按同样方式完成 `messages/search` 结构对齐，并继续做项目页细节收口（图标、间距、字段顺序、次级文字样式）。

**关联**  
- `aim.link-v2/apps/web/src/components/pc40/Pc40NavHeader.tsx`  
- `aim.link-v2/apps/web/src/components/pc40/TasksLeftRail.tsx`  
- `aim.link-v2/apps/web/src/components/pc40/ProjectLeftRail.tsx`  
- `aim.link-v2/apps/web/src/components/pc40/TaskOperateBlock.tsx`  
- `aim.link-v2/apps/web/src/components/pc40/ProjectOperatorBlock.tsx`  
- `aim.link-v2/apps/web/src/pages/TasksPage.tsx`  
- `aim.link-v2/apps/web/src/pages/ProjectListPage.tsx`  
- `aim.link-v2/apps/web/src/pages/ProjectDetailPage.tsx`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-app-shell.scss`  
- `aim.link-v2/apps/web/src/styles/saas-pc4-project-port.scss`

---

### 2026-04-14（Web：Todos 操作行 Hide 0-file / Hide Canceled 平铺居中）

**User（提示词/原意）**  
- Web 端的两个 hide，不需跟移动端一样收起到浮层，仍应平铺在操作行居中位置。

**Assistant（实现前说明，若有）**  
- `ProjectDetailView` 中 Todos 筛选当前为统一「筛选图标 + Modal」；Web 改为在 `todoFilterCenterSlot` 内联两个 checkbox行，移动端保持图标与浮层。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`：Web 且展示筛选时在中栏渲染 Hide 0-file / Hide Canceled；筛选图标与 `Modal` 仅 `isMobile`；Web 文案字号 12。  
- **验证**：Web 详情 Todos 操作行中间可见两项勾选；移动端仍为漏斗浮层。

**关联**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`

### 2026-04-14（Engagement Info 改税季后顶栏税季不刷新）

**User（提示词/原意）**  
- 在 engagement 详情 Info 页修改税季标签后，页面顶部标签未实时更新。

**Assistant（实现前说明，若有）**  
- Info 内 `ProjectInfoTab` 保存后会 `load()` 仅刷新卡片内状态；顶栏 `detailHeader` 依赖父组件的 `header` / `order` / `clientHeaderForDetail`，与 Realtime 无关时不会立刻重算。拟增加 `onSaved` 回调，在保存成功后由父级轻量拉取 `getOrderById` + `getOrderHeaderForClient` 更新顶栏。

**Assistant（实现后说明 / 本轮结论）**  
- `ProjectInfoTab` 增加可选 `onSaved`；保存 Hero / Classification / SaveAll及封面更新成功后 `await load()` 再 `onSaved`。  
- `ProjectDetailView` 增加 `onProjectInfoSaved` 并传入 `ProjectInfoTab`。  
- `tax-filing/project/[projectId]/index` 与 `firm/engagement/[id]` 实现 `refreshEngagementChrome` 并传入。  
- **验证**：Info 保存税季后无需整页刷新，顶栏税季 pill 应立即一致。

**关联**  
- `vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/info.tsx`  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/index.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`

### 2026-04-14（Realtime：除 Web DataTable 列表外尽量全覆盖）

**User（提示词/原意）**  
- 应用内各处，除了 web 端表格视图外，各处内容应都实现 realtime；核查各处并优化到位。

**Assistant（实现前说明，若有）**  
- 盘点已有 `postgres_changes`（收据/发票/库存、事务所 engagements 订单、TaxFilingTodosView 等）。缺口主要在：客户端报税首页列表、项目/订单详情顶栏与 Info、统一 engagement 路由、Line items 列表；并明确 Web 端 `DataTable` 列表不订阅（与费用等页一致），事务所 Engagements/Clients 列表在 Web 上关闭原始终端订阅。抽取共用订阅逻辑到 `engagement-realtime.ts` 减少重复。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `vouchap-app/src/mobile-ui/lib/engagement-realtime.ts`：`subscribeFirmOrderAndLinkedProject`、`useEngagementOrderProjectRealtime`、`subscribeClientSpaceTaxFilingOrders`、`useClientSpaceTaxFilingListRealtime`。  
- 报税客户端首页（移动 + Web网格/列表）：订阅 `firm.orders`（`client_space_id`）与 `public.projects`（`client_space_id`），防抖刷新列表。  
- `tax-filing/project/[projectId]/index`、`tax-filing/order/[orderId]/index`、`firm/engagement/[id]`：订单 + 关联 project 变更时防抖 `load`/`loadData`；`project/.../info`（ProjectInfoTab）额外订阅以便 Info 卡片与协作同步。  
- `firm/client/[clientSpaceId]`：仅 **非 Web** 且存在 `resolvedClientSpaceId` 时订阅该 client 的 `firm.orders`。  
- `firm/engagements`、`firm/clients`：Realtime 改为 **仅非 Web**（Web DataTable 不订阅）。  
- `receipt-items`：非 Web 下按空间订阅 `receipts` + `receipt_items` 防抖 `load`。  
- 费用/收入/库存列表注释统一为「Web DataTable 不启用」。  
- **验证**：两终端打开同一报税项目，一方改税季/状态，另一方列表与详情应约 300ms 内刷新；Web 事务所 Engagements/Clients 表格不因他人改单自动重排。  
- **残留**：`space-orders`（CRM RPC）、`chat-to-log`、Service Catalog SKU 库等未接 Realtime；若需可再按表加订阅。

**关联**  
- `vouchap-app/src/mobile-ui/lib/engagement-realtime.ts`  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/index.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/index.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/info.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`  
- `vouchap-app/src/mobile-ui/app/firm/client/[clientSpaceId].tsx`  
- `vouchap-app/src/mobile-ui/app/firm/engagements.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/clients.tsx`  
- `vouchap-app/src/mobile-ui/app/receipt-items.tsx`  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`（注释）  
- `vouchap-app/src/mobile-ui/app/invoices.tsx`、`inbound.tsx`、`outbound.tsx`（注释）

### 2026-04-14（客户端改税季保存无效：projects UPDATE RLS）

**User（提示词/原意）**  
- 已启动的项目，client 侧手动改税季标签，保存提示 Saved，刷新后标签未改。

**Assistant（实现前说明，若有）**  
- 核对保存链路与读回一致后，定位为 `public.projects` 的 `UPDATE` 策略仅允许 `firm.can_access_order(..., true)`，与已存在的 client 确认插入策略不对称；纯客户成员更新时 PostgREST 常表现为0 行更新且无 error，应用仍 toast Saved。拟补充 RLS 中与 `public_projects_insert` 客户端分支对称的 UPDATE 条件，并在 `updateProject` 用 `select` 校验影响行数。

**Assistant（实现后说明 / 本轮结论）**  
- 新增迁移 `vouchap-app/supabase/migrations/20260414173000_public_projects_update_client_space.sql`：扩展 `public_projects_update` 的 USING / WITH CHECK，允许「所属 client_space 成员 +订单与该 space 一致」的更新（与 insert 客户端路径一致）。  
- `vouchap-app/src/shared-logic/firm.ts` 中 `updateProject`：`.update(...).select('id')`，若返回空数组则返回明确错误，避免静默失败。  
- **验证**：对 processing 订单在客户端 Info 修改 Tax season 年份后刷新应持久；若未跑迁移则应看到权限类错误提示而非假 Saved。  
- **风险**：客户侧现可更新其项目行上凡策略允许的列（与 insert 范围一致）；若需列级收紧可后续拆策略或改用 RPC。

**关联**  
- `vouchap-app/supabase/migrations/20260414173000_public_projects_update_client_space.sql`  
- `vouchap-app/src/shared-logic/firm.ts`

### 2026-04-14（税季默认归属修正：5/1~次年4/30 归前一年）

**User（提示词/原意）**  
- 税季标签默认计算有误：`2025-05-01` 到 `2026-04-30` 启动的，应归属 `2025` 税季。

**Assistant（实现前说明，若有）**  
- 增加统一税季推导函数，替换各页面用 `new Date(...).getFullYear()` 的默认兜底，确保移动端列表、详情页以及创建项目的默认税季写入一致。

**Assistant（实现后说明 / 本轮结论）**  
- 新增统一规则函数：`deriveTaxSeasonYear()`（`vouchap-app/src/shared-logic/tax-season-colors.ts`）：  
  - `5/1 ~ 12/31 => 当年税季`  
  - `1/1 ~ 4/30 => 上一年税季`  
  - 示例：`2026-04-30 => 2025`，`2026-05-01 => 2026`。  
- 已替换默认税季兜底计算位置：  
  - `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`（mobile + web 列表）  
  - `vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/index.tsx`  
  - `vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/index.tsx`  
  - `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`  
  - `vouchap-app/src/shared-logic/firm.ts`（`getOrderYear` 与创建 project 时 `tax_season_year` 兜底）。  
- 已执行 lint 检查，相关文件无新增报错。

**关联**  
- `vouchap-app/src/shared-logic/tax-season-colors.ts`  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/index.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/index.tsx`  
- `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`  
- `vouchap-app/src/shared-logic/firm.ts`

### 2026-04-14（移动端详情顶行再微调：名称跟随税季标签）

**User（提示词/原意）**  
- 详情页顶行，engagement 名称跟随税季标签，不必与 firm 名称对齐。

**Assistant（实现前说明，若有）**  
- 调整 `ProjectDetailHeaderTitle` 的移动端布局，从“左右两列对齐”改为“按行跟随”：第一行税季+名称，第二行状态+firm 名称。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`：  
  - 移动端 `wrapMobile` 改为纵向两行结构；  
  - 第1行：`taxSeason` pill + `engagement title`；  
  - 第2行：`status` pill + `firm subtitle`；  
  - 因此 engagement 名称与税季标签同一行跟随显示，不再与 firm 名称做列对齐。  
- 已执行 lint 检查，无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`

### 2026-04-14（移动端列表标签规格统一：税季与状态同高同字号）

**User（提示词/原意）**  
- 税季标签和状态标签保持一样的高度和字号。

**Assistant（实现前说明，若有）**  
- 调整移动端 engagement 列表的 `taxSeasonPill` 规格，使其与 `statusBadge` 的高度/字号体系一致（同 `paddingVertical` 与相近圆角/内边距）。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`：  
  - `taxSeasonPill` 从 `paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999` 调整为  
    `paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12`；  
  - `taxSeasonText` 原本已为 `fontSize: 12, fontWeight: 600`，与状态标签文字规格一致，保持不变。  
- 已执行 lint 检查，无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`

### 2026-04-14（移动端列表二行对齐：firm 名称紧随状态标签）

**User（提示词/原意）**  
- 列表上的 firm 名称也左端对齐，跟随状态标签。

**Assistant（实现前说明，若有）**  
- 检查 `tax-filing/index.tsx` 的 mobile 列表第二行样式，移除使 `footerText` 右对齐的样式，改为自然跟随 `statusBadge` 左对齐排列。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`：`footerText` 去掉 `marginLeft: 'auto'`，并保留 `flexShrink: 1`，使 `by {firmName}` 紧随状态标签显示且可在窄屏时收缩。  
- 已执行 lint 检查，无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`

### 2026-04-14（移动端列表留白修正：Awaiting 标签仅替换进度条位）

**User（提示词/原意）**  
- 仍有额外高度，`Awaiting firm confirmation` 下方留空较大；应保持卡片高度一致，且标签替换 processing 状态进度条。

**Assistant（实现前说明，若有）**  
- 检查 mobile 列表渲染分支，定位 `awaitingFirmConfirmation` 情况下是否还渲染空的 `actionRow` 占位；改为该状态下不渲染 action 行，仅保留 progress 行中的 awaiting pill。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`：  
  - onboarding 操作区渲染条件调整为 `!awaitingFirmConfirmation`，避免 `actionRow` 空容器造成额外留白；  
  - `Awaiting firm confirmation` 仅占据 progress 区域（即原 processing 进度条位置）。  
- 已执行 lint 检查，无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`

### 2026-04-14（移动端 engagement 列表：Awaiting firm confirmation 进度位 pill 化）

**User（提示词/原意）**  
- 移动端 engagement 列表页，`Awaiting firm confirmation` 也需灰色 pill 样式，居中占据进度条位置。

**Assistant（实现前说明，若有）**  
- 在 `tax-filing/index.tsx` 的 mobile `renderItem` 分支中，将 `awaitingFirmConfirmation` 的纯文本替换为灰色 pill，并保持占位在 progress 行区域且居中。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`：  
  - `awaitingFirmConfirmation` 分支由文本改为 `progressLabelPill` + `progressLabelPillText`；  
  - 进度行增加 `progressRowCentered`，使该 pill 在原进度条位置居中显示。  
- 视觉与 Web 卡片中的灰色 pill 语义一致（灰底、圆角、居中）。  
- 已执行 lint 检查，无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`

### 2026-04-14（移动端详情顶栏二次微调：双列两行严格对齐）

**User（提示词/原意）**  
- 税季标签与状态标签左端对齐成两行，其右分别是 engagement 名称和 firm 名称。

**Assistant（实现前说明，若有）**  
- 继续在 `ProjectDetailHeaderTitle`（移动端分支）调整为明确网格：左列固定两枚标签（税季/状态）上下排列并左对齐；右列固定两行文本（名称/firm）上下对应。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`：  
  - 移动端标题区新增 `wrapMobile + mobileLeftCol + mobileRightCol` 结构；  
  - 左列：第一行税季标签、第二行状态标签（左端严格对齐）；  
  - 右列：第一行 engagement 名称、第二行 firm 名称（与左列两行一一对应）；  
  - 缺省场景加入占位高度，避免两行错位抖动。  
- Web 顶栏结构保持原样。  
- 已执行 lint 检查，无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`

### 2026-04-14（移动端 Engagement 详情：顶栏状态位置与 Todo 筛选浮窗）

**User（提示词/原意）**  
- 移动端 engagement 详情页：  
  1）engagement 状态标签放在顶行 firm 名称左端，与缩小的税季标签成两行（与列表页卡片布局一致）；  
  2）两个 hide 改为一个筛选 icon，点击后浮窗显示两个复选框。

**Assistant（实现前说明，若有）**  
- 仅改 `ProjectDetailView`：  
  - 调整 `ProjectDetailHeaderTitle` 的移动端结构与样式；  
  - 将操作栏中内联的两个 hide 复选项合并为 filter 图标入口；  
  - 新增轻量 modal 承载两个复选框，复用原筛选状态逻辑。

**Assistant（实现后说明 / 本轮结论）**  
- 顶栏（移动端）调整：  
  - 状态标签从 Todos/Info 行移除，放入导航标题第二行；  
  - 第二行布局为「状态标签 + firm 名称」，状态位于名称左端；  
  - 税季标签缩小为 compact 尺寸，与两行标题结构协调。  
- 筛选交互调整：  
  - 原 `Hide 0-file` / `Hide Canceled` 内联显示改为单一 `filter` 图标按钮；  
  - 点击后弹出 `Todo filters` 浮窗，内含两个复选框（状态与原逻辑一致）。  
- 代码文件：`vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`。  
- 已执行 lint 检查，无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`

### 2026-04-14（Engagement 详情二次优化：先渲染后补数 + 减少重复查询）

**User（提示词/原意）**  
- 感知优化有必要按你的思路实现，数据加载本身还需进一步找办法优化。

**Assistant（实现前说明，若有）**  
- 在 `firm/engagement/[id]` 落地两阶段加载：首屏仅依赖最小数据（order）先渲染，次要数据（header/todos/sku）后台补齐；并增加并发与去重，避免重复 `getOrderById`。  
- 同步把 client 侧详情路径中 `getOrderHeaderForClient` 的重复订单查询去掉，并把 onboarding SKU 请求并发化。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`：  
  - 新增两阶段加载（`loading` + `secondaryLoading`）；拿到 `order` 后立即渲染页面，后续数据异步补齐；  
  - 新增加载序列防抖（`loadSeqRef`）防止快速切换时旧请求回写；  
  - 非关键数据失败不再整页阻塞，改 toast 提示；  
  - 增加轻量角标 `Syncing details...` 反馈后台补数状态。  
- `vouchap-app/src/shared-logic/firm.ts`：  
  - `getOrderHeaderForClient(orderId, options)` 支持 `preloadedOrder`，避免重复订单读取。  
- `vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/index.tsx`：  
  - `getOrderHeaderForClient` 复用已加载 order；  
  - onboarding 下 `getSkuItems` 与 `getSkuById` 改并发。  
- `vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/index.tsx`：  
  - `getOrderHeaderForClient` 复用已加载 order。  
- 已完成 lint 检查，以上文件无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/index.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/index.tsx`  
- `vouchap-app/src/shared-logic/firm.ts`

### 2026-04-14（Engagement 详情页加载提速：并发与去重）

**User（提示词/原意）**  
- 打开 engagement 详情页加载速度很慢，需优化避免等待。

**Assistant（实现前说明，若有）**  
- 先定位阻塞点：`firm/engagement/[id].tsx` 的 `loadData` 存在串行请求与重复查询（client 路径下 `getOrderById` 被间接重复调用）。  
- 计划将可独立请求并发化，并让 `getOrderHeaderForClient` 支持复用已加载订单，减少一次重查询。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`：  
  - `getCurrentSpace` 与 `getOrderById` 改为并发请求；  
  - client 角色下调用 `getOrderHeaderForClient(orderId, { preloadedOrder: ord })`，避免重复读取同一订单；  
  - 非 onboarding 场景将 `getProjectDetail` 与 `getProjectTodosTree` 改为并发。  
- `vouchap-app/src/shared-logic/firm.ts`：  
  - `getOrderHeaderForClient` 新增可选参数 `options.preloadedOrder`，优先复用已获取的 `FirmOrderById`。  
- 已完成 lint 检查，修改文件无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`  
- `vouchap-app/src/shared-logic/firm.ts`

### 2026-04-14（Terminate engagement 二次确认改为统一浮窗）

**User（提示词/原意）**  
- terminate engagement 的二次确认，应采用我们设计的浮窗组件，不用系统的 alert。

**Assistant（实现前说明，若有）**  
- 仅替换「Terminate engagement」确认链路，不改 Reject 等其他确认流程；将 `window.confirm` / `Alert.alert` 分支统一为 `showConfirmDestructiveDialog`，确保 Web 与移动端一致走 `ConfirmModalHost`。

**Assistant（实现后说明 / 本轮结论）**  
- 已在以下页面将 terminate 二次确认切换为统一浮窗：  
  - `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`  
  - `vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/index.tsx`  
  - `vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/index.tsx`  
- 交互文案保持不变（`Terminate this engagement? You can't undo this.`），确认按钮为 destructive 样式且标签为 `Terminate`。  
- 已完成目标文件 lint 检查，无新增报错。

**关联**  
- `vouchap-app/src/shared-logic/confirmDialog.ts`  
- `vouchap-app/src/mobile-ui/components/ConfirmModalHost.tsx`

### 2026-04-14（Recycle bin 图标与标题垂直对齐微调）

**User（提示词/原意）**  
- icon 需与 Recycle bin 名称垂直对齐。

**Assistant（实现前说明，若有）**  
- 在 `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx` 的 mobile/web 回收站标题行中，检查文字外边距与 icon 样式；通过去除标题底部外边距并给 chevron 做轻量位移，保证视觉垂直居中。

**Assistant（实现后说明 / 本轮结论）**  
- mobile 与 web 的回收站 chevron 都增加 `recycleBinChevron` 样式（`marginTop: 1`），用于修正字体与图标字形基线差异。  
- web 端 `hiddenSectionTitle` 去掉 `marginBottom: 12`，避免标题文本外边距干扰同一行的垂直对齐。  
- 已做 lint 检查，目标文件无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`

### 2026-04-14（Recycle bin 折叠图标位置：跟随标题）

**User（提示词/原意）**  
- engagement 回收站展开/收起 icon 需跟随在 `Recycle bin` 名称之后，不要单独靠右。

**Assistant（实现前说明，若有）**  
- 调整 mobile 与 web 的 recycle bin header 行布局：从两端对齐改为左侧紧凑排列（title + chevron），保持可点击区域不变。

**Assistant（实现后说明 / 本轮结论）**  
- `tax-filing/index.tsx`：  
- mobile：`renderSectionHeader` 内回收站头部从 inline `space-between` 改为 `styles.recycleBinHeaderRow` 左对齐 + 间距；  
- web：`stylesWeb.recycleBinHeaderRow` 同步改为左侧紧凑布局。  
- 现在 icon 紧跟在 `Recycle bin` 文案后显示。

**关联**  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`

---

### 2026-04-14（Awaiting firm confirmation 视觉：灰底 pill + 居中）

**User（提示词/原意）**  
- `Awaiting firm confirmation` 需加与进度条灰色一致底色，显示为 pill，并在卡片上居中。

**Assistant（实现前说明，若有）**  
- 在复用进度位渲染的基础上，将纯文本改为灰底 pill；样式颜色与进度轨道 `#E9ECEF` 对齐，并在 card/list 进度容器中居中布局。

**Assistant（实现后说明 / 本轮结论）**  
- `ProjectListCardAndRow.tsx`：  
- 新增 `progressLabelPill` / `progressLabelPillText` 样式（灰底 `#E9ECEF`）；  
- card 端新增 `cardRowProgressCentered`，在进度区水平居中显示 pill；  
- list 端新增 `listProgressBlockCentered`，同样在右侧进度位居中显示 pill。  
- 数值进度条样式与行为不受影响，仅 `progressLabel` 场景显示 pill。

**关联**  
- `vouchap-app/src/mobile-ui/components/ProjectListCardAndRow.tsx`

---

### 2026-04-14（Awaiting firm confirmation 展示位微调：不覆盖 firm 名称、保持卡片高度）

**User（提示词/原意）**  
- `Awaiting firm confirmation` 需替换进度条位置，不替换原 firm 名称，且卡片高度保持不变。

**Assistant（实现前说明，若有）**  
- Web 共用组件 `ProjectListCardAndRow` 原本只有数值进度条，不支持“纯文案进度位”；临时放到 footer 会覆盖 `By firm`。  
- 计划新增 `progressLabel` 字段，复用原进度容器（cardRowProgress / listProgressBlock）渲染文案，以维持相同布局高度。

**Assistant（实现后说明 / 本轮结论）**  
- `ProjectListCardAndRow.tsx`：新增 `progressLabel`，在“无 action 且无数值进度”时，用原进度区容器显示该文案；列表右侧 `hasRightContent` 也纳入该字段。  
- `tax-filing/index.tsx`（web 映射）：`footerText` 恢复为 `By {firmName}`；将 `Awaiting firm confirmation` 通过 `progressLabel` 输出到进度区。  
- 结果：firm 名称保留，等待文案在原进度条位置显示，卡片/列表高度由原容器维持不变。

**关联**  
- `vouchap-app/src/mobile-ui/components/ProjectListCardAndRow.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`

---

### 2026-04-14（二次修复：详情页 onboarding 动作区与列表区展示位对齐）

**User（提示词/原意）**  
- 新创建单已有部分效果，但仍有问题：  
- 1）详情页内原双按钮位置应显示 `Terminate`；  
- 2）卡片/列表页原双按钮位置（processing 进度条区域）应显示标签 `Awaiting firm confirmation`。

**Assistant（实现前说明，若有）**  
- 定位到 `ProjectDetailView` 的通用动作渲染只支持 onboarding 双按钮或 processing terminate，缺少 onboarding-only-terminate 分支。  
- 列表页 `tax-filing/index.tsx` 里 marketplace onboarding 仍在 action 行渲染按钮，需要改为仅文字标签并放在进度区位置。

**Assistant（实现后说明 / 本轮结论）**  
- `ProjectDetailView.tsx` 新增 `showOnboardingTerminateOnly` 分支：在 onboarding 且无 `onAcceptAndStart` 但有 `onAbort` 时，web 顶栏与 mobile 底部都显示 `Terminate`。  
- `tax-filing/index.tsx`：  
- marketplace onboarding（`requestOrigin=client_marketplace`）不再渲染 action 按钮区；  
- 在原进度区位置显示 `Awaiting firm confirmation`；  
- web 卡片/列表映射同步改为 `action: null` 且 `footerText` 显示该文案。  
- 同时清理了中间引入的无用 `handleTerminateOrder` 分支，避免后续维护混淆。

**关联**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`  
- `vouchap-app/src/shared-logic/firm.ts`

---

### 2026-04-14（修复：详情页 Engagement not found + 列表仍双按钮）

**User（提示词/原意）**  
- 改出问题：卡片/列表仍双按钮；详情页进不去提示 Engagement not found。  
- 卡片/列表进度条区域需显示 `Awaiting firm confirmation`。

**Assistant（实现前说明，若有）**  
- 判断为两类问题：  
- 1）详情页读取 `firm.orders` 新字段时，若 DB 尚未迁移会因列不存在返回空，导致 `Engagement not found`；  
- 2）列表页（mobile/web）尚未按 `requestOrigin=client_marketplace + onboarding` 分支渲染按钮与进度区文案。

**Assistant（实现后说明 / 本轮结论）**  
- `getOrderById` 增加向后兼容 fallback：若新列不存在，自动回退 legacy select，确保详情页可打开。  
- `tax-filing/index.tsx`（mobile/web）新增 `isAwaitingFirmConfirmation(order)`：  
- 该类单在 onboarding 时改为 **单按钮 Terminate**；  
- 原 `Reject + Accept and Start` 仅保留给非该类 onboarding；  
- 进度条区域（无 task 进度时）显示 `Awaiting firm confirmation`。  
- Web 列表映射 `orderToItemWeb` 同步了上述分支。

**关联**  
- `vouchap-app/src/shared-logic/firm.ts`  
- `vouchap-app/src/mobile-ui/app/tax-filing/index.tsx`

---

### 2026-04-14（client 侧 marketplace onboarding 操作按钮改为仅 Terminate）

**User（提示词/原意）**  
- 这类 onboarding 在 client 侧不应再显示 reject / accept and start，应类同 processing 状态显示 terminate。

**Assistant（实现前说明，若有）**  
- 目标仅针对 `request_origin=client_marketplace` 的 onboarding 单；保留其它 onboarding（例如非 marketplace 场景）现有行为。  
- 详情页涉及两处：`/firm/engagement/[id]` 与 `tax-filing/order/[orderId]` 的头部动作区。需补齐 `getOrderById` / client 列表模型中的 `request_origin` 映射。

**Assistant（实现后说明 / 本轮结论）**  
- `firm.ts`：`FirmOrderById`、`getOrderById`、`getClientOrdersForClientSpace` 增加 `requestOrigin/clientConfirmedAt/firmConfirmedAt` 映射。  
- `firm/engagement/[id].tsx`：若 `viewerRole=client && status=onboarding && requestOrigin=client_marketplace`，隐藏 `Reject` / `Accept and Start`，显示 `Terminate`（复用 `onAbort`）。  
- `tax-filing/order/[orderId]/index.tsx`：同条件下，header 右侧从 `Reject + Accept` 改为单个 `Terminate`。  
- **验证**：client 打开 marketplace 创建的 onboarding 单时仅见 `Terminate`；processing 仍为 `Terminate`；其余 onboarding 场景不受影响。

**关联**  
- `vouchap-app/src/shared-logic/firm.ts`  
- `vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/index.tsx`

---

### 2026-04-14（Marketplace 客户自助创建 engagement 需 firm 二次确认）

**User（提示词/原意）**  
- client 端通过 service marketplace 自行创建的 engagement，需要 firm 侧确认后才能进入 processing；client 侧流程不变（浏览 marketplace → 选择并确认 → 同意协议）。

**Assistant（实现前说明，若有）**  
- 新增 `firm.orders` 来源字段区分 `client_marketplace` 与 `firm_manual`；客户端同意后只做 client-confirm 标记，不直接切到 processing。  
- 加 DB 触发器兜底：`client_marketplace` 订单从 onboarding 到 processing 必须由 firm 空间成员执行；并重写 `firm.client_create_onboarding_order_from_published_sku` 写入来源字段。  
- App 侧 `confirmOrderAndCreateProjectTodos` 保持现有入口与调用路径不变，仅改状态推进规则。

**Assistant（实现后说明 / 本轮结论）**  
- 新增迁移：`vouchap-app/supabase/migrations/20260414171000_client_marketplace_requires_firm_confirmation.sql`：  
- `firm.orders` 增加 `request_origin`、`client_confirmed_at`、`firm_confirmed_at`；  
- marketplace RPC 插入订单时写 `request_origin='client_marketplace'`；  
- 新触发器 `firm.enforce_marketplace_order_firm_confirmation`：拦截 client 将 marketplace 单直接改为 processing。  
- App 逻辑：`confirmOrderAndCreateProjectTodos` 在 `client_marketplace + client身份` 场景仅写入 `client_confirmed_at`（保持 onboarding）；firm 再次点击 Start 才推进 processing，并写 `firm_confirmed_at`。  
- UI 文案微调：client 成功后 toast 由 `Engagement accepted` 改为 `Request submitted`。

**关联**  
- `vouchap-app/supabase/migrations/20260414171000_client_marketplace_requires_firm_confirmation.sql`  
- `vouchap-app/src/shared-logic/firm.ts`、`vouchap-app/src/shared-logic/types/index.ts`、`vouchap-app/src/mobile-ui/app/firm/engagement/[id].tsx`

---

### 2026-04-14（更正 itemAlias 语义：保留原始 name，别称独立入库）

**User（提示词/原意）**  
- 指出「item 可读别称」需求应为：原始 item 名称保留识别结果，另拟别称并保存入库，不应替换原始名称。

**Assistant（实现前说明，若有）**  
- 调整方向：把 `itemAlias` 从“可能覆盖 name”改为“独立字段”；补 DB 字段与读写链路（receipt + invoice），确保 name 原样保留。

**Assistant（实现后说明 / 本轮结论）**  
- 语义修正：`resolveReadableItemName` 改为始终保留原始 `name`，仅在识别到可读别称时附带 `itemAlias`。  
- 数据库迁移：新增 `receipt_items.item_alias`、`invoice_items.item_alias`（`20260414170000_add_item_alias_to_receipt_invoice_items.sql`）。  
- 写入链路：`database.ts`（receipt）与 `invoices.ts`（invoice）保存 `item_alias`。  
- 读取链路：`database.ts` 与 `invoices.ts` 返回 `itemAlias` 到前端模型。  
- 转换层：`receipt-helpers.ts` 保留原始 item `name`，并传递 `itemAlias`。  
- 验证：相关改动文件 lint 通过，无新增报错。

**关联**  
- `vouchap-app/supabase/migrations/20260414170000_add_item_alias_to_receipt_invoice_items.sql`  
- `vouchap-app/src/shared-logic/gemini.ts`  
- `vouchap-app/src/shared-logic/receipt-helpers.ts`  
- `vouchap-app/src/shared-logic/database.ts`  
- `vouchap-app/src/shared-logic/invoices.ts`

---

### 2026-04-14（专项优化：Receipt/Invoice 选项匹配、明细别称、Tax Filing 识别完整度）

**User（提示词/原意）**  
- 要求专项优化大模型 prompt，并按结果效果提出三点：  
  1) receipt/invoice 的 items.category 与 attribution 更准确匹配候选列表，降低“按频次排序”造成的偏置；  
  2) 对可读性弱的 receipt item（SKU/缩写）增加可读别称输出；  
  3) tax filing 识别更完整，提升 doc_type 关键词质量与 task 匹配度。  
- 要求分析后直接改代码，并兼顾模型效率与稳定性。

**Assistant（实现前说明，若有）**  
- 方案：优先做“低成本高稳定”改动，不引入额外模型调用轮次。  
- 实施路径：  
  - 在 `gemini.ts` 强化 prompt 指令与输出 schema，并增加轻量后处理（排序去偏、可读名称兜底）；  
  - 在 `types/index.ts` 扩展 `itemAlias` 字段类型；  
  - 在 `receipt-helpers.ts` 兼容 `itemAlias`，在名称疑似编码时优先采用别称；  
  - 在 `tax-filing-recognition-prompt.ts` 与 `tax-filing-recognition-run.ts` 提升 doc_type 识别颗粒度与关键字结构化输出。

**Assistant（实现后说明 / 本轮结论）**  
- 已完成三项优化并落地代码：  
  1. **category/attribution 匹配优化**：  
     - Prompt 增加“语义优先、列表顺序非优先、频次仅弱 tie-breaker”规则；  
     - 候选列表改为去重+字母序（`toUnrankedOptionList`），降低 usage 频次排序诱导。  
  2. **item 可读别称**：  
     - 增加 `itemAlias` 输出约束（receipt/invoice）；  
     - 新增 `resolveReadableItemName` / `looksCrypticItemName`，对编码化 item 名称自动采用可读别称；  
     - `receipt-helpers.ts` 保存前做兼容兜底。  
  3. **tax filing 完整性增强**：  
     - Prompt 强化 doc_type 分层识别规则（辖区+精确表单+变体）；  
     - 输出 schema 增加 `doc_type_keywords`，并要求 `extracted_data` 包含 `document_identity/parties/period/raw_identification_tokens`；  
     - 运行层将 `doc_type_keywords` 归一并回填到 `extracted_data`（若缺失）。  
- 稳定性/效率：未新增模型轮次，仅调整单次提示词与本地轻量后处理，延迟增量可控。  
- 已检查改动文件 lint：无新增报错。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`  
- `vouchap-app/src/shared-logic/receipt-helpers.ts`  
- `vouchap-app/src/shared-logic/tax-filing-recognition-prompt.ts`  
- `vouchap-app/src/shared-logic/tax-filing-recognition-run.ts`  
- `vouchap-app/src/shared-logic/types/index.ts`

---

### 2026-04-14（识别类 Prompt 种类盘点：receipt / tax filing 及其他）

**User（提示词/原意）**  
- 追问「我问的是有多少种提示词，比如 receipt 识别和 tax filing 文件识别是分别的，还有否其他的。」

**Assistant（实现前说明，若有）**  
- 无代码变更；在 `vouchap-app/src/shared-logic` 检索所有实际构造 AI prompt 的入口，区分「独立模板」与「同模板多入口（图/文/音/文档）」。

**Assistant（实现后说明 / 本轮结论）**  
- 识别/抽取相关 prompt 可归纳为 9 类：Receipt 主识别、SupplierInfo 补充识别、Invoice 主识别、TaxFiling 结构化识别、Tax task matcher（任务归类）、Inbound 主识别、Outbound 主识别、Inbound/Outbound 文档引导、语音转写（供入/出库语音前置）。  
- 其中存在明显组合关系：如 Receipt=Intro+Rules（图片/文档共用规则）、TaxFiling=Base+Scenario+Context/TaskList/UserInstructions、Inbound/Outbound 文档=DocumentIntro+Rules+Example；语音场景部分是独立 prompt，部分走“先转写后复用文字 prompt”。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`  
- `vouchap-app/src/shared-logic/tax-filing-recognition-prompt.ts`  
- `vouchap-app/src/shared-logic/tax-filing-recognition-run.ts`  
- `vouchap-app/src/shared-logic/tax-filing-task-matcher.ts`

---

### 2026-04-14（系统内 Prompt 结构与组合关系分析）

**User（提示词/原意）**  
- 「给我分析一下现在系统内prompt的结构，分多少处提示词，相互之间有否组合？」

**Assistant（实现前说明，若有）**  
- 无代码变更；基于本轮会话注入上下文，按层级梳理提示词来源、优先级与组合执行方式。

**Assistant（实现后说明 / 本轮结论）**  
- 结论：当前会话内可识别为约 7 类提示来源（系统层、开发者工具层、开发者执行规范层、工作区常驻规则层、用户规则层、运行时上下文层、用户当前请求层）。  
- 组合方式并非字符串拼接，而是「分层约束叠加 + 优先级裁决」：高优先级（系统/开发者）约束执行边界，中低层（工作区规则/用户规则）约束风格与项目习惯，运行时上下文动态补充事实，最终由本轮用户请求触发具体任务。
- 已向用户输出结构化说明（含各层作用、冲突时处理顺序、当前会话实例）。

**关联**  
- `docs/PRD-SOURCE-LOG.md`

---

## 书写格式（复制以下块追加到「记录」区）

```markdown
### YYYY-MM-DD（可选：短标题）

**User（提示词/原意）**  
- …尽量保留原话；过长可摘要并注明「节选」。

**Assistant（实现前说明，若有）**  
- …本轮计划、前置假设、预计修改路径或文件。

**Assistant（实现后说明 / 本轮结论）**  
- …实际改动摘要、如何验证、已知限制；若未改代码，则写问答/结论要点。

**关联（可选）**  
- 路径 / PR / Issue：…  
- PRD REQ（仅当涉及时）：REQ-…  

---
```

---

## 记录

### 2026-04-02（建立 PRD 溯源日志机制）

**User（提示词/原意）**  
- 定一个规则：后续我的提示词，和你的理解内容，都要存到一个文件中，用于以后整理 PRD。

**Assistant（实现前说明，若有）**  
- 新建 `docs/PRD-SOURCE-LOG.md` 模板与首条记录；新增 `alwaysApply` 规则；在 `.cursorrules` 增加指向。

**Assistant（实现后说明 / 本轮结论）**  
- 首版写入策略：以「产品/PRD 相关或明确要求记下」为主，纯无产品语义的排错可跳过；模板为 User + Assistant + 关联。  
- （注：随后在同日第二条需求中已扩大为**全量**提示词与实现前后说明，见下一条。）

**关联**  
- 规则文件：`.cursor/rules/prd-source-log.mdc`  
- 正式 PRD：`docs/PRD-Vouchap-Platform-And-Marketing-Site.md`  
- 原始导出归档：`docs/PRD-Appendix-B-User-Prompts-Full-Corpus.md`  

---

### 2026-04-02（扩大日志范围：非 PRD 提示词 + 实现前后说明）

**User（提示词/原意）**  
- 不涉及 PRD 的所有提示词，以及你在实现代码前后的回复说明，都要纳入这个文档。

**Assistant（实现前说明，若有）**  
- 将更新 `docs/PRD-SOURCE-LOG.md` 的标题与用途说明；重写 `.cursor/rules/prd-source-log.mdc`：取消「仅 PRD 相关才记」的豁免为主流逻辑；要求凡有实质对话即追加，且**改代码**时必须写清实现前/后；极短无信息回合可略。同步改 `.cursorrules` 对应 bullet。

**Assistant（实现后说明 / 本轮结论）**  
- 已落实：日志定位为「全量对话+实现溯源」；规则 `alwaysApply` 下默认每条实质任务结束都追加；模板拆分「实现前 / 实现后」。PRD 合并仍为可选后续工作，与本全量日志并行。

**关联**  
- `.cursor/rules/prd-source-log.mdc`、`docs/PRD-SOURCE-LOG.md`、`/Users/macbook/Vouchap/.cursorrules`  

---

### 2026-04-01（Client 侧按已发布 Service Catalog 发起 engagement）

**User（提示词/原意）**  
1. client 端 tax filing 模块增加 add，样式和交互复用 firm 侧 service catalog 的 add template。  
2. 增加 published 的 Service Catalog 展示页，展示各 firm 的 template_status 为 published 的模板；列表复用 firm 侧 service catalog 列表。

**Assistant（实现前说明，若有）**  
- DB：client 非 firm 成员无法 `INSERT firm.orders`；新增 `firm.list_published_skus_for_client_catalog`、`firm.client_create_onboarding_order_from_published_sku`（SECURITY DEFINER），并限制调用者须为 `spaces.kind=client` 的成员。  
- UI：抽出 `ServiceCatalogShared`（`firmSkuToProjectListItem` + 与 firm 一致的「虚线 Add」入口组件），firm `service-catalog` 改为引用；client 新路由 `tax-filing/service-catalog`；`tax-filing/index` 增加「Add from catalog」入口（Web 列表/网格首行、移动端 `ListHeaderComponent`）。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移：`vouchap-app/supabase/migrations/20260401120000_client_published_catalog_rpc.sql`。  
- 逻辑：`firm.ts` 中 `getPublishedSkusForClientCatalog`、`clientCreateOnboardingOrderFromPublishedSku`（`supabase.schema('firm').rpc`）。  
- 类型：`FirmSku` 增加可选 `firmName`。  
- 选中模板后确认浮窗 → 建 onboarding 订单 → `router.replace` 至 `/firm/engagement/:id`。  
- **验证**：`supabase db push` 或等价应用迁移后，以 client 空间登录 → Tax Filing → Add from catalog → 选模板 → 应在列表出现新 onboarding；无迁移则 RPC 不存在会报错。

**关联**  
- `vouchap-app/src/mobile-ui/app/tax-filing/service-catalog.tsx`、`firm/service-catalog.tsx`、`components/ServiceCatalogShared.tsx`、`tax-filing/index.tsx`、`_layout.tsx`

---

### 2026-04-01（Published Services 仅含真正 Published 模板）

**User（提示词/原意）**  
- client 端 Published Services 不应出现角标为 Private 的 template，只应展示各 firm 已 published 的。

**Assistant（实现后说明 / 本轮结论）**  
- 根因：`is_sku_published_catalog` 曾允许 `is_published=true` 且 `template_status<>'draft'`，会把 **private** 等状态混入。  
- 修复：**仅当** `template_status = 'published'` **且** `is_published = true` 才视为目录可见；已更新 `20260401120000_*.sql` 并新增 `20260401123000_strict_published_catalog_template_status.sql` 便于已部署库 `migrate up`。

---

### 2026-04-01（Client Service Marketplace：搜索与筛选）

**User（提示词/原意）**  
- Client 端 Published Services 应体现为 **Service Marketplace**；增加 **筛选、搜索**，便于 client 主动找合适服务。

**Assistant（实现后说明 / 本轮结论）**  
- 导航标题与入口：`Service Marketplace`（Stack title、`ServiceCatalogAddEntryTile` 文案）；页面副标题与说明改为 marketplace 语境。  
- **搜索**：对 name、description、firmName、taxCountry、taxScenario、tags 合并字符串做不区分大小写子串匹配（全客户端过滤，数据仍来自现有 RPC）。  
- **筛选**：横向 chips — **Provider**（firm 名）、**Jurisdiction**（tax_country）、**Scenario**（tax_scenario），含 All；有 **Clear filters** 与「x of y services」计数。  
- 文件：`tax-filing/service-catalog.tsx`、`_layout.tsx`、`tax-filing/index.tsx`。

---

### 2026-04-01（Service Marketplace：对齐 Engagements 筛选交互、去掉 Provider 筛选）

**User（提示词/原意）**  
- 筛选搜索的交互复用 firm 端 engagements 模块设计；**不要 Provider 筛选**（发布者会很多）。

**Assistant（实现后说明 / 本轮结论）**  
- **工具条**：与 `firm/engagements` 一致的 **Filter（分类维度的浮层）+ Search**；Web 用 portal + `service-marketplace-filter-*` 的 DOM id 与外部点击关闭。  
- **分类**：`firm-classification-dimensions` 增加 SKU 维度的 `collectClassificationOptionsForSkuDim`、`skuMatchesClassificationDimFilters` 等（税季在目录行暂无字段时 season 为空）；**EngagementClassificationFilterChips** 抽到 `@/components/EngagementClassificationFilterChips`，engagements 改为引用。  
- **移除**：Provider 横向 chips；保留 firm 名在搜索 haystack 中可搜到。  
- 文件：`firm-classification-dimensions.ts`、`EngagementClassificationFilterChips.tsx`、`firm/engagements.tsx`、`tax-filing/service-catalog.tsx`。  
- **后续**：筛选浮层定位 — Web 改为 `filterAnchorRef` + `measureInWindow` 并监听 window scroll/resize；Native 将下拉移入 Filter 外层 `groupWrap`（`alignSelf: 'flex-start'`），避免相对整条 toolbar `left: 0` 贴左上角。  
- **UI**：去掉结果统计与「Service templates」/页内说明文案；网格与列表切换移至筛选搜索行最左侧。  
- **Marketplace**：不展示模板 Draft/Private/Published 角标与状态 pill；收藏复用 Tax Filing 置顶持久化模式（`service_marketplace_favorite_sku_ids`），列表排序 favorites 在前；卡片/列表行用星标 `pinAppearance="favorite"`。  
- **Tax Filing**：Client「Service Marketplace」入口由列表顶部改为 **紧跟在已有 engagements 之后**（移动端 Active section 末行；Web grid/list 亦为订单之后）；首屏加载中仍走原 ListEmpty 逻辑。  
- **Marketplace 下单**：两步 — `MarketplaceServiceSelectionModal`（确认选择、突出 firm / template、说明订单与邮件跟进）；通过后打开既有 `EngagementConsentModal` 勾选条款再 `clientCreateOnboardingOrderFromPublishedSku`。

---

### 2026-04-03（Tina 报税附件：优化 AI 识别提示词，减少 task 错位）

**User（提示词/原意）**  
- 提交给 Tina 的文件，AI 识别提示词需优化；明确的税务资料不能识别内容与类型，导致与 task 关联错位。

**Assistant（实现前说明）**  
- 预匹配：`tax-filing-task-matcher.ts` 提示词过简、缺少易混表单区分与场景聚焦；识别：`tax-filing-recognition-prompt.ts` 在提供 todoContext 时要求「优先按当前分类」，会在预匹配错误时强化误判。  
- 计划：扩展 matcher / recognition 的表单清单与识别协议；将 todoContext 标为「provisional」并明确 trust document + `suggested_task_id`；task list 区块强调按 doc_type 纠正；chat 上传时向 matcher 传入 `fileName` 作弱线索。

**Assistant（实现后说明 / 本轮结论）**  
- **Matcher**：增加 `fileName` 可选字段；重写 `buildTaskMatcherPrompt`（表头/编号读取步骤、T1/T2/1040/1120 场景聚焦、加拿大/美国常见表单与混淆项、标题含精确 form code 优先）。  
- **Recognition**：`BASE_SYSTEM_PROMPT` 改为 identification-first 与具体 `doc_type` 命名；扩展 T1/T2/1040/1120-S 场景块（T4A 家族、RL-1、T5008、多类 1099/1098、K-1 等）；todo + taskList 文案改为「自动化路由可能错误」并强制定位 `suggested_task_id` 纠错逻辑。  
- **chat-to-log**：`classifyTaxDocumentAndPickTask` 的 `projectContext` 增加 `fileName`。  
- **验证**：在真实项目中向 Tina 上传 T4 vs T4A、1099-INT vs 1099-DIV 等易混图；观察首跳 task 与识别完成后是否通过 `suggested_task_id` 纠正。**限制**：非图片附件仍走 fallback task，未调用 vision matcher（既有行为）。

**关联**  
- `vouchap-app/src/shared-logic/tax-filing-task-matcher.ts`、`tax-filing-recognition-prompt.ts`、`src/mobile-ui/app/chat-to-log.tsx`

---

### 2026-04-03（Tina：项目分类标签注入 AI 提示词 + task 列表）

**User（提示词/原意）**  
- 需要把所在 project 的分类标签内容提取出来，植入提示词，结合 task 名称列表，以便更明确当前识别文件的候选类型。

**Assistant（实现前说明）**  
- 列表 pills 对应 `projects.tax_country`、`tax_scenario`、`tax_season_year`、`tags`；`getProjectById` 已含这些字段；附件上下文 RPC `getProjectTodoAttachmentWithContext` 原先只取 tax_country/tax_scenario，需补 tags、tax_season_year。  
- 新增共享函数生成去重标签数组；`TaxDocumentTaskMatcherContext` 与 `TaxFilingProjectContext` 增加可选 `classificationLabels`；matcher / recognition 提示词增加「Engagement classification」并与 TASK LIST 联动说明。

**Assistant（实现后说明 / 本轮结论）**  
- 新文件 `tax-filing-project-classification-labels.ts`：`classificationLabelsForTaxFilingPrompt`。  
- `firm.getProjectTodoAttachmentWithContext` 的 project 增加 `tags`、`taxSeasonYear` 查询与返回。  
- `tax-filing-task-matcher`： prompts 内增加 engagement 区块。  
- `tax-filing-recognition-prompt`：Current context 与 task list 段落引用分类标签。  
- `chat-to-log`、`tax-filing-attachment-followup`、`TaxFilingTodosView` 识别调用处传入 `classificationLabels`。  
- **验证**：任一同步了 tags/税年的 project 走 Tina 上传，抓包或日志可见 prompt 中含标签 + task 标题；附件重试识别同样带标签。

**关联**  
- `vouchap-app/src/shared-logic/tax-filing-project-classification-labels.ts`、`firm.ts`、`tax-filing-task-matcher.ts`、`tax-filing-recognition-prompt.ts`、`chat-to-log.tsx`、`tax-filing-attachment-followup.ts`、`TaxFilingTodosView.tsx`

---

### 2026-04-03（项目 Classification：以 projects 为编辑源，初始来自 template/order）

**User（提示词/原意）**  
- project 的 classification 标签应可编辑；初始来自 order 关联的 firm 模板；后续双方可改；保存在 projects 表。

**Assistant（实现前说明）**  
- DB 已有 `projects_fill_tax_fields_from_order`、订单从 SKU 填税字段；但 firm 端 Info 之前改 classification 只写 `updateOrderClassificationByLabelNames`，展示又混用 order 与 project；需统一读写 `projects`，并与订单列表用的 text/tags 对齐。  
- 新增迁移：project UPDATE 时把 `tags` 同步到 `firm.orders.tags`（原有触发器只同步 tax_country/scenario/year）。

**Assistant（实现后说明 / 本轮结论）**  
- **迁移** `20260403120000_sync_project_tags_to_order.sql`：扩展 `sync_project_tax_fields_to_order`，在 `tags` 变更时同步到订单；触发列为 `tax_country, tax_scenario, tax_season_year, tags`。  
- **confirmOrderAndCreateProjectTodos**：insert project 不再手写 tax_country/scenario（由触发器从 order 复制）；保留名称/封面来自 SKU；订单无 `tax_season_year` 时用 due_at/created_at 年写入 project 兜底。  
- **getProjectByOrderId**：select/返回增加 `tags`。  
- **info.tsx**：加载与展示分类均以 **project** 为准；**client** 开放 Classification 铅笔与编辑（税季、jurisdiction、scenario、自定义标签）；**firm** 保存时先 `updateProject` 分类再 `updateOrderClassificationByLabelNames`（保留标签维度与列表）；自定义标签只读展示 `project.tags`。  
- **验证**：客户确认订单后检查 project 税字段与 order/SKU 一致；client/firm 编辑保存后 Tina/列表与 `projects` 一致；跑迁移后改 project tags 应回写 order.tags。

**关联**  
- `supabase/migrations/20260403120000_sync_project_tags_to_order.sql`、`firm.ts`、`src/mobile-ui/app/tax-filing/project/[projectId]/info.tsx`

---

### 2026-04-03（Firm SKU 模板 Info：自定义标签 + custom_label_ids）

**User（提示词/原意）**  
-（会话续接）firm 端 `skus` 表有 `custom_label_ids`，应在 template 的 Info 页支持维护自定义标签。

**Assistant（实现前说明）**  
- `getSkuById` / `fetchSkuHeaderFromTable` 需拉取 `firm_space_id`、`custom_label_ids`，展示名优先按 id 解析 `firm.order_labels`（与订单侧一致）；`updateFirmSku` 在写入 `tags` 时用 `ensureOrderLabelIdsByNames(..., 'custom')` 同步 `custom_label_ids`。  
- UI：在 `firm/sku/[skuId].tsx` 的 Classification 卡片增加与 project info firm 模式类似的 Custom labels 多选 + 内联新增，英文文案。

**Assistant（实现后说明 / 本轮结论）**  
- **`firm.ts`**：`FirmSkuHeader` 增加 `firmSpaceId`；`fetchSkuHeaderFromTable` select 含 `custom_label_ids` / `firm_space_id`，标签展示优先按 `custom_label_ids` 顺序解析名称，否则回退 `tags` 文本列；`updateFirmSku` 在 `payload.tags` 有值时解析 firm 空间、`ensureOrderLabelIdsByNames` 后同时更新 `tags` 与 `custom_label_ids`。  
- **`[skuId].tsx`**：加载 `getFirmOrderLabelsByDimension(..., 'custom')`；编辑态 pills + Add label 输入；保存时合并 `tagInput` 并入 `updateFirmSku` 的 `tags`。  
- **验证**：firm 成员打开某一 Service Template → Info → Edit info，增删自定义标签并 Save；DB `firm.skus.tags` 与 `custom_label_ids` 与 `order_labels` 一致；新建订单应从 SKU 复制到订单（既有流程）。

**关联**  
- `vouchap-app/src/shared-logic/firm.ts`、`vouchap-app/src/mobile-ui/app/firm/sku/[skuId].tsx`

---

### 2026-04-03（核实：skus/orders 文字列是否已弃用、仅 label_id）

**User（提示词/原意）**  
- 核实 `skus`、`orders` 上的文字字段（`tax_country`、`tax_scenario`、`tags`、`tax_season_year`）是否已弃用，是否全面只以 label_id 方式存储与读取。

**Assistant（实现前说明）**  
- 无代码变更；对照迁移注释、`firm.ts` 查询与映射、触发器与 RPC。

**Assistant（实现后说明 / 本轮结论）**  
- **不成立**：迁移 `20260323130000` 明确保留文字列为**去规范化兼容**；`firm.ts` 仍同时 select 文字列与 `*_label_id`/`custom_label_ids`，展示层优先 label 解析并回退文字/年份；`20260403120000` 仍将 `projects` 的税字段与 `tags` 同步到 `firm.orders` 文字列；权限逻辑侧重 label id，但**非**「仅存只读 id、弃用文字列」。若需单一数据源需另立迁移与全链路改造。

**关联**  
- `supabase/migrations/20260323130000_order_labels_library_and_label_ids.sql`、`20260403120000_sync_project_tags_to_order.sql`、`vouchap-app/src/shared-logic/firm.ts`

---

### 2026-04-03（问答：分类双轨的好处与弊端）

**User（提示词/原意）**  
- 现在的双轨有什么好处，有什么弊端？

**Assistant（实现前说明）**  
- 无代码变更；基于当前 `firm.skus`/`firm.orders` 同时存在文字列与 `*_label_id`/`custom_label_ids` 的架构作利弊归纳。

**Assistant（实现后说明 / 本轮结论）**  
- **好处**：兼容旧数据与简单查询；调试/列表直出字面量；税季可 label 与整数年份双兜底；权限用稳定 UUID；可渐进迁移。  
- **弊端**：两轨可能不一致；重复存储与对账成本；展示逻辑可能有的读 label、有的读文字；回归面大；自定义 `tags` 与 `custom_label_ids` 需严格同写。长期可收敛为「id 为唯一真值 + 展示由生成列或 join」。

**关联**  
- 同上条「核实 label_id」讨论

---

### 2026-04-03（Income 发票详情：选已有 Payer 保存误报关联方名称已存在）

**User（提示词/原意）**  
- income 模块发票详情修改，用已有 entity 替换识别错误的 entity，保存时报「关联名称已存在」，不符合设计。

**Assistant（实现前说明）**  
- Payer 选单已统一为 `entities`（`getCustomerOptions` → `getEntityOptions`），但 `handleSelectCustomer` 只写 `customerId`/`customer` 兼容字段；`saveInvoice` 仅用 `invoice.entityId` 写 `invoices.entity_id`，导致仍关联旧 AI 关联方，而 `customer_name` 已是所选名称，与 `getEntityOptionsForDuplicateCheck` 命中实体不一致，触发「关联方名称已存在」。

**Assistant（实现后说明 / 本轮结论）**  
- **`saveInvoice`**：若存在非空的 `customerId` 或 `customerSupplierId`（选单写入的实体 id），**优先**作为 `entityId` 再进入后续重名校验与 `updateEntity`。  
- **`invoice-details/[id].tsx`**：选 Payer 时同步 `entityId`/`entity`；清空选单时清空二者；选单高亮增加 `entityId`/`entity?.id` 与选项 id 一致（仅 DB 有 `entity_id` 而无兼容字段时也能显示已选）。  
- **验证**：错误识别关联实体 A，打开编辑 → Select Payer 选正确实体 B → Save，应成功且 `invoices.entity_id` 为 B。

**关联**  
- `vouchap-app/src/shared-logic/invoices.ts`、`vouchap-app/src/mobile-ui/app/invoice-details/[id].tsx`

---

### 2026-04-03（DB：receipt_items / invoice_items 列 purpose_id → attribution_id）

**User（提示词/原意）**  
- 后台仍为 `purpose_id`；应改为 `attribution_id`，并实际关联 `attributions` 的数据 id；`invoice_items` 同理。

**Assistant（实现前说明）**  
- 新增迁移：去掉旧 FK、列改名、`attribution_id` → `public.attributions(id) ON DELETE SET NULL`；同步 `vouchap-app` 中所有读写该列的 Supabase 字段名与嵌套 `attributions` 映射；更新运维脚本 `refresh_existing_spaces_categories_purposes.sql` 与根目录 `lib/` 中与 DB 列相关的旧名。

**Assistant（实现后说明 / 本轮结论）**  
- **迁移**：`vouchap-app/supabase/migrations/20260403180000_rename_line_item_purpose_id_to_attribution_id.sql`。  
- **应用**：`database.ts`、`invoices.ts`、`types`、`category-attribution-presets`、`postgrest-embed-errors`；`lib/database.ts`、`lib/invoices.ts` 列名与 embed 改为 `attribution_id` / `attributions`。  
- **验证**：对目标库执行 `supabase db push`（或等价应用迁移）后，小票/发票行项目的 Source 读写与列表应正常；若 PostgREST 仍报嵌套关系错误，需确认迁移已应用且外键生效。  
- **残留**：仓库根目录若干历史 SQL（如 `add-usage-count-to-categories-purposes.sql`、`create-new-project-schema*.sql`）仍写 `purpose_id`，仅在新环境手工执行时需自行对齐或忽略。

**关联**  
- `vouchap-app/supabase/migrations/20260403180000_rename_line_item_purpose_id_to_attribution_id.sql`、`vouchap-app/src/shared-logic/database.ts`、`vouchap-app/src/shared-logic/invoices.ts`

---

### 2026-04-05（Web 支出：按明细行表格页 + Items 入口）

**User（提示词/原意）**  
- client 版 expenses 模块 Web 端，表格上方操作行右端增加「items」入口，进入按 receipt_items 为行的新表格页；列：名称、金额、category / attribution 标签、小票 payee、小票交易时间。

**Assistant（实现前说明）**  
- 在 `receipts` Web 工具栏搜索框右侧增加「Items」跳转；新增路由 `/receipt-items`：`getAllReceiptLineItemsForList` 从 `receipt_items` 嵌套 `receipts!inner` + `entities` + `categories` + `attributions`（与现有小票一致，缺嵌套时回退 attribution 批量查询）；`DataTable` + `getReceiptLineItemColumns`；侧栏与 chat 行为与 expenses 对齐。

**Assistant（实现后说明 / 本轮结论）**  
- **类型**：`ReceiptLineItemListRow`（`types/index.ts`）。  
- **数据**：`getAllReceiptLineItemsForList`（`database.ts`），按交易日期降序再按名称。  
- **UI**：`receipt-items.tsx`（Web 表格 + 搜索 + 下拉刷新 + 行跳转 `receipt-details`）；`voucher-table-columns.tsx` 增加 `getReceiptLineItemColumns`；`receipts.tsx` Web 仅显示「Items」按钮；`_layout.tsx` 注册 `receipt-items`、`chatType`/`defaultChatOpen`/全局 FAB 排除；`WebSidebar` Expenses 高亮包含 `/receipt-items`。  
- **验证**：Web 打开 Expenses → 点 Items → 列与数据正确；点行进入对应小票详情；非 Web 进入该路由提示可用桌面 Web。  
- **残留**：行数多时未做分页，一次性拉全空间明细（与 `getAllReceipts` 量级策略不同，若数据极大需后续分页）。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`、`receipt-items.tsx`、`vouchap-app/src/shared-logic/database.ts`、`vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`

---

### 2026-04-05（Line items 表：Item 列最大 50ch + 省略）

**User（提示词/原意）**  
- items 名称列宽度设为 50 字符最大宽度，过长用缩略显示。

**Assistant（实现前说明）**  
- `DataTableColumn` 增加可选 `maxWidth`（number | string），作用于 th/td；Item 列 `maxWidth: '50ch'`、`numberOfLines={1}` + `ellipsizeMode="tail"`；Web 上为完整名称加 `title` 悬停提示。

**Assistant（实现后说明 / 本轮结论）**  
- **`DataTable.tsx`**：`maxWidth` 合并进表头与两种 tbody 单元格样式。  
- **`voucher-table-columns.tsx`**：`getReceiptLineItemColumns` 的 Item 列 `minWidth: 120`、`maxWidth: '50ch'`，单行省略；Web 传 `title` 显示全文。  
- **验证**：Web 打开 Line items，长名称列宽不超过约 50ch，尾部 `…`，悬停见全文。

---

### 2026-04-05（Line items：Is asset 列 + 多选/分组/筛选/批量改 category·attribution·is asset）

**User（提示词/原意）**  
- items 表在 attribution 后增加 Is asset 列；多选、全选、分组、筛选；选中后批量修改 category、attribution、Is asset。

**Assistant（实现前说明）**  
- `ReceiptLineItemListRow` 增加 `isAsset`、`categoryId`、`attributionId`；`getAllReceiptLineItemsForList` 映射 DB 字段；列配置增加 Is asset；`receipt-items` 启用 `DataTable` 多选与表头全选；工具栏 Group / Filter（月份、Category、Attribution、Is asset 子项多选/单选）；选中行显示批量栏，弹层选择 category / attribution（含 None）/ Yes·No，循环 `updateReceiptItem` 后刷新。

**Assistant（实现后说明 / 本轮结论）**  
- **类型与数据**：`types/index.ts`、`database.ts` 行映射 `is_asset`、`category_id`、`attribution_id`。  
- **列**：`voucher-table-columns.tsx` 在 Attribution 与 Payee 之间增加 **Is asset**（Yes/No）。  
- **页面**：`receipt-items.tsx` 分组（None / Transaction month / Category / Attribution / Payee / Is asset）、筛选（同上维度 + Is asset 三态）、搜索；`selectable` + `selectableRevealOnHover`；批量 Category / Attribution / Is asset；浮层样式用 RN `StyleSheet` 避免 `WEB_POPOVER.optionRow` 与 `ViewStyle` 不兼容。  
- **验证**：Web Line items 勾选、表头全选、分组与筛选联动；批量改三类字段后列表与详情一致。  
- **残留**：批量为顺序 `await` 大量行时可能较慢；`tsc` 对 `react-dom` 声明的提示与项目他处一致。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-items.tsx`、`vouchap-app/src/shared-logic/database.ts`、`vouchap-app/src/shared-logic/types/index.ts`、`vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`

---

### 2026-04-05（改 receipt item attribution 失败：usage 触发器仍引用 purpose_id）

**User（提示词/原意）**  
- 已执行 `purpose_id`→`attribution_id` 迁移后仍失败；不要再用回退 `purpose` 的兼容写法，后续要删 `purposes` 表。

**Assistant（实现前说明）**  
- 核实：历史脚本 `add-usage-count-to-categories-purposes.sql` 在 `receipt_items` 上的触发器函数 `update_usage_counts_on_item_change()` 仍读写 `OLD/NEW.purpose_id` 并更新 `purposes.usage_count`。列改名后 `purpose_id` 不存在，任意 UPDATE 行项目在触发器内即报错，客户端表现为 Failed to update item。  
- 撤销此前客户端对 `purpose_id` 的回退逻辑，仅保留 DB 侧修复。

**Assistant（实现后说明 / 本轮结论）**  
- **迁移** `20260405120000_receipt_items_usage_trigger_use_attribution_id.sql`：`CREATE OR REPLACE` 该函数，改为 `attribution_id` + 维护 `public.attributions.usage_count`（与行项目 FK 一致）。  
- **代码**：移除 `isAttributionIdColumnUnknownError` 及 insert/update 的 `purpose_id` 回退；`receiptItemAttributionRefId` 仅读 `attribution_id`。  
- **验证**：对已跑过列改名迁移的环境再 `db push` 本迁移后，详情页/Line items 修改 attribution 应成功；若从未安装旧 usage 脚本，函数被替换无副作用。

**关联**  
- `vouchap-app/supabase/migrations/20260405120000_receipt_items_usage_trigger_use_attribution_id.sql`、`add-usage-count-to-categories-purposes.sql`（历史手工脚本，新环境以迁移为准）

---

### 2026-04-05（Line items 表内编辑 Category / Attribution / Is asset）

**User（提示词/原意）**  
- 表格内直接改 category、attribution、Is asset；Is asset：true 为点亮勾选，false 为空白格样式。

**Assistant（实现前说明）**  
- `DataTableColumn` 增加 `stopRowPress`，在 `td` 上 `stopPropagation`，避免点编辑格触发 `onRowPress` 进详情。  
- `getReceiptLineItemColumns`：Web 上 Category/Attribution 用 **`LineItemNativeSelect`（原生 `<select>`）** 内联下拉；`onCategoryChange` / `onAttributionChange` 写库并乐观更新；Is asset 为 `checkbox`（真）/`square-outline`（假）可点击切换。  
- `receipt-items` 传入上述回调；批量编辑仍可用居中浮层。

**Assistant（实现后说明 / 本轮结论）**  
- **`DataTable.tsx`**：`stopRowPress` → `td.onClick` 阻止冒泡。  
- **`voucher-table-columns.tsx`**：`LineItemNativeSelect` + Is asset 勾选样式。  
- **`receipt-items.tsx`**：`onCategoryChange` / `onAttributionChange` / `onIsAssetCellPress` + `updateReceiptItem`；**表内不设 Category/Attribution 居中弹窗**。  
- **验证**：Web Line items 在单元格内下拉改 Category/Attribution；点勾选切换 Is asset 且不跳转详情。

---

### 2026-04-05（移除 Line items 表内 cellEdit Portal 死代码）

**User（提示词/原意）**  
- 表格内直接修改不宜浮出浮窗，应直接下拉选择；续作需删除仍引用 `cellEdit` 的 Portal 残留。

**Assistant（实现前说明）**  
- `receipt-items.tsx` 底部仍保留 `createPortal` + `cellEdit` / `cellEditWorking` / `applyCellCategory` / `applyCellAttribution` 块，但相关 state 与函数已移除，会导致 TS 报错或运行异常；整段删除。

**Assistant（实现后说明 / 本轮结论）**  
- 已删除该 Portal；表内编辑仅依赖 `voucher-table-columns` 的 `LineItemNativeSelect`。`read_lints`：`receipt-items.tsx` 无新问题。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-items.tsx`

---

### 2026-04-05（Line items：标签底色 + Attribution 下拉锚定在单元格下方）

**User（提示词/原意）**  
- 下拉样式可保留，但表格内闭合态须为带底色标签样式；Attribution 的下拉列表需在修改位置（锚点）**下方**展开。

**Assistant（实现前说明）**  
- Category 仍用原生 `<select>`，增加 `appearance: 'pill'`：按选中项 `color` 作为闭合态药丸背景、白字、自定义 chevron；选项类型扩展 `color?`。  
- Attribution 不用原生 select（弹出方向不可控且易被 `td { overflow: hidden }` 裁切），改为 `LineItemAttributionAnchorDropdownWeb`：`nativeID` 锚点 + `getBoundingClientRect` + `createPortal` 固定定位在 `bottom + 4px`；滚动/点击外侧关闭。

**Assistant（实现后说明 / 本轮结论）**  
- **`voucher-table-columns.tsx`**：`LineItemNativeSelect` 支持 `pill`；新增 `LineItemAttributionAnchorDropdownWeb`；列配置传入带 `color` 的 options。  
- **验证**：Web Line items 中 Category 闭合为彩色标签；点 Attribution 标签在**其下方**出列表并完成修改。`read_lints`：`react-dom` 类型提示与项目他处一致。

**关联**  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`

---

### 2026-04-05（Line items Category 药丸高度与宽度）

**User（提示词/原意）**  
- Category 标签高度过高，应与其它标签一致；宽度过宽，应随文案自适应。

**Assistant（实现前说明）**  
- 闭合态与 `LineTagPill` / Attribution 药丸对齐：`padding` 3px×8px 量级、`fontSize` 11、`lineHeight` 13px，去掉额外 `minHeight`。  
- 去掉外层 `minWidth` + select `width:100%` 造成的拉满列宽；pill 使用 `width: max-content`、`maxWidth: 200`，并加 `fieldSizing: 'content'`（Chromium 下按当前选中项收窄，减轻「按最长 option 撑开」）。

**Assistant（实现后说明 / 本轮结论）**  
- **`voucher-table-columns.tsx`**：`LineItemNativeSelect` 的 `pill` 分支与 Category 列外层 `View` 已按上调整。  
- **验证**：Web Line items 中 Category 与 Attribution 药丸视觉高度接近；标签宽度随名称变化、最长约 200px。不支持 `field-sizing` 的浏览器仍可能略受最长 option 影响，必要时可再改为与 Attribution 同型的自定义锚定列表。

**关联**  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`

---

### 2026-04-05（Line items Attribution 药丸高度）

**User（提示词/原意）**  
- Attribution 标签高度偏高，可能因下拉 icon 过大。

**Assistant（实现后说明 / 本轮结论）**  
- **`voucher-table-columns.tsx`**：`LineItemAttributionAnchorDropdownWeb` 中药丸将 `chevron-down` 由 12 改为 **10**，文案增加 **`lineHeight: 13`**（与 Category pill 一致），`gap` 4→**2**。

**关联**  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`

---

### 2026-04-05（Line items Attribution 选项去掉 None）

**User（提示词/原意）**  
- Attribution 的选项不需要 None。

**Assistant（实现后说明 / 本轮结论）**  
- **`voucher-table-columns.tsx`**：表内 Attribution 选项列表不再含空项；未知 id 仍 `unshift`；无选中时药丸文案 **—**、灰色。下拉回调仅传 **string**。  
- **`receipt-items.tsx`**：批量「Set attribution」浮层去掉 **None** 行。筛选/分组里表示「未归属」的文案未改（非选项列表）。

**关联**  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`、`vouchap-app/src/mobile-ui/app/receipt-items.tsx`

---

### 2026-04-05（Web 支出详情行项目 Category/Attribution 与表格同款选单）

**User（提示词/原意）**  
- Web 端详情页内 Category、Attribution 选单采用与 Line items 表格相同的组件。

**Assistant（实现前说明）**  
- 导出 **`LineItemNativeSelect`**、**`LineItemAttributionAnchorDropdownWeb`**，并抽出 **`buildLineItemCategoryOptions`** / **`lineItemCategorySelectValue`** / **`buildLineItemAttributionOptions`** 供表与详情共用。  
- **`receipt-details/[id].tsx`**：Web 且列表非空时用上述组件；原生端仍用底部 Modal（Modal `visible` 在 Web 关闭）。新建行无 `item.id` 时走 **`handleItemChange`**；已持久化行走 **`handleItemChangeDirect`**。**`handleItemChange`** 补 **`attributionId`** 分支；**`handleItemChangeDirect`** 在 **`editing`** 时同步 **`setEditedReceipt`**，避免编辑态 UI 与库不一致。

**Assistant（实现后说明 / 本轮结论）**  
- 已实现并联调路径与表格一致（含 Attribution 下拉锚定下方、无 None 项）。  
- **验证**：Web 打开支出详情，行项目 Category/Attribution 与 Line items 表交互一致；移动端仍为 Bottom sheet。

**关联**  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`、`vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`

---

### 2026-04-05（Attribution 锚定下拉位置：避免视口左上角）

**User（提示词/原意）**  
- Attribution 选单出现在页面左上角，需检查优化。

**Assistant（实现后说明 / 本轮结论）**  
- **`LineItemAttributionAnchorDropdownWeb`**：`nativeID` + `getElementById` 在 ScrollView/详情页等场景下常测到 **0×0 或未命中节点**，`fixed` 菜单即贴在 (0,0)。改为 **`ref` + `measureInWindow`**（优先），其次 **`ref`/`id` 的 `getBoundingClientRect`**；`rowId` 做 **`lineItemAttributionAnchorId` 安全化**；Web 补充 **`id` 属性**、`collapsable={false}`；打开后 **rAF 双帧 + 50ms** 再测一次以等布局稳定；DOM 全零矩形则跳过，避免误用左上角。

**关联**  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`

---

### 2026-04-05（Category / Attribution：管理页与选单按 usage_count 排序 · 续）

**User（提示词/原意）**  
- Category、Attribution 在**管理页**与各类**选单**中，选项顺序按 space 内 **`usage_count`**（`usageCount`）排序（与既有 `sortScopeTagsForDisplay` / `getCategories` / `getAttributions` 规则一致：Other 最后等）。

**Assistant（实现前说明）**  
- 共享层已映射并排序；需补齐：**表格/详情共用的 `buildLineItem*`**、**行项目筛选与批量选单**、**设置内嵌 ScopeSettingsManager**、**收支详情底部 Modal 列表**、**独立 manage 页在乐观更新后重排**；`categories-manage` 改用 `@/lib` 别名与其它屏一致。

**Assistant（实现后说明 / 本轮结论）**  
- **`voucher-table-columns.tsx`**：`buildLineItemCategoryOptions` / `buildLineItemAttributionOptions` 对入参先 `sortScopeTagsForDisplay`，未知 id 仍 `unshift`。  
- **`receipt-items.tsx`**：筛选 Category/Attribution 选项按 `usageCount` 等排序（结合已加载的 categories/attributions）；批量设置浮层使用排序后列表。  
- **`ScopeSettingsManager.tsx`**：列表用 `useMemo` 排序视图；新增/改名后 `setState` 内再排序。  
- **`categories-manage.tsx`** / **`attributions-manage.tsx`**：新增/更新后 `sortScopeTagsForDisplay`；分类管理 imports 改为 `@/lib`、`@/types`。  
- **`receipt-details/[id].tsx`**、**`invoice-details/[id].tsx`**：原生 Modal 选单使用 `categoriesSorted` / `attributionsSorted`。  
- **验证**：打开分类/用途管理、支出或收入详情行项目选单、Line items 表内下拉及行项目列表筛选，顺序应与 DB `usage_count` + Other 置底规则一致；新建项乐观更新后列表不应长期卡在末尾。  
- **说明**：全量 `tsc` 工程内仍有既有报错，未以本次变更为由一并清理。

**关联**  
- `vouchap-app/src/shared-logic/sort-scope-tags-for-display.ts`、`vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`、`vouchap-app/src/mobile-ui/app/receipt-items.tsx`、`vouchap-app/src/mobile-ui/components/ScopeSettingsManager.tsx`、`vouchap-app/src/mobile-ui/app/categories-manage.tsx`、`vouchap-app/src/mobile-ui/app/attributions-manage.tsx`、`vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`、`vouchap-app/src/mobile-ui/app/invoice-details/[id].tsx`

---

### 2026-04-05（Line items：工具栏高度与 Category 药丸聚焦蓝框）

**User（提示词/原意）**  
- Line items 表格页内**操作行**略减高，与**选中后**操作行高度一致，避免选中后页面抖动。  
- **Category** 标签点选后有**蓝色外框**，需消除。

**Assistant（实现前说明）**  
- 抖动来源：`receipt-items` 顶栏在未选（Group/Filter/Search）与已选（批量条）间垂直 padding 不一致；`DataTable` 表头全选在 `selectableRevealOnHover` 下由**条件卸载**改为与表体一致**始终挂载**更稳。  
- 蓝框：Web 原生 `<select>` 聚焦默认 `outline`。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-items.tsx`**（首版）：曾整体压低顶栏高度。  
- **更正（与 Expenses 表一致）**：`toolbarSlot` / `header` / `bulkBar` 与 **`receipts.tsx`** 对齐——固定 **高度 52**、`bulkBar` 使用 **gap 12**、**paddingVertical 10**、**bulkBtn / bulkBtnClear 8×12**、`bulkText` **marginRight 8**；未选态 `header` 与 **Group/Filter/Search** 的 padding、**gap 12**、按钮 **8×12**、搜索框 **paddingVertical 8** 与 receipts 一致；批量图标 **17→18**。  
- **`DataTable.tsx`**：表头全选 `input` 始终渲染，`opacity` + `pointerEvents` 与「有无选中」及 reveal 模式对齐（不再在未选时卸载节点）。  
- **`voucher-table-columns.tsx`**：`LineItemNativeSelect` 样式增加 **`outline: 'none'`**、**`outlineWidth: 0`**。  
- **验证**：Web Line items 勾选一行前后顶栏与表头区域无明显高度跳动；点选 Category 药丸后无浏览器默认蓝色聚焦框。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-items.tsx`、`vouchap-app/src/mobile-ui/components/DataTable.tsx`、`vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`

---

### 2026-04-05（Line items Category / Attribution 选单：统一样式与向下展开）

**User（提示词/原意）**  
- Category 与 Attribution **选单样式**（半透明、展开位置）不一致。  
- 应统一：**Category 的半透明 + 鼠标悬停反色**；**Attribution 的展开位置**（始终在下方下拉，而非随当前项上下翻转）。

**Assistant（实现前说明）**  
- Category 原为 Web **原生 `<select>`**，列表由系统绘制；Attribution 为 **Portal + 锚点下方固定坐标**。  
- 抽取共用 **`LineItemPillAnchorDropdownWeb`**：药丸触发一致；菜单 `rgba` + `backdrop-filter` 半透明；选项 `hover` 深底白字；位置沿用 `measure` + `top + height + 4`。

**Assistant（实现后说明 / 本轮结论）**  
- **`voucher-table-columns.tsx`**：新增 **`LineItemPillAnchorDropdownWeb`**（`kind: 'category' | 'attribution'`，`anchorId` 前缀区分）；**`LineItemAttributionAnchorDropdownWeb`** 改为薄封装。Line items 表内 **Category** 列改用该组件（不再用原生 pill select）。**`LineItemNativeSelect`** 仍保留供非 pill 场景。  
- **`receipt-details/[id].tsx`**：Web 行项目 **Category** 改为 **`LineItemPillAnchorDropdownWeb`**；与 Attribution 共用同一 `lineStableId` 作为 rowId（DOM id 仍因 `kind` 不同而不冲突）。  
- **验证**：Web Line items 与支出详情行项目：两列药丸一致；展开均在药丸**下方**；菜单毛玻璃半透明；悬停选项反色；选中为浅紫底。  
- **后续**：悬停由深灰反色改为 **#6C5CE7** 浅高光（见下条）。

**关联**  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`、`vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`

---

### 2026-04-05（Line items 药丸选单：悬停改亮紫蓝）

**User（提示词/原意）**  
- 反色悬停过深，改用亮蓝色（品牌 **#6C5CE7**）。

**Assistant（实现后说明 / 本轮结论）**  
- **`LineItemPillAnchorDropdownWeb`**：悬停底 **`rgba(108, 92, 231, 0.28)`**；文案 **#2D3436**，勾选 **#6C5CE7**；色点悬停描边为淡紫。

**关联**  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`

---

### 2026-04-05（Line items 批量：锚定下拉 + Is asset 双态 + 二次确认）

**User（提示词/原意）**  
- 批量 Category/Attribution 用**操作行按钮向下**拉出选单，不用固定居中浮窗。**Is asset** 不要选单，整批标资产 / 再点整批取消。**批量**均需**二次确认**，复用统一浮窗。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-items.tsx`**：Portal 锚定菜单 + **`confirmThen`**；**Is asset** 按**当前选中行**推导：并非全部为 asset 时第一次为**全部标 asset**；**已全部为 asset** 时第一次即为**全部取消**（**`bulkSelectedAllAsset`**，按钮文案 **Not asset**）。已弃用按次翻转的 `bulkAssetNextTrue`。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-items.tsx`、`vouchap-app/src/shared-logic/alertWeb.ts`

---

### 2026-04-05（Line items 批量操作三按钮：弱化视觉重量）

**User（提示词/原意）**  
- 三个批量修改操作按钮（Category / Attribution / Is asset）**样式过深**，需**弱化**，减轻深色实心主按钮感。

**Assistant（实现前说明）**  
- 原为 **`bulkBtn`** 实心 **`#6C5CE7`** + 白字/白图标；**`bulkBar`** 为 **`#E8E0F7`**。拟改为**浅色底 + 淡紫描边 + 紫字/紫图标**的 secondary 风格；**`bulkBtnAltHint`**（**Not asset** 双态）改为略强调描边与极浅紫底，替代原白描边。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-items.tsx`**：**`bulkBar`** → **`#F2EDFA`**；**`bulkBtn`** → 近白底、**`borderColor: rgba(108,92,231,0.32)`**；**`bulkBtnText`** → **`#5B4DC7`**；三处 **Ionicons** 改为 **`#6C5CE7`**；**`bulkBtnAltHint`** → 稍粗描边 + 浅紫底。  
- **验证**：进入批量选中，三按钮为轻量 outline，与条带对比度仍可读；**Not asset** 态（全选均为 asset 时）有轻微强调。  
- **残留**：若与 receipts 批量条需严格像素对齐，可再对表单项单列比对。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-items.tsx`

---

### 2026-04-05（Line items 批量 Is asset：双态按钮文案 Not asset）

**User（提示词/原意）**  
- 将 **Is asset (clear)** 改为 **Not asset**。

**Assistant（实现前说明）**  
- 无逻辑变更；仅批量条按钮在 **`bulkSelectedAllAsset`** 时的展示文案。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-items.tsx`**：**`bulkSelectedAllAsset`** 时按钮显示 **Not asset**，否则 **Is asset**；确认弹窗仍为 **Mark as non-asset** / **Mark … as non-asset?**（与操作一致）。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-items.tsx`

---

### 2026-04-05（Line items：Web chat 右栏默认关闭）

**User（提示词/原意）**  
- **Line Items** 页 chat **右栏默认不打开**；**其他页面**保持现有默认策略。

**Assistant（实现前说明）**  
- **`defaultChatOpen`** 此前对 **`/receipt-items`** 与 **`/receipts`** 同为 **true**。拟移除 line items 的默认打开，使其落入末支 **false**。  
- 原先 **`WebChatFab`** 在 **`/receipt-items`** 与 **`/receipts`** 一样被排除；line items 若默认关栏且无 FAB 则难以再打开，故**仅从 FAB 排除条件中去掉 `receipt-items`**，**保留 `receipts` 等**。

**Assistant（实现后说明 / 本轮结论）**  
- **`_layout.tsx`**：**`defaultChatOpen`** 不再对 **`/receipt-items`** 返回 **true**；**`WebChatFab`** 在 line items 且右栏关闭时**可显示**（类型仍为 **`chatTypeFromPathname` → receipt**）。  
- **验证**：Web 打开 Line items → 右栏关闭、主区更宽；点 FAB 可打开右栏；从 Line items 切到 Expenses 列表 → 仍默认打开右栏（未改）。

**关联**  
- `vouchap-app/src/mobile-ui/app/_layout.tsx`

---

### 2026-04-05（Category / Attribution 选单：内部滚动不再误关）

**User（提示词/原意）**  
- Category、Attribution **选单选项多、出现滚动条时，一滚动选单就消失**，需修复。

**Assistant（实现前说明）**  
- **`LineItemPillAnchorDropdownWeb`**（及 Line items **批量** Portal 选单）在打开时对 **`window` `scroll` capture** 监听并**一律关菜单**；浏览器在**选单自身 `overflowY: auto`** 上滚动时同样向 window 冒泡/捕获，导致误关。

**Assistant（实现后说明 / 本轮结论）**  
- **`voucher-table-columns.tsx`**：**`onScroll`** 若 **`event.target`** 位于 **`#menuDomId`** 内则 **return**，否则 **`setOpen(false)`**；**`useLayoutEffect`** 依赖补 **`menuDomId`**。  
- **`receipt-items.tsx`**：批量选单 **`onScroll`** 同理忽略 **`#receipt-items-bulk-menu`** 内滚动；**`resize`** 仍为无条件收起（与原行为一致）。  
- **验证**：Web 表内与批量：选单拉高至出滚动条，滚轮/拖拽滚动列表，选单保持；滚外层表格/页面仍应关闭选单。

**关联**  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`、`vouchap-app/src/mobile-ui/app/receipt-items.tsx`

---

### 2026-04-05（Web 顶栏返回：箭头间歇消失）

**User（提示词/原意）**  
- Web **顶行返回箭头经常消失**；有时**占位仍可点**仅**无箭头**；有时**占位也没了**。

**Assistant（实现前说明）**  
- Web **Stack** 使用 JS **`NativeStackView`**，默认 **`HeaderBackButton`** 为 **PNG + RN `Image` `tintColor`**；**RN Web** 上易出现**位图画不出来**但**仍有点击区**。整条按钮缺失另可能与 **`canGoBack`/栈** 或页级 **`headerLeft`** 有关；本次消除 PNG/tint 主因。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 **`vouchap-app/src/mobile-ui/lib/web-stack-header-left.tsx`**：**仅 web** 合并 **`getWebStackHeaderLeftScreenOptions()`**：**`HeaderBackButton`** + **`backImage`** 用 **Unicode U+2039** 与 **系统 UI 字体**，不依赖位图着色。  
- **`app/_layout.tsx`**、**`tax-filing/project/[projectId]/_layout.tsx`**、**`tax-filing/order/[orderId]/_layout.tsx`** 的 **`screenOptions`** 已合并；**非 web** 返回 **`{}`**，原生不变。

**关联**  
- `vouchap-app/src/mobile-ui/lib/web-stack-header-left.tsx`、`vouchap-app/src/mobile-ui/app/_layout.tsx`、`vouchap-app/src/mobile-ui/app/tax-filing/project/[projectId]/_layout.tsx`、`vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/_layout.tsx`

---

### 2026-04-05（小票：标准税率表 + 行税、辖区、对账与异步重算）

**User（提示词/原意）**  
- 设计并实现 **标准税率表 / 行项目税表** 及后端：**识别时**优先用 `tax_rate_catalog`，缺失则用内置标准税率 **写入 space 缓存** 再算行税；**行税合计 vs 票面 tax**：接近则通过，差距大则 **异步** 换辖区重算；仍对不齐则 **差额可接受**（票面 `receipts.tax` 为准，行税以计算为准）。  
- 接续此前已存在的迁移草稿与 `receipt-item-tax.ts`，补全接入与 prompt。

**Assistant（实现前说明）**  
- 修复 `scheduleReceiptTaxRecalcIfNeeded` 中非法条件；在 **`saveReceipt` / `updateReceipt`** 写入 **`tax_jurisdiction_*`**（来自识别或推断），保存行项后 **`applyReceiptItemTaxesAndReconcile`**，大差额时 **`scheduleReceiptTaxRecalcIfNeeded`**。  
- 扩展 **`Receipt` / `GeminiReceiptResult`**、**`convertGeminiResultToReceipt`**、**`buildReceiptExtractionRules`** 与文本/语音小票 prompt 输出 **`taxJurisdictionCountry` / `taxJurisdictionRegion`**。  
- **`getReceipt*`** 映射 **`tax_reconciliation_status`、`tax_items_sum`、`tax_variance_amount`**。  
- 依赖迁移：`supabase/migrations/20260405220000_tax_rate_catalog_and_receipt_item_taxes.sql`（若尚未在生产执行需 deploy）。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-item-tax.ts`**：`pending_recalc` 循环后若仍为 pending 则降为 **`variance`**；重算成功则 **`matched` / `within_tolerance` / `skipped`** 时退出循环。  
- **`database.ts`**：`insert`/`update` 税辖区列；保存/更新影响行税或税总额时触发 **apply + schedule**；列表/详情 **Receipt** 带回对账字段。  
- **`types/index.ts`**、**`receipt-helpers.ts`**、**`gemini.ts`**：辖区与类型、prompt 一致。  
- **验证**：应用迁移后保存含明细的 CAD 小票 → `receipt_item_taxes` 有行、**`tax_reconciliation_status`** 非空；人为大差额 CA 场景可观察 **`pending_recalc`** → 异步尝试其他省或最终 **`variance`**。全量 `tsc` 工程内仍有既有报错，与本次改动文件无新增可指出的阻塞项。

**关联**  
- `vouchap-app/supabase/migrations/20260405220000_tax_rate_catalog_and_receipt_item_taxes.sql`、`vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/src/shared-logic/database.ts`、`vouchap-app/src/shared-logic/types/index.ts`、`vouchap-app/src/shared-logic/receipt-helpers.ts`、`vouchap-app/src/shared-logic/gemini.ts`

---

### 2026-04-06（标准税率迁入 crm schema；space 对标准表只读）

**User（提示词/原意）**  
- 数据库已有 **`crm`** schema；**标准税率表**放到该 schema；**模型/运营侧**可对标准表写入；**用户 space**（客户端 authenticated）对标准税率为 **只读**。

**Assistant（实现前说明）**  
- 新增 **`crm.tax_rate_standard`**（无 `space_id`），**RLS**：`authenticated` 仅 **SELECT**；写操作交给 **service_role**（或后续 CRM 后台），与「用户不可改标准表」一致。  
- **`public.tax_rate_catalog`**：去掉 **`space_id IS NULL`** 平台行，**`space_id` NOT NULL** 专作 space 缓存；原平台种子迁入 crm 并 **DELETE** 旧行；**`receipt_item_taxes`** 增加 **`crm_tax_rate_standard_id`**，与 **`tax_rate_catalog_id`**（仅缓存行）二选一引用。  
- 应用层 **`receipt-item-tax.ts`**：合并查询 **`crm.tax_rate_standard`** 与 **`public.tax_rate_catalog`**；**`supabase/config.toml`** 增加 **`api.schemas` 含 `crm`**；托管项目需在 **Dashboard → API → Exposed schemas** 勾选 **`crm`**。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移 **`20260406120000_crm_tax_rate_standard.sql`**：建表、seed、从 public 迁遗留平台行、`receipt_item_taxes` 新列、删 public 平台行、**`tax_rate_catalog.space_id` NOT NULL**、收紧 **`tax_rate_catalog` SELECT** 策略仅本 space。  
- **`receipt-item-tax.ts`**：`schema('crm').from('tax_rate_standard')` + 原 **`tax_rate_catalog`**；写入行税时按来源填 **`crm_tax_rate_standard_id` 或 `tax_rate_catalog_id`**。  
- **`crm.tax_rate_standard.source`** 允许 **`model`**，便于 pipeline 用 service role 落库。  
- **验证**：跑迁移 → 客户端仍可取 CRM 标准税率并算行税；authenticated 对 **`crm.tax_rate_standard`** 无 INSERT；Supabase 未暴露 **`crm`** 时 `.schema('crm')` 会失败，需同步 config + Dashboard。

**关联**  
- `vouchap-app/supabase/migrations/20260406120000_crm_tax_rate_standard.sql`、`vouchap-app/supabase/config.toml`、`vouchap-app/src/shared-logic/receipt-item-tax.ts`

---

### 2026-04-06（crm 标准税表：美国各州 + 加拿大各省种子）

**User（提示词/原意）**  
- 检索**美国、加拿大**各税种/税率，**写入标准税表**（`crm.tax_rate_standard`）。

**Assistant（实现前说明）**  
- 加拿大：按省补全 **HST 单轨**（ON/NB/NL/PE/NS）、**GST+PST/SK**、**GST+RST/MB**、**GST+QST/QC**、**GST-only**（AB/NT/NU/YT）及 **CA 空 region 的 GST 兜底**；NS **HST 14%** 自 **2025-04-01** 起（与公开税改表述一致）。  
- 美国：每州一行 **`COMBINED_SALES_TAX`** = Tax Foundation **2025-01-01** 表 **州税 + 人口加权平均地方税**（仅作小票估算参考，不含免税品/基地差异）；另加 **`US` + 空 region** 全美国约 **6.65%** 粗 fallback。  
- 新建幂等迁移 **`20260406180000_seed_crm_tax_rate_standard_us_ca.sql`**（`NOT EXISTS` 自然键 + `effective_from`）。

**Assistant（实现后说明 / 本轮结论）**  
- 已写入迁移；表 **`COMMENT`** 标明来源与「非申报级精度」限制。  
- **修复**：NE 州行 `effective_from` 笔误 **`2022025-01-01`** → **`2025-01-01`**。  
- **验证**：`supabase db push` / SQL Editor 执行迁移后 `SELECT country_code, region_code, tax_kind_code, rate FROM crm.tax_rate_standard WHERE country_code IN ('US','CA') ORDER BY 1,2,4;`；业务上仍需法务/税务复核再用于申报。

**关联**  
- `vouchap-app/supabase/migrations/20260406180000_seed_crm_tax_rate_standard_us_ca.sql`

---

### 2026-04-06（小票行税无数据：美国 effective_from + CRM 回退）

**User（提示词/原意）**  
- Dev 拍摄小票后 **`receipt_item_taxes` 没有数据**。

**Assistant（实现前说明）**  
- 根因：**美国**标准税率种子使用 **`effective_from = 2025-01-01`**，查询使用 **`effective_from <= receipt_date`**，小票日期早于 2025 时 **CRM 无匹配行**；**`builtinStandardRates` 仅含加拿大**，美国不会写入 **`tax_rate_catalog` 缓存**，最终 **pickRates 为空**。次要风险：**Supabase 未暴露 `crm` schema** 时查询失败且无回退。  
- 计划：**迁移** 将美国 **`COMBINED`** 行的 **`effective_from` 统一改为 `2000-01-01`**；补 **NS HST 15%**（至 2025-03-31）；同步修正 **`20260406180000`** 中美国与 NS 种子；**应用侧** CRM 结果按 **`effective_from` / `effective_to` 在内存收窄**；**`builtinStandardRates` 增加美国**（`us-combined-sales-tax-builtin.ts`）；**insert 失败日志** 打出 code/details。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 **`20260406200000_tax_standard_us_effective_from_and_ns_hst.sql`**；**`us-combined-sales-tax-builtin.ts`**；**`receipt-item-tax.ts`** 如上。  
- **验证**：执行新迁移后，**USD + 小票日期 2024** 仍应命中 CRM；控制台若见 **`crm.tax_rate_standard failed`** 须在 **Project Settings → API → Exposed schemas** 勾选 **`crm`**。已存小票可再编辑保存触发 **`updateReceipt`** 或依赖后续产品「重算税」入口。

**关联**  
- `vouchap-app/supabase/migrations/20260406200000_tax_standard_us_effective_from_and_ns_hst.sql`、`vouchap-app/supabase/migrations/20260406180000_seed_crm_tax_rate_standard_us_ca.sql`、`vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/src/shared-logic/us-combined-sales-tax-builtin.ts`

---

### 2026-04-06（拍照小票仍无 item-tax：辖区/日期/receipt-processor 二次 apply）

**User（提示词/原意）**  
- 已按说明执行迁移后，**识别新小票仍无 item-tax 数据**。

**Assistant（实现前说明）**  
- 可能原因：**(1)** 初次 **`saveReceipt({ items: [] })`** 后本就不会写行税（仅说明性日志）；**(2)** **`updateReceipt` 之后**仍无辖区时 **`country` 为空**（非 USD/CAD 且无 `tax_jurisdiction_*`）直接 skipped；**(3)** **`date` 非 ISO** 导致 CRM 有效期比较异常；**(4)** 需确认识别完成后 **`applyReceiptItemTaxesAndReconcile` 一定执行**。  
- 拟：**辖区回退**（空币种按 USD→US；显式 CAD→CA）、**`receiptTaxAsOfDate`**、**诊断日志**、在 **`receipt-processor.ts`** 于 **`updateReceipt` 成功后再次调用 apply+schedule**。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-item-tax.ts`**：如上；无明细时 warn 说明「行税在明细写入后才算」。  
- **`receipt-processor.ts`**：**`getCurrentUser` + `bgSpaceId`** 下二次 **`applyReceiptItemTaxesAndReconcile`**（与 `updateReceipt` 内调用重复但幂等）。  
- **验证**：拍票 → 识别结束 → 看控制台 **`[receipt-item-tax] No tax rows computed`** 或 **`crm.tax_rate_standard failed`**；**非 USD/CAD** 且无辖区仍将 skipped（需模型返回辖区或扩展币种表）。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/src/shared-logic/receipt-processor.ts`

---

### 2026-04-06（updateReceipt：先删后插行项目是否致关联冗余、是否需改）

**User（提示词/原意）**  
- 日志显示**修改 receipt 详情**时是**删除 item 再重新添加**，是否会导致**关联数据冗余**？**是否必要**调整更新逻辑？

**Assistant（实现前说明）**  
- 无代码变更；查阅 **`database.ts` 中 `updateReceipt`**、`receipt_item_taxes` 迁移 FK。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt_item_taxes.receipt_item_id` → `receipt_items.id` 为 `ON DELETE CASCADE`**，删行项目会**级联删除**对应行税，**不会**长期堆积「孤儿」行税行，语义上**不是**「关联表冗余堆积」。  
- **代价**：每次编辑换来**新的 `receipt_items.id`**，随后 **`applyReceiptItemTaxesAndReconcile` 全量重算并插入**属于**预期**；若别处未来用**稳定 item 外键**（审计、第三方同步），全删全插会使旧 ID 失效——当前代码库未见除 **`receipt_item_taxes`** 外对 **item id** 的强依赖。  
- **是否必改**：非为「防冗余」而必改；若需**稳定 ID / 少写放大 / 保留细粒度审计**，可改为 **按 id upsert / 仅 diff 变更行**（实现与冲突处理成本更高）。

**关联**  
- `vouchap-app/src/shared-logic/database.ts`（`updateReceipt`）、`vouchap-app/supabase/migrations/20260405220000_tax_rate_catalog_and_receipt_item_taxes.sql`

---

### 2026-04-06（曼省等小票：只识别部分税种、行税合计与票面税差很大）

**User（提示词/原意）**  
- 刚识别的小票（**加拿大曼尼托巴省快餐**）**只识别了部分税种**，items 税总额与**小票税额偏差很大**，需核实并修复。

**Assistant（实现前说明）**  
- 假设根因：**识别返回的 `taxJurisdictionRegion` 为全称**（如 Manitoba）与 **`crm.tax_rate_standard.region_code`（MB）** 不一致；**`pickRatesForRegion`** 对 CRM 行需 **`bestScore >= 3`** 才入选：**GST** 仍可借 **`CA` + 空 region** 行得分入选，**RST 仅存在于 MB 行**时得分不足被丢弃 → **只有 5% GST、缺 7% RST**，与**约 12% 合计税**严重偏差。  
- 拟：**加拿大省名/别名 → ISO 二位码** 规范化；**`builtinStandardRates`** 补 **MB（GST+RST）、SK（GST+PST）**；**`CA_ALT_REGIONS`** 加入 MB/SK/QC；**Gemini 提示**强制二位省码。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-item-tax.ts`**：新增 **`normalizeCanadianRegionCode`**（导出）、在 **`applyReceiptItemTaxesAndReconcile`** 内 **`country === 'CA'`** 时写入规范化 region；补内置税率与重算省份列表；修正 **`NORTHWEST TERRITORIES`** 对象字面量键须加引号（否则 TS 语法错）。  
- **`gemini.ts`**：**`taxJurisdictionRegion` 必须为二位代码**，禁止全称。  
- **验证**：将票面 **`tax_jurisdiction_region` 设为 `Manitoba` 或 `MB`** 后保存/重算，**`receipt_item_taxes`** 应同时含 **GST + RST**，**`tax_items_sum`** 与 **`receipts.tax`** 接近；仍差时需查 **行价是否含税、分类税级** 等与模型无关因素。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/src/shared-logic/gemini.ts`

---

### 2026-04-06（保存小票：行税先出现 PST/RST 后消失只剩 GST）

**User（提示词/原意）**  
- **修改保存**刚才的小票，后台**短时间出现 pst 数据**，**最终又消失只剩 gst**。

**Assistant（实现前说明）**  
- 根因：**`scheduleReceiptTaxRecalcIfNeeded`** 在 **`pending_recalc`** 时对 **`CA_ALT_REGIONS`** 依次 **`regionOverride`** 重算；列表末尾曾含 **`''`** → **`pickRatesForRegion`** 只保留联邦 **GST**（`, CA region_code ''`），**删掉** 省税行 → 用户看到先有两税、后被异步一轮**覆盖成仅 GST**。  
- 另：**非 CA 小票**不应跑加拿大学历轮询。  
- 拟：**移除 `''`**；**扩展**备选省列表（含领土）；`schedule` 查询补上 **`tax_jurisdiction_country`**；不引入「凡有省码就禁止轮询」（与 **CAD 默认写 ON** 冲突）。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-item-tax.ts`**：**`CA_ALT_REGIONS`** 去掉 **空 region**；**`scheduleReceiptTaxRecalcIfNeeded`** 中 **`country !== 'CA'`** 时仅把 **`pending_recalc` → `variance`**，不执行省轮询；循环跳过条件用 **`normBase`** 与 **`baseRegion`** 与大写 **alt** 对齐。  
- **验证**：保存后 **Supabase** 观察 **`receipt_item_taxes`**：不应再出现「数秒后只剩 GST」；若 **`pending_recalc`** 仍存在，最后一轮不再使用 **`regionOverride: ''`**。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`

---

### 2026-04-06（重存小票后台仍只有 GST）

**User（提示词/原意）**  
- **重新保存**改小票，**后台仍只有 gst**（预期曼省等应有省税行）。

**Assistant（实现前说明）**  
- 推断：空间中 **`tax_rate_catalog`** 已有 **其它省**（常见 **CAD 默认 ON**）的 **GST** 行时，`pickRatesForRegion` 会为 **GST** 选中该行（score≥3），**`picked.size > 0`** → **`resolveRateRows`** **不会**再执行 **`ensureSpaceCatalogFromBuiltin`**；**RST** 仅存在于 **MB/对应省** 或 **CRM**，缓存无省税 → **最终只写入 GST**。另：**`CA ''` 联邦 GST** 会在非严格筛选时与省行并存，对 **HST 省**也不利。  
- 拟：在 **`region` 已非空** 时，候选税率 **仅限 `region_code` 与辖区一致** 的行，迫使 **MB** 场景 **`picked` 为空** 直至 **`ensure`** 写入 **GST+RST**，或 **CRM** 仅有省区行时正确双轨。

**Assistant（实现后说明 / 本轮结论）**  
- **`pickRatesForRegion`**：当 **`reg`** 非空时先用 **`scoped`** 过滤 **`region_code === reg`**（大小写不敏感），再按 kind 打分。  
- **验证**：`tax_jurisdiction_region = MB`（或规范化后 MB）、CRM/缓存无 MB 时重存后应出现 **`RST`** + **`GST`**；若仍为单列，查 **`crm` schema 暴露**、**RLS**、`tax_rate_catalog` **insert** 报错日志。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`

---

### 2026-04-06（Winnipeg 小票误用 14% HST 而非 GST+PST/RST）

**User（提示词/原意）**  
- 票面有 **Winnipeg**、**GST 5% / PST 7%** 字样，却用 **14% HST** 计算；需核查逻辑，确保**标准税率取用正确**。

**Assistant（实现前说明）**  
- **14% HST** 与种子 **NS**（`crm.tax_rate_standard`）一致；**模型**误填 **`tax_jurisdiction_region`**（如 **NS**）或 **`pending_recalc`** 跨省轮询在 **`within_tolerance`** 时**过早 break**，会误选 **NS** 单轨 HST。  
- **曼省**应为 **GST+RST**（票面常写 **PST**），**非** HST 省。  
- 拟：**从 `processed_by` + entity name/address 推断** Winnipeg、**R** 邮编、**GST+PST** 文本；若与 **HST 省**辖区冲突则**覆盖为 MB**；**禁用**跨省轮询中 **within_tolerance** 的「误匹配」；**Gemini** 规则补强。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-item-tax.ts`**：新增 **`inferCanadianRegionFromReceiptSignals`**、**`receiptTextSuggestsGstPlusProvincialNotHst`**（导出）；**`applyReceiptItemTaxesAndReconcile`** 拉取 **`processed_by`、`entity_id`** 并读 **`entities(name,address)`** 拼证据；**CA** 下在模型区划为 **ON/NB/NS/NL/PE** 且文本含 **GST+PST** 或推断 **MB/BC** 时**纠正辖区**；**`scheduleReceiptTaxRecalcIfNeeded`** **取消**跨省依次重算，仅 **`pending_recalc` → `variance`**（避免 NS 等误匹配）。  
- **`gemini.ts`**：Winnipeg / R 邮编 → **MB**；**GST+PST** 与 HST 省互斥说明。  
- **验证**：保存后 **`receipt_item_taxes`** 应为 **GST+RST**（非单列 HST）；**重新识别**旧小票以更新模型输出的 `taxJurisdictionRegion`。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/src/shared-logic/gemini.ts`

---

### 2026-04-07（混合税率行：食品免税与行税合计严格对账）

**User（提示词/原意）**  
- 部分 **item 适用税率不同**（如食品免税），识别却**统一税率**；**items 税总额与票面税额**不一致；需**严格校验**，**只允许四舍五入末位差异**。

**Assistant（实现前说明）**  
- 根因：行税仅按 **分类 → category_tax_class_map**；无**行级免税**时全部为 **STANDARD_TAXABLE**；对账曾用 **绝对 0.02 + 相对 2%**，易把**实质差异**标成 **within_tolerance**。  
- 拟：**`receipt_items.tax_class_code`** 可覆盖分类；**Gemini** 输出可选 **`taxClassCode`**（**EXEMPT** / **ZERO_RATED**）；**对账**仅允许 **≤0.01**（末位分币舍入），**去掉相对容差**；**variance** 时 **console.warn**。

**Assistant（实现后说明 / 本轮结论）**  
- **迁移** **`20260407100000_receipt_items_tax_class_code.sql`**；**`receipt-item-tax.ts`**：**`normalizeReceiptItemTaxClassCode`**、**`RECONCILE_ROUNDING_EPS = 0.01`**、**`reconcileStatus`** 仅 **matched / variance**（≤1 分视为 **matched**）；**`apply`** 读 **`tax_class_code`** 优先于分类；**`database.ts`** 写入/读出 **`tax_class_code`**；**`types`**、**`receipt-helpers`**、**`gemini`** 管线接 **`taxClassCode`**。  
- **验证**：迁移后 **免税行** 识别带 **EXEMPT** 时行税和应逼近 **`receipts.tax`**；仍 **variance** 须人工改分类或行税级。  
- **CRM**：当前种子以 **STANDARD_TAXABLE** 为主；**EXEMPT** 无税率行属预期（**0** 税）。

**关联**  
- `vouchap-app/supabase/migrations/20260407100000_receipt_items_tax_class_code.sql`、`vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/src/shared-logic/database.ts`、`vouchap-app/src/shared-logic/receipt-helpers.ts`、`vouchap-app/src/shared-logic/gemini.ts`、`vouchap-app/src/shared-logic/types/index.ts`

---

### 2026-04-07（加国超市：模型未标 EXEMPT 时用关键词启发式）

**User（提示词/原意）**  
- 终端仍报 **行税合计远高于票面税**（如 `receiptTax` 0.68 vs `sumItems` 2.24）；**免税行仍按全额计税**。

**Assistant（实现前说明）**  
- 先前 **`inferCanadianRetailGroceryTaxClass` / `canApplyCanadianGroceryTaxHeuristic`** 已加，但 **正则字符串转义错误**导致启发式几乎不生效；**`convertGeminiResultToReceipt`** 未在模型缺 **`taxClassCode`** 时调用启发式。  
- 拟：**字面量 `/.../i` 正则**重写启发式；**`receipt-helpers`** 在 **`CAD`、非 QC、国家空或 CA** 且模型未给合法 class 时补 **`EXEMPT`**；**`gemini`** 规则补充加国超市分行标注；果汁等应税关键字进 blocklist。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-item-tax.ts`**：`inferCanadianRetailGroceryTaxClass` 改为清晰 **`RegExp` 字面量**；扩充零食/果汁等 **应税** 词；**`wings`** 使用 **`\bwings\b`**。  
- **`receipt-helpers.ts`**：调用 **`canApplyCanadianGroceryTaxHeuristic(result)`** + **`inferCanadianRetailGroceryTaxClass(itemName, categoryName, resolvedCategory.name)`** 回填 **`taxClassCode`**。  
- **`gemini.ts`**：`RECEIPT_JSON_ITEMS_RULE` 增加加拿大超市 **基本食品 vs 即食/饮料/零食** 的 **`EXEMPT`** 说明。  
- **验证**：同一曼省/混合税率小票重扫后 **`sumItems`≈`receipt.tax`**（≤0.01）；异常品名可再扩关键词。已知 **QC** 不启用启发式；**Shopping** 等非 Grocery 分类依赖 **品名关键词** 命中。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/src/shared-logic/receipt-helpers.ts`、`vouchap-app/src/shared-logic/gemini.ts`

---

### 2026-04-07（行税计算阶段应用加国免税启发式 + Toast 诊断）

**User（提示词/原意）**  
- 仍错：**免税行仍按全额计税**，总额与票面不一致；**原生相机**时 Metro 日志看不到。

**Assistant（实现前说明）**  
- 根因：`receipt_items.tax_class_code` 为空时，`applyReceiptItemTaxesAndReconcile` **仅用 `category_tax_class_map`**，分类多为 STANDARD_TAXABLE，**永远在分类之后才算税**，识别阶段写的启发式若不命中则 DB 仍 null。  
- 拟：在 **`applyReceiptItemTaxesAndReconcile`** 内对 **CAD、非 QC** 在分类前调用与识别端一致的 **`inferCanadianRetailGroceryTaxClass`**（商户/证据字符串含店名以便判 Walmart 等）；将 **EXEMPT 写回 `receipt_items`**；用现有 **`showToast`**（与 ToastHost 订阅）在 **仍有 variance 或刚标 exempt** 时提示；去掉 **`processReceiptInBackground` 内第二次 `apply`**（与 `updateReceipt` 重复）。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-item-tax.ts`**：扩充关键词与 **商超私牌 / WM 行样式**、**已知杂货商商户名**；`Shopping` 分类仅在 **杂货商 + 食品/私牌 SKU** 时标 EXEMPT；行税循环顺序为 **显式 override → 启发式 → `category_tax_class_map`**；持久化推断的 **`tax_class_code`**；**英文 Toast** 提示 exempt 行数与 variance。  
- **`receipt-helpers.ts`**：启发式第四参传入 **`payeeName`**。  
- **`receipt-processor.ts`**：移除重复的 **`applyReceiptItemTaxesAndReconcile` / `scheduleReceiptTaxRecalcIfNeeded`**。  
- **验证**：加国混合税小票保存后 **`receipt_item_taxes` 合计应逼近 `receipts.tax`**；原生拍完后应出现 Toast（无 Metro 亦可）。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`、`receipt-helpers.ts`、`receipt-processor.ts`

---

### 2026-04-08（EXEMPT/ZERO_RATED 走平台地区税率镜像，去掉前端启发式）

**User（提示词/原意）**  
- **免税应配置地区税率**，识别到 **`tax_class_code` 后直接套用**，不要用前端启发式；**魁北克不应再特殊判断**。

**Assistant（实现前说明）**  
- 现状：`crm.tax_rate_standard` 几乎仅 **STANDARD_TAXABLE**；`builtinStandardRates` 对 EXEMPT 返回空，`resolveRateRows` 曾禁止对 EXEMPT **ensureSpaceCatalogFromBuiltin**，免税行无法与应税行走同一套 **按税种解析** 的路径。  
- 拟：**迁移** 为每条 CA/US 的 STANDARD 行镜像 **EXEMPT、ZERO_RATED**（**相同 tax_kind、effective 区间，rate=0**）；**builtin** 对 EXEMPT/ZERO_RATED 返回与应税**相同税种结构、税率全 0**；**`resolveRateRows`** 在缺缓存时也对免税类 **ensure**；删除 **`inferCanadianRetailGroceryTaxClass` / `canApplyCanadianGroceryTaxHeuristic`** 及 **`applyReceiptItemTaxesAndReconcile` 内推断与写回**；**`gemini`** 说明由平台按辖区解析 0%。

**Assistant（实现后说明 / 本轮结论）**  
- **`20260408100000_crm_exempt_zero_rated_mirror_standard.sql`**：从 **STANDARD_TAXABLE** 复制 **EXEMPT、ZERO_RATED**（**country CA/US**）。  
- **`receipt-item-tax.ts`**：**`builtinStandardTaxableLines`** 补全 **NB/NL/PE/NS/QC**；**`builtinStandardRates`** 对 EXEMPT/ZERO_RATED 映射为 **0%**；**`resolveRateRows`** 对免税类同样 **builtin 回填**；移除全部加国关键词启发式；** variance Toast** 保留。  
- **`receipt-helpers.ts`**：仅保留模型 **`taxClassCode`** 规范化。  
- **`gemini.ts`**：**`RECEIPT_JSON_ITEMS_RULE`** 与平台税率一致表述。  
- **验证**：部署迁移后对任意省（含 **QC**）行 **`tax_class_code=EXEMPT`** 时 **`resolveRateRows`** 应得到 **与各税种对应的 0 税率行**（或写入空间缓存）；**须跑 Supabase migration**。

**关联**  
- `vouchap-app/supabase/migrations/20260408100000_crm_exempt_zero_rated_mirror_standard.sql`、`vouchap-app/src/shared-logic/receipt-item-tax.ts`、`receipt-helpers.ts`、`gemini.ts`

---

### 2026-04-08（拍照/文档识别丢弃 taxClassCode 导致行税永远按应税算）

**User（提示词/原意）**  
- **免税类目仍识别不对**，行税额与**票面仍不一致**。

**Assistant（实现前说明）**  
- **`recognizeReceipt`（图片）与 `recognizeReceiptFromDocument`** 在组装返回的 **`items` 时未拷贝 `taxClassCode`**，模型即便输出免税类，`convertGeminiResultToReceipt` 也拿不到 → DB **`tax_class_code` 空** → 仅 **`category_tax_class_map`**，几乎全部 **STANDARD_TAXABLE**。同一路径还曾**丢弃 `taxJurisdictionCountry/Region`**（蛇形字段也未兼容），辖区错会进一步放大差额。  
- 拟：映射 **`taxClassCode` / `tax_class_code` / `taxClass`** 并经 **`normalizeReceiptItemTaxClassCode`**；返回体写入 **`taxJurisdiction*`**；**`recognizeReceiptFromText` / 音频** 在统一 item 时显式写入 **`taxClassCode`**；规范化函数增加常见别名（如 **TAX_EXEMPT**）。

**Assistant（实现后说明 / 本轮结论）**  
- **`gemini.ts`**：新增 **`normalizedItemTaxClassCode`**；图片/文档返回项含 **`taxClassCode`** 与 **`taxJurisdictionCountry/Region`**（含 **`tax_jurisdiction_*`**）；文字与音频 item 合并逻辑同步。  
- **`receipt-item-tax.ts`**：**`TAX_CLASS_ALIASES`** 映射非法但常见的模型写法。  
- **验证**：对混合税小票拍照后 **`receipt_items.tax_class_code`** 应有 **EXEMPT**（若模型输出）；行税和逼近 **`receipts.tax`**（另需已部署 **EXEMPT 镜像 migration**）。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`、`vouchap-app/src/shared-logic/receipt-item-tax.ts`

---

### 2026-04-08（加拿大杂货分类默认 EXEMPT：无 map、非 QC）

**User（提示词/原意）**  
- **食品**仍未走 **0 税率**。

**Assistant（实现前说明）**  
- 仅依赖模型 **`taxClassCode`** 与 **`category_tax_class_map`** 时，预设分类名 **Groceries / Food / 食品** 等常**无 map 行**，回落 **STANDARD_TAXABLE**。  
- 拟：在 **`applyReceiptItemTaxesAndReconcile`** 与 **`convertGeminiResultToReceipt`** 中，当 **CAD、CA、辖区非 QC**、**行上无税类**、**分类无 `category_tax_class_map` 行**（避免覆盖用户显式 STANDARD）、且分类显示名匹配 **杂货类**（含 **grocer**、**grocery**、**food**、**食品/食物**，排除 **meal/restaurant/外餐** 等）→ **`EXEMPT`**（仍走平台镜像 0%）；算税后 **写回 `receipt_items.tax_class_code`**。  
- **QC** 不做分类默认免税（QST/食品规则复杂）。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-item-tax.ts`**：导出 **`canApplyCanadianGroceryCategoryExemptDefault`**、**`expenseCategoryDefaultsExemptInCanada`**；**`fetchCategoryTaxClassFromMap`** 区分 **hadRow**；杂货分类默认与持久化。  
- **`receipt-helpers.ts`**：转换时同步默认 **EXEMPT**。  
- **验证**：杂货小票、分类为 **Groceries**、无 map 时行税和应下降；若已为 **`category_tax_class_map` 配置税类**则以配置为准。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`、`receipt-helpers.ts`

---

### 2026-04-05（北美小票税：DB 规则、POS 码映射、Decimal、尾差与审计）

**User（提示词/原意）**  
- 从 **storeInfo / 辖区** 定位场景；逐项通过 **查库规则** 得税种与税率，**禁止**品类硬编码；**item_tax = price × Σrates**，区分 **inclusive / exclusive**；汇总与 **receipt.tax** 比对：**±0.02** 尾差摊到**金额最大应税行**，否则 **审计标记** + **`audit_comment`**；多税种、**Decimal**、负价折扣按税率比例。

**Assistant（实现前说明，若有）**  
- 新增 **`crm.pos_tax_code_rule`**（国家/省/商户 ILIKE / POS 字母 → **`tax_class_code`**）及示例 seed；**`receipt_items.pos_tax_code`**；**`receipts.tax_audit_required` / `tax_audit_comment`**。  
- **`receipt-item-tax.ts`**：**`decimal.js`** 算行税；解析顺序为 **行 `tax_class_code` → POS 规则 → `category_tax_class_map` → STANDARD**；移除 **加拿大杂货分类名默认 EXEMPT**；导出 **`getApplicableTaxRules`**；尾差与 **`finalizeReconciliation`**；**inclusive** 仅在**单价单一价内税种**时拆税。  
- **Gemini / types / database / receipt-helpers**：**`posTaxCode`** 管线；收据读写审计字段。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移：**`vouchap-app/supabase/migrations/20260409100000_pos_tax_code_rule_and_audit.sql`**。依赖：**`decimal.js`**。  
- **验证**：跑 migration 后，**MB Walmart 样例**在 **pos_tax_code=D/H** 且商户名匹配时应对 **`ZERO_RATED` / `STANDARD_TAXABLE`**；**|Σ 行税 − receipt.tax| ≤ 0.02** 时摊差后 **`tax_items_sum`** 对齐票面、**`tax_audit_required=false`**；超额则 **`variance` + 英文 audit 注释**。  
- **残留**：POS seed **merchant-specific**，生产需按零售商扩充；**价内税 + 多税种并行**未完整建模。

**关联**  
- `vouchap-app/supabase/migrations/20260409100000_pos_tax_code_rule_and_audit.sql`、`receipt-item-tax.ts`、`gemini.ts`、`database.ts`、`types/index.ts`、`receipt-helpers.ts`

---

### 2026-04-05（POS 税码：自动学习并晋升 CRM 规则）

**User（提示词/原意）**  
- 仅静态 **`pos_tax_code_rule` 没用**，必须配套**自动变聪明**的机制。

**Assistant（实现前说明，若有）**  
- 在**对账 matched**、行上 **`pos_tax_code` 存在**且**尚无匹配 CRM 规则**时，若税类来自 **模型行 `tax_class_code`** 或 **`category_tax_class_map` 有行**，则视为可信信号。  
- 新增 **`public.pos_tax_code_learning_events`** 追加观测；**SECURITY DEFINER** RPC **`record_pos_tax_learning_and_maybe_promote`**：校验 **user_spaces + receipt 归属**，同色类在 **180 天内达 `p_min_observations`（默认 2）** 且无**多类冲突**、无**已存在不同类规则**时，**INSERT `crm.pos_tax_code_rule`**（`source=learned`，`priority=150`）。商户名规范为 **`normalize_merchant_pattern_for_learning`**（空格→`%`，与 ILIKE 种子一致）。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移：**`20260410120000_pos_tax_code_learning.sql`**；**`receipt-item-tax.ts`** 在 **`finalStatus === matched`** 且非 **`recalcPass`** 时对符合条件的行逐个 **`rpc`**。  
- **验证**：两张「同店+同省+同 POS 码+同类」且对账成功的小票（或一单两行）后，应出现 **`learned`** 规则；下一张小票应能 **直接命中规则**。  
- **残留**：信噪依赖模型/分类；**多类同码**会 **`conflicting_classes`** 不晋升；不调用外网搜索。

**关联**  
- `vouchap-app/supabase/migrations/20260410120000_pos_tax_code_learning.sql`、`vouchap-app/src/shared-logic/receipt-item-tax.ts`

---

### 2026-04-05（POS D 仍按 STANDARD 计税：优先级与商户名）

**User（提示词/原意）**  
- 行上 **pos_tax_code=D** 应按规则 **ZERO_RATED**，却回填 **STANDARD_TAXABLE**，税额错且与票面校对失败仍落库。

**Assistant（实现前说明，若有）**  
- 根因：**`tax_class_code`（模型默认应税）优先于 `pos_tax_code_rule`**；另 **`entity` 未建时 `merchantName` 为空** 导致 **%WALMART%** 不匹配。  
- 拟：**CRM POS 规则优先**于行上模型税类；**`processed_by`** 补 **`supplierName`**；**商户 ILIKE** 改为 **分段字母数字** 匹配以使 **Wal-Mart** 命中 **WALMART**；命中规则后 **回写 `receipt_items.tax_class_code`**；**`getApplicableTaxRules`** 同步顺序。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`receipt-item-tax.ts`**（含 **`extractSupplierNameFromProcessedBy` export**）。小票主表仍会保存；校错时 **`tax_reconciliation_status=variance` / `tax_audit_required`** 为预期，根因修复后应对齐票面。  
- **验证**：无 entity、仅有 AI **`supplierName` + pos D + MB** 时行税应为 0 类镜面税率；DB 行 **`tax_class_code`** 应为 **ZERO_RATED**。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`

---

### 2026-04-05（清理 crm.tax_rate_standard 重复种子与库内重复行）

**User（提示词/原意）**  
- **`tax_rate_standard`** 已有数据检查清理，剔除不必要重复项。

**Assistant（实现前说明，若有）**  
- **061200** 中 CA 小样与 **061800** 全量 CA/US 种子自然键重复；**062000** 中 NS HST 插入与 **061800** 重复。  
- 拟：061200 **删除**该段 INSERT，以 **061800** 为唯一参考税率种子；062000 **删除**冗余 NS INSERT，**UPDATE US** 仅修正仍为 **effective_from = 2025-01-01** 的历史行；新增 **`20260411100000_tax_rate_standard_dedupe.sql`**：按自然键去重并 **回写 receipt_item_taxes** 再删多余 id。

**Assistant（实现后说明 / 本轮结论）**  
- 已修改 **`20260406120000_crm_tax_rate_standard.sql`**、**`20260406200000_tax_standard_us_effective_from_and_ns_hst.sql`**；新增 dedupe 迁移。新环境只依赖 **061800** 作为主种子。  
- **验证**：`supabase db reset` 或新库迁移后 **crm.tax_rate_standard** 无同键多行；生产若曾绕过唯一约束可跑 dedupe。

**关联**  
- `vouchap-app/supabase/migrations/20260406120000_crm_tax_rate_standard.sql`、`20260406200000_tax_standard_us_effective_from_and_ns_hst.sql`、`20260411100000_tax_rate_standard_dedupe.sql`

---

### 2026-04-05（CRM 表重命名：pos_tax_code_rule → tax_pos_code_rule）

**User（提示词/原意）**  
- **`pos_tax_code_rule`** 表更名为 **`tax_pos_code_rule`**。

**Assistant（实现前说明，若有）**  
- 基线迁移 **`20260409100000`** 改为新建 **`crm.tax_pos_code_rule`**（索引 **`idx_tax_pos_code_rule_country`**、RLS 策略名 **`crm_tax_pos_code_rule_select`**）；**`20260410120000`** 内 RPC / COMMENT 全部指向新表名。  
- 已部署且仍为旧表名的库：新增 **`20260411120000_rename_pos_tax_code_rule_to_tax_pos_code_rule.sql`**，**`RENAME`**（仅当 **`crm.pos_tax_code_rule`** 存在且 **`crm.tax_pos_code_rule`** 不存在）并 **`CREATE OR REPLACE`** **`record_pos_tax_learning_and_maybe_promote`**，避免函数体仍引用旧表名。  
- 应用层：**`receipt-item-tax.ts`** **`.schema('crm').from('tax_pos_code_rule')`**；**`types/index.ts`** 注释同步。

**Assistant（实现后说明 / 本轮结论）**  
- 已改上述迁移与 TS；新增 rename 迁移。  
- **验证**：新库 **`supabase db reset`** 后存在 **`crm.tax_pos_code_rule`**；旧库 **`db push`** 后旧表被重命名且学习 RPC 仍可晋升规则；客户端拉规则无 404。  
- **残留**：若历史环境 RLS 策略名仍为旧命名，仅影响可读性，不影响权限。

**关联**  
- `vouchap-app/supabase/migrations/20260409100000_pos_tax_code_rule_and_audit.sql`、`20260410120000_pos_tax_code_learning.sql`、`20260411120000_rename_pos_tax_code_rule_to_tax_pos_code_rule.sql`、`receipt-item-tax.ts`、`types/index.ts`

---

### 2026-04-05（Walmart：pos_tax_code 已有但 tax_class_code 未走 CRM 规则）

**User（提示词/原意）**  
- Walmart 小票 **POS code 已识别**，**`tax_class_code` 仍未按规则**（截图 **D/E** 等为 **STANDARD_TAXABLE**）。

**Assistant（实现前说明，若有）**  
- 根因 1：**已关联 entity 时仅用 `entity.name` 做 `%WALMART%` 匹配**，若实体名为用户改过、简称或与票头商户不一致，**不会再用 `processed_by` 里的商户**，导致 **POS 规则不命中**。  
- 根因 2：种子仅有 **D/H**，**无 **E**，E 行会落默认应税。  
- 拟：**`mergeMerchantHintsForPosRules(primary, extractSupplierNameFromProcessedBy)`** 合并后再 **`pickPosTaxClassFromRules`**；**扩大 `extractSupplierNameFromProcessedBy`**（`merchantName` / `storeName` / 一层 `parsedResult`）；**单字母码**在仅含杂字符时规范为字母位；学习 RPC 的 **`p_merchant_display_name`** 与 POS 匹配用同一合并串；**091000 + 迁移 111300** 增加 **CA Walmart E → ZERO_RATED**（示例种子，可按店修正）。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`receipt-item-tax.ts`**；已更新 **`20260409100000`** 种子并新增 **`20260411130000_tax_pos_code_rule_walmart_ca_e.sql`**。  
- **验证**：关联非 Walmart 实体但 **`processed_by.supplierName`** 含 Walmart 时，**D** 应解析为 **ZERO_RATED**；跑迁移后 **E** 同省/CA 兜底应有规则。若 **`crm.tax_pos_code_rule` 客户端查不到**（schema 未暴露），仍会得到空规则——需 Dashboard 暴露 **crm**。  
- **残留**：**GP** 等复合码需单独种子；**E 的税意因省/店可能不同**，运营可按实票改 **`maps_to_tax_class_code`**。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/supabase/migrations/20260409100000_pos_tax_code_rule_and_audit.sql`、`20260411130000_tax_pos_code_rule_walmart_ca_e.sql`

---

### 2026-04-05（票面税额驱动的 POS 码自学习：receipt.tax 拟合 + 学习）

**User（提示词/原意）**  
- 计算仍不对；应能根据**票面税额**发现不对；需要按**票面税额核算**做**自学习**，使 **`pos_tax_code` 含义**越来越准。

**Assistant（实现前说明，若有）**  
- 原学习仅在 **`tax_reconciliation_status=matched`** 且行类来自 **override/category** 时触发，**默认 STANDARD** 不参与**；与「用票面总额校验」脱节。  
- 拟：在 **`Σ` 行税 ≠ `receipt.tax`**（`variance`）时，对**有 `pos_tax_code` 且无 CRM POS 规则**的行做**坐标下降**（在 **STANDARD / ZERO_RATED / EXEMPT** 间试探），使 **`Σ`（含尾差摊分）与 `receipt.tax` 差 ≤ 0.02**；成功则**回写行 `tax_class_code`**、**`receipt_item_taxes` 用 `recalc`**，并对这些行调用 **`record_pos_tax_learning_and_maybe_promote`**（票面拟合标签）。  
- 首遍已 **matched** 时：保留原防刷策略（**纯默认 STANDARD** 不学），**拟合成功**则**一律**学。  
- 抽取 **`buildDraftsFromTaxClassMap`**、**`applyPennyTailAllocation`**、**`greedyFitPosLineClassesToReceiptTax`**；**`ApplyReceiptItemTaxOptions.skipReceiptTaxFit`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`vouchap-app/src/shared-logic/receipt-item-tax.ts`**（无新 DB 迁移）。  
- **验证**：构造 **税额对不齐** 且多行带 **POS 码**、无 CRM 规则的小票 → 拟合后应对齐票面并写入学习事件；**全票无 POS 码或仅 CRM 已锁行** → 不拟合。  
- **残留**：拟合**不唯一**时可能取到局部最优；行数 **>28** 跳过；**价内税+多税种**仍可能无法单靠三类切换对齐。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`

---

### 2026-04-05（Walmart POS E：仅 GST、不收 PST/RST — `GST_ONLY`）

**User（提示词/原意）**  
- 票面 **GST / PST（或 MB 的 RST）** 分项与计算不符；**`pos_tax_code=E` 不收 PST**（省税不应按全额应税摊到 E 行）。

**Assistant（实现前说明，若有）**  
- **E→`ZERO_RATED`** 会令 **GST+省税** 均为 0；**E→`STANDARD_TAXABLE`** 则 **GST+PST/RST** 全征 → **省税合计偏大**。  
- 拟新增 **`GST_ONLY`**：**MB/BC/SK** 在 CRM 为 **GST 5% + 省税税种 0%**；扩展 **POS 规则 / 学习** CHECK 与 RPC；**Walmart CA E** 改为 **`GST_ONLY`**；**builtinStandardRates** 与 **receipt.tax 拟合**候选含 **`GST_ONLY`**（CA MB/BC/SK）。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移 **`20260411140000_gst_only_tax_class_walmart_e.sql`**；已同步 **`091000`/`101200`/`111300`** 与 **`receipt-item-tax.ts`**。  
- **验证**：**`supabase db push`** 后 **E** 行仅 **5% GST**，省税仅来自 **非 E 应税行**；**`receipt.tax` 总额**校对应改善。  
- **残留**：票面印 **「PST」** 而 MB 实为 **RST** 仅为展示差异；**QC** 等未加 **GST_ONLY** 种子。

**关联**  
- `vouchap-app/supabase/migrations/20260411140000_gst_only_tax_class_walmart_e.sql`、`receipt-item-tax.ts`

---

### 2026-04-05（撤销 GST_ONLY：按税种过滤 + 票面规则收尾）

**User（提示词/原意）**  
- 不应新增 **`GST_ONLY`**，应为**多税种分别匹配**（如 POS 码仅计 GST）。  
- 总结：**严格按票面税额校验**，不对则重新组合，正确则学习；**票面税额为 0** 则各 item 税额记 0；**仅一项 item** 时：若票面已**分税种**则直接记入该 item；若**未分税种**则按规则拆分税种并校验票面。

**Assistant（实现前说明，若有）**  
- **`crm.tax_pos_code_rule.included_tax_kind_codes`**（NULL=辖区全部税种；`['GST']`=本行只保留 GST 分量）替代行税类 **`GST_ONLY`**；迁移 **`20260411140000_tax_pos_rule_included_tax_kinds.sql`** 等已就位。  
- 拟在 **`applyReceiptItemTaxesAndReconcile`**：`receipt.tax===0` 短路清空行税并 **matched**；**单明细 + `tax_breakdown`** 且分项和≈票面时直接写入 **`receipt_item_taxes`**；主循环用 **`resolvePosTaxCodeRule`** 建立 **`taxKindFilterByItemId`**，**`buildDraftsFromTaxClassMap`** / **`greedyFitPosLineClassesToReceiptTax`** 全路径传入；查询收据增加 **`tax_breakdown`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`vouchap-app/src/shared-logic/receipt-item-tax.ts`**：`parseReceiptTaxBreakdown` / **`canonicalTaxKindFromBreakdownKey`**（MB 票面 PST→RST）；零税额分支；单 item+**`tax_breakdown`** 与 **`receipt.tax`** 对齐则落库；主路径与拟合路径传入 **`taxKindFilterByItemId`**。  
- **验证**：零税小票 → 行税全 0；单 item 带 `{GST,PST}` JSON 且与总额一致 → 按税种写入；Walmart **E** + **`included_tax_kind_codes={GST}`** → 仅 GST 行分量。  
- **残留**：**保存/解析流水线**若未写入 **`tax_breakdown`** 需在各层类型与 insert 中补字段；多行小票仍依赖规则引擎+拟合与票面总额对齐。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/supabase/migrations/20260411140000_tax_pos_rule_included_tax_kinds.sql`

---

### 2026-04-05（crm.tax_rate_standard：EXEMPT / ZERO_RATED 不重复存）

**User（提示词/原意）**  
- `tax_rate_standard` 里**不需要 EXEMPT 与 ZERO_RATED 并存**（与不要 GST_ONLY 式冗余一致）。

**Assistant（实现前说明，若有）**  
- 现状：迁移 **`081000`** 对每条 **STANDARD** 复制了 **EXEMPT + ZERO_RATED** 两套全 0 行；语义上两行相同。  
- 拟：**CRM 只保留 EXEMPT 镜像**；**`receipt_items.tax_class_code`** 仍可为 **EXEMPT | ZERO_RATED**（申报/展示语义）；查询 CRM 时 **ZERO_RATED → EXEMPT**；**space cache** 对两种 class 并查以兼容旧缓存。

**Assistant（实现后说明 / 本轮结论）**  
- 新迁移 **`20260411150000_tax_rate_standard_drop_zero_rated_mirror.sql`**：`receipt_item_taxes` 上 FK 从 **ZERO_RATED** 标准行迁到同键 **EXEMPT** 行后 **DELETE ZERO_RATED**；更新表 COMMENT。  
- **`081000`** 改为只插入 **EXEMPT** 镜像（新库不再生成 **ZERO_RATED** CRM 行）。  
- **`receipt-item-tax.ts`**：`crmTaxClassForStandardLookup`、`queryCatalogCandidates` 对 **public.tax_rate_catalog** 在 EXEMPT/ZERO_RATED 时用 **`.in('tax_class_code', ['EXEMPT','ZERO_RATED'])`**。  
- **验证**：`supabase db push` 后 **crm** 无 **ZERO_RATED** 行；零税率行计算与 **crm_tax_rate_standard_id** 仍可用。

**关联**  
- `vouchap-app/supabase/migrations/20260408100000_crm_exempt_zero_rated_mirror_standard.sql`、`20260411150000_tax_rate_standard_drop_zero_rated_mirror.sql`、`receipt-item-tax.ts`

---

### 2026-04-05（无明细小票：合并为单行再走单明细税路径）

**User（提示词/原意）**  
- 无明细的小票处理有问题，应**落一行 item**，合并到**单明细**的处理路径（`tax_breakdown`、规则引擎等）。

**Assistant（实现前说明，若有）**  
- 原逻辑：**无 `receipt_items`** 时直接 **skipped** 且不写行税。  
- 拟：在 **`applyReceiptItemTaxesAndReconcile`** 内若明细为空，**插入一条**合成行（英文名 **Receipt total (merged)**），**price** = `total_amount − tax`（与常见价外税一致；缺税且 total>0 时用 total）；分类用空间内默认支出类；成功后再 **select** 明细并走原有流程。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`vouchap-app/src/shared-logic/receipt-item-tax.ts`**：`mergedLineExclusiveBase`、`pickDefaultExpenseCategoryId`、`ensureSingleMergedLineItem`；收据查询增加 **`total_amount`**。  
- **验证**：保存仅有抬头 **`total_amount`/`tax`**、无 AI 行明细的收据 → 应出现一行合并明细并完成税额拆分/对账；空间**无任何 category** 时仍会 skipped（与旧 save 依赖一致）。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`

---

### 2026-04-05（receipt_item_taxes 空表：ZERO/EXEMPT 被跳过 + 辖区无行时联邦兜底）

**User（提示词/原意）**  
- **`tax_class_code`**：item 与税种 **1:N**，直接挂一个 class 的结构有问题。  
- 实测：**pos_tax_code** 已有，**`receipt_item_taxes`** 仍无数据。

**Assistant（实现前说明，若有）**  
- **语义**：`tax_class_code` = **supply / 税率包**（选 CRM 哪套行）；**税种明细** = **`receipt_item_taxes`**（每 **`tax_kind_code`** 一行）。  
- **空表根因**：**`buildDraftsFromTaxClassMap`** 在 **`taxAmt.isZero() && rateZero`** 时跳过，**ZERO_RATED/EXEMPT** 下行税率全 0 → 无 draft。  
- 次要：strict 省份筛选无行时未退 **`region_code ''`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`receipt-item-tax.ts`**：**EXEMPT/ZERO_RATED** 仍写入 **amount=0** 的税种行；**`pickRatesForRegion`** 无省份行时用联邦行；**rateMap 空** 且 line price>0 时 **warn**。注释与 **`types/index.ts`** 已澄清。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/src/shared-logic/types/index.ts`

---

### 2026-04-06（Android Chat to log：相册 unregistered ActivityResultLauncher）

**User（提示词/原意）**  
- dev Android 端 expenses 的 chat 页面，上传文件报错（截图：`ExponentImagePicker.launchImageLibraryAsync` → `IllegalStateException: unregistered ActivityResultLauncher`）。

**Assistant（实现前说明，若有）**  
- 根因倾向：Expo Modules 在 Activity `onDestroy`/`onHostResume` 后会**异步**重新 `registerActivityContracts`；原先 Android 分支用 `InteractionManager.runAfterInteractions` + `setTimeout(0)` 推迟 `launch`，易与「旧 launcher 已 unregister、新 launcher 尚未挂好」的窗口重叠；连续第二次打开相册更易触发。  
- 拟：`chat-to-log.tsx` 内改为在权限通过后**立即**调用 `launchImageLibraryAsync`，并对仅含 `unregistered ActivityResultLauncher` 的失败做短 backoff **重试**（最多 3 次）。

**Assistant（实现后说明 / 本轮结论）**  
- 已新增 `launchImageLibraryAsyncWithAndroidRelaunchRetries` + `isAndroidImagePickerLauncherNotReadyError`，移除 Android 的 defer 分支，统一 `await launchPicker()`。  
- **验证**：真机/Android 模拟器 Chat to log → 连续多次点相册选图（可先传 PDF/图再传 JPEG）；不应再出现该 IllegalStateException。若仍偶发，可把重试间隔略加大或检查开发者选项「不保留活动」场景。

**关联**  
- `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`

---

### 2026-04-07（梳理现有税拆分实现 + 目标设计方案纲要）

**User（提示词/原意）**  
- 完整梳理此前代码与 SQL，并按 7 点重新梳理「税额拆到 item」的设计：①标准税率表不重复税种（如安省只挂 HST）；②receipt 用 JSON 记录分税种税额并做合计校验；③item 据辖区+pos_tax_code 判定关联税种并 JSON 落库；④按标准表算分项写入 `receipt_item_taxes`；⑤CRM 增加带 `entity_id` 的 `pos_tax_code` 表及模型自学习；⑥残差反推法分配不确定行；⑦清理无用表字段。

**Assistant（实现前说明，若有）**  
- 无本轮代码变更；通读迁移 `20260405220000`…`20260411150000` 与 `receipt-item-tax.ts`、`gemini.ts` 等，输出与现状对齐的设计纲要供后续实现对齐。

**Assistant（实现后说明 / 本轮结论）**  
- 见对话回复：**现状映射**（`crm.tax_rate_standard`、`tax_rate_catalog`、`receipt_item_taxes`、`tax_pos_code_rule`、`pos_tax_code_learning_events`、`receipts.tax_breakdown`）与 **目标架构缺口**（按税种对账、`entity_id` 维度、残差按税种分配、税率/POS 规则的自学习写入路径、废弃对象清点）。  
- **验证**：后续落地分支可对每条需求写迁移 + 单测/集成收据样例（多行 MB Walmart、ON HST、`tax_breakdown` 与多行分摊）。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`、`vouchap-app/supabase/migrations/202604*.sql`

---

### 2026-04-07（entity_pos_tax_code：弃用 tax_rate_catalog / category 映射 / 旧学习表）

**User（提示词/原意）**  
- 整合清理 `public.tax_rate_catalog`、`category_tax_class_map`、`pos_tax_code_learning_events`；标准税率只认 **crm**；商家税码表 **entity_pos_tax_code** 放 **public** 且 **entity → public.entities.id**；其余按前序设计改代码。

**Assistant（实现前说明，若有）**  
- 新增迁移：``entity_pos_tax_code``、``entity_pos_tax_code_learning_events``、``record_entity_pos_tax_learning_and_maybe_promote``；删 ``tax_rate_catalog_id``、插入 ``entity_pos_tax_code_id``、行上 ``applicable_tax_kinds``；DROP 三旧表与旧 RPC。  
- ``receipt-item-tax.ts``：仅用 ``crm.tax_rate_standard`` + 内置 fallback；POS 先 ``entity_pos_tax_code`` 再 ``crm.tax_pos_code_rule``；去掉 category 映射查询；学习仅在有 ``receipt.entity_id`` 时写实体规则。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移：``vouchap-app/supabase/migrations/20260412100000_entity_pos_tax_code_tax_catalog_cleanup.sql``。  
- 逻辑：``receipt-item-tax.ts``、``types/index.ts`` 注释。  
- **验证**：`supabase db push` / 本地迁移后，有 entity 的收据多次相同 pos 码应对账并升格 ``entity_pos_tax_code``；无 CRM 行辖区仍能靠内置税率算行税。  
- **说明**：表名采用 ``entity_pos_tax_code``（与用户命名一致）；种子/运营仍可手插该行；**crm.tax_pos_code_rule** 仍作无 entity 或兜底匹配。

**关联**  
- `20260412100000_entity_pos_tax_code_tax_catalog_cleanup.sql`、`receipt-item-tax.ts`

---

### 2026-04-07（entity_pos_tax_code 增加 space_id 与 entities 对齐）

**User（提示词/原意）**  
- `entity_pos_tax_code` 仅 FK `entities.id` 不妥，`entities` 按 space 区分；迁移尚未执行，需微调 SQL。

**Assistant（实现前说明，若有）**  
- 为 `entity_pos_tax_code` / `entity_pos_tax_code_learning_events` 增加 **`space_id`**（FK `spaces`），触发器校验 **`entities.space_id`**、收据 **`receipts.space_id`** 一致；RLS 改为按 **`space_id ∈ user_spaces`**；RPC 与 TS 查询均带 **`space_id`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`20260412100000_entity_pos_tax_code_tax_catalog_cleanup.sql`**；**`receipt-item-tax.ts`**：`fetchEntityPosTaxCodesForEntity(spaceId,…)`，**`getApplicableTaxRules`** 恢复必填 **`spaceId`**。

**关联**  
- 同上迁移与 `receipt-item-tax.ts`

---

### 2026-04-07（更正：entity_pos_tax_code 不按 space；merchant 键不得 FK entities）

**User（提示词/原意）**  
- 不是要给 `entity_pos_tax_code` 增加 `space_id`，该表是**共用目录**；重点是表里的「商户实体」**不能**关联 `public.entities.id`（entities 按 space 区分）。

**Assistant（实现前说明，若有）**  
- 迁移与类型已按 **`merchant_entity_id`（无 FK）** + 收据列 **`receipts.merchant_entity_id`** 建模；补一处代码遗漏：`getAllReceipts` 完整映射需透出 **`merchantEntityId`**，否则详情页税逻辑与列表不一致。

**Assistant（实现后说明 / 本轮结论）**  
- **`vouchap-app/src/shared-logic/database.ts`**：在 `getAllReceipts` 的 `rows.map` 返回对象中增加 **`merchantEntityId`**（与 `getAllReceiptsForList` 等路径一致）。  
- **验证**：拉取含 `merchant_entity_id` 的收据详情，`Receipt.merchantEntityId` 有值且行税解析可命中 `entity_pos_tax_code`。  
- **说明**：上一条「给 `entity_pos_tax_code` 加 `space_id`」的方向已废弃；**学习事件表**仍保留 `space_id` 仅作 RLS/收据归属校验，**目录表**无 `space_id`。

**关联**  
- `20260412100000_entity_pos_tax_code_tax_catalog_cleanup.sql`、`database.ts`

---

### 2026-04-07（Engagement / Todos：task 行 Upload 支持任意文件类型）

**User（提示词/原意）**  
- engagement 详情页 todos、task 行上传文件，需支持上传所有文件格式，不局限于图片。

**Assistant（实现前说明，若有）**  
- Engagement 与 project 详情共用 **`TaxFilingTodosView`**，原 **`expo-image-picker`** 仅相册图片；改为 **`expo-document-picker`** 的 `*/*`，Web 侧 **`base64: false`** 便于 blob 上传。  
- **`uploadTaxFilingFile`** 已支持 `fileName`/`mimeType`；补 **`getFileExtAndMime`**：在文档/图片规则之后，对任意扩展名用 picker MIME 或 `application/octet-stream`，避免非图非表拆文档被误标成 `.jpg`。  
- **`processTaxFilingAttachmentAfterCreate`** 的 **`isImage`** 按 MIME/扩展名判断；抽出 **`tax-filing-todo-upload-helpers`** 供 **`tax-filing/order/[orderId]/index.tsx`** 内嵌 Todo 树同款上传路径复用。

**Assistant（实现后说明 / 本轮结论）**  
- 改动：**`TaxFilingTodosView.tsx`**（DocumentPicker + 正确 `isImage`）、**`supabase.ts`**（`getFileExtAndMime` 泛型扩展名）、**`tax-filing-todo-upload-helpers.ts`**（新建）、**`tax-filing/order/[orderId]/index.tsx`**（与上一致的 picker）。  
- **验证**：在 engagement / project Todos 点 task 行 Upload，可选 PDF、Office、ZIP 等；上传后存储扩展名与 MIME 合理；图片仍走 image 识别路径。  
- **风险**：极大文件 + `copyToCacheDirectory: true` 在移动端可能有性能/空间压力；AI 识别对非扫描类文件可能失败（既有行为）。

**关联**  
- `vouchap-app/src/mobile-ui/components/TaxFilingTodosView.tsx`、`vouchap-app/src/shared-logic/supabase.ts`、`vouchap-app/src/shared-logic/tax-filing-todo-upload-helpers.ts`、`vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/index.tsx`

---

### 2026-04-07（Chat 税表附件：完整展示名 + display_name + 行内改名）

**User（提示词/原意）**  
- Chat 提交 tax 文件时，仅用 **`project_todo_attachments.doc_type`** 作标题辨识度低；需要完整命名，并支持用户修改；重命名交互复用 task 名称修改（输入 + 确认/取消）。

**Assistant（实现前说明，若有）**  
- **`doc_type`** 保留为 AI 机器码；新增 **`source_file_name`**、**`display_name`**（迁移），识别成功后 **`display_name`** 由 **`buildTaxFilingAttachmentDefaultDisplayName`**（摘要首行 / 类型可读串 / 原始文件名）生成。  
- **`chat-to-log`** 卡片主标题用 **`displayName`**，**`Type: doc_type`** 降为副标；铅笔进入行内 **`TextInput` + Cancel + 确认**，写入 **`updateProjectTodoAttachment.display_name`**；历史消息 id 为 **`{logId}-preview`** 时同步 **`updateChatLogResponseData`**。  
- 列表/跟进：**`firm.ts`** 附件行映射统一走 **`projectTodoAttachmentRowToSummary`**；**`tax-filing-attachment-followup`** 与 chat 识别写库、**`TaxFilingTodosView`** 重试识别补 **`display_name`**；订单页附件卡主标题改为 **`f.name`**。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移 **`20260407140000_project_todo_attachments_display_name.sql`**；新建 **`tax-filing-attachment-display-name.ts`**；改 **`firm.ts`**、**`tax-filing-attachment-followup.ts`**、**`chat-to-log.tsx`**、**`TaxFilingTodosView.tsx`**、**`tax-filing/order/[orderId]/index.tsx`**。  
- **验证**：跑迁移 → Chat 上传税表 → 卡片标题为完整默认名 → 铅笔改名后任务列表与重新进入 Chat 历史一致；详情弹窗标题优先 **`display_name`**。  
- **说明**：瞬态消息 id **`attach-preview-{attachmentId}`** 无对应 **`ai_chat_logs.id`**，改名仅落库附件；重进会话后 enrich 仍正确。

**关联**  
- `20260407140000_project_todo_attachments_display_name.sql`、`tax-filing-attachment-display-name.ts`、`firm.ts`、`chat-to-log.tsx`

---

### 2026-04-07（补：Chat 税表附件改名入口图标不可见）

**User（提示词/原意）**  
- 没有出现编辑名称的入口 icon。

**Assistant（实现后说明 / 本轮结论）**  
- **原因**：标题 **`Text`** 使用 **`flex: 1`** 时在 Web/React Native Web 上易占满行宽，右侧铅笔被挤到 **`minWidth: 0`** 区域外不可见；另 **`voucherType`** 与消息上类型不一致时整块卡片条件不成立。  
- **修复**：卡片条件改为仅依赖 **`attachmentPreview` 的 tax 形状**（**`id` + `projectId` + `todoId`**）；标题外包 **`attachmentPreviewTitleTextWrap`（flex:1）**；铅笔改为 **`create-outline` + 浅紫底按钮 `attachmentPreviewEditBtn`**。（后续需求已将改名入口从 Chat 迁至 Todos，见下条。）

**关联**  
- `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`

---

### 2026-04-07（附件显示名改名：从 Chat 卡片迁至 Todos 文件行）

**User（提示词/原意）**  
- 聊天卡片上不宜修改；在 **Todos 列表上展开任务后的文件名称** 增加与 task 名称相同的行内修改交互。

**Assistant（实现前说明，若有）**  
- 移除 **`chat-to-log.tsx`** 中税表附件卡片的铅笔/行内输入/`persistTaxFilingAttachmentDisplayName` 及相关样式；卡片仅展示标题 + **`Type:`**。  
- 在 **`TaxFilingTodosView.tsx`** 的 **`TodoTree`** 附件行：Web 且非 catalog 只读时显示改名铅笔；行内 **`TextInput` + 关闭/确认** 对齐 task **`renameInline`**，确认调用 **`updateProjectTodoAttachment({ display_name })`** 后 **`refreshFiles(tree)`**；递归子树透传新 props；task/附件改名互斥（新开一端时清空另一端草稿）。

**Assistant（实现后说明 / 本轮结论）**  
- 已按上实现。  
- **验证**：Web 打开税表项目 Todos → 展开任务 → 文件行铅笔 → 改名保存 → 列表与 DB **`display_name`** 一致；Chat 历史卡片仅只读展示名（改名后重进群聊 enrich 仍可对齐）。  
- **残留**：若在 Todos 改名，已加载的 Chat 本地消息中的 **`attachmentPreview.displayName`** 不会即时变，需依赖重载/重新拉历史。

**关联**  
- `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`、`vouchap-app/src/mobile-ui/components/TaxFilingTodosView.tsx`

---

### 2026-04-07（Todos/订单直接上传：不写 chat 历史）

**User（提示词/原意）**  
- **直接 upload**（非聊天内提交）的文件，**不要出现在聊天记录**里。

**Assistant（实现前说明，若有）**  
- 直接上传路径在识别成功后调用 **`processTaxFilingAttachmentAfterCreate`**，其内 **`saveTaxFilingAttachmentChatLog`** 会向 **`ai_chat_logs`** 插入与聊天一致的 **`attachmentPreview`**，导致 Tina 历史里出现 Todos/订单上传。  
- 移除该写入；聊天内税表上传仍由 **`chat-to-log.tsx`** 内 **`saveChatLog`** 负责。删除仅被该链路引用的 **`tax-filing-chat-log.ts`**；**`processTaxFilingAttachmentAfterCreate`** 去掉已无用的 **`orderId`** 参数。

**Assistant（实现后说明 / 本轮结论）**  
- 已移除 **`saveTaxFilingAttachmentChatLog`** 调用并删除模块；调用方入参已更新。  
- **验证**：在 Todos 或订单页任务行上传 → 任务下列表有文件、识别正常 → 打开同项目聊天拉历史 → 无对应 **`attachmentPreview`** 新行；仅在聊天里上传仍有卡片与 **`saveChatLog`**。  
- **说明**：此前已写入的 **`ai_chat_logs`** 不会自动删除，仅影响新上传。

**关联**  
- `vouchap-app/src/shared-logic/tax-filing-attachment-followup.ts`、`TaxFilingTodosView.tsx`、`tax-filing/order/[orderId]/index.tsx`（已删 `tax-filing-chat-log.ts`）

---

### 2026-04-07（Todos 附件改名：原位输入框 + 悬停显铅笔）

**User（提示词/原意）**  
- 修改文件名的输入框要在**阅读状态文件名称的原位**；改名入口 icon 应像 **Todos 任务行**一样**鼠标悬停/触摸热区**出现，而非常显。

**Assistant（实现前说明，若有）**  
- 原文附件行使用固定宽度 **`fileRenameListInputWidthPx`** 的输入轨，与文件名槽位错位；铅笔始终渲染。  
- 改为：附件 **`TouchableOpacity`** 上 **`onMouseEnter` / `onMouseLeave`**（与任务标题相同的 **400ms** 延时清除，新建 **`hideFileRowHoverTimeoutRef` + `fileRowHoverKey`**）；仅当 **`fileRowHoverKey`** 匹配 **`todoId + attachmentId`** 时显示 **`create-outline`**，样式对齐任务 **`terminateTaskBtnHotzone`**。行内改名用 **`fileRenameInlineNameRow`**：`TextInput` **`flex:1` + `minWidth:0`** 占据原 **`fileRowName`** 槽位，右侧保留取消/确认。进入任务行内改名时清空附件 hover，避免状态串扰。

**Assistant（实现后说明 / 本轮结论）**  
- 已改于 **`TaxFilingTodosView.tsx`**（**`TodoTree`** 附件行 + 样式 + 父级 state/callback）；移除 **`fileRenameListInputWidthPx`** 附件改名用法。  
- **验证**（Web）：展开任务 → 不悬停时无铅笔 → 悬停该行出现铅笔 → 点击后输入框覆盖原文件名区域 → 保存后列表更新。  
- **限制**：与任务标题一致，**Web** 主要依赖鼠标悬停；纯触摸 Web 端无 hover 时行为与任务行铅笔一致。

**关联**  
- `vouchap-app/src/mobile-ui/components/TaxFilingTodosView.tsx`

---

### 2026-04-07（Todos：终止/恢复/提交类操作乐观更新）

**User（提示词/原意）**  
- Todos 上**终止 task、提交、撤回**等操作要**前端先出结果**，**后端异步写库**，避免点击后延迟像没点上。

**Assistant（实现前说明，若有）**  
- 原 **`TaxFilingTodosView`** 中 **`onCancelTask` / `onRestoreTask`** 与 **Handoff 浮窗确认** 均 **`await` 写库后再 `refreshTodosPreservingScroll`**，网络慢时 UI 不变。  
- 抽 **`cloneProjectTodoTree` + `patchProjectTodoInTree`**（**`shared-logic/project-todo-tree-patch.ts`**）。当存在 **`onMergeProjectTodosTree`** 时：先 **`onMergeProjectTodosTree(patch…)`** 乐观改 **`status` / `type`**，再 **fire-and-forget** **`updateProjectTodo` / `changeProjectTodoResponsibleSide`**；失败则用快照 **`onMergeProjectTodosTree(snapshot)`** 回滚并 **`alert`**。无 **`onMergeProjectTodosTree`** 时保持原 **`await` + 全量刷新**（父级未提供本地合并无法乐观）。订单页内嵌 **TodoTree** 同步：**`setTree` 乐观 + 异步写库 + 失败回滚**；成功后仅刷新 **attachments map**（与此前全量拉树相比减轻闪烁）。Handoff：**先关浮窗**再合并树，避免遮罩挡反馈。

**Assistant（实现后说明 / 本轮结论）**  
- 已落地于 **`project-todo-tree-patch.ts`**、**`TaxFilingTodosView.tsx`**、**`tax-filing/order/[orderId]/index.tsx`**。  
- **验证**：有 **`onMergeProjectTodosTree`** 的入口点击终止/恢复/Confirm submit → 列表立即变；断网或故意失败应回滚并弹错。  
- **残留**：成功路径依赖 **Realtime / 他端** 时仍可能二次刷新；无 merge 回调的挂载点仍为阻塞刷新。

**关联**  
- `vouchap-app/src/shared-logic/project-todo-tree-patch.ts`、`TaxFilingTodosView.tsx`、`tax-filing/order/[orderId]/index.tsx`

---

### 2026-04-07（Service Marketplace：确认浮窗右侧模板预览）

**User（提示词/原意）**  
- service marketplace 的 **Confirm your selection** 浮窗，**右侧**加上与列表一致的 **template 标准预览组件**。

**Assistant（实现前说明，若有）**  
- **`MarketplaceServiceSelectionModal`**：可选 **`templatePreviewItem`**（与网格相同的 **`ProjectListCardItem`**）；Web 且窗宽 ≥680 时 **两栏**：右侧 **Template preview** + 只读 **`ProjectListCard`**；窄屏/原生在 **高亮块与 Next steps 之间**插入同一预览。  
- **`service-catalog`**：用 **`firmSkuToProjectListItem(pendingMarketplaceSku, { firmFooter: true, forClientMarketplace: true })`** 传入，与目录卡一致。  
- 修复样式：`StyleSheet` 中误用未定义变量 **`previewAsideWidth`** 改为固定 **`width: 316`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已接好 **`templatePreviewItem`**；catalog 侧 **`useMemo`** 映射 pending SKU。侧栏宽度字面量，**lint** 通过。  
- **验证**：打开 Service Marketplace → 选一项 → **Confirm** 浮窗：Web 宽屏右侧见与网格一致的 **`ProjectListCard`**；缩窄或移动端预览出现在高亮与步骤之间。

**关联**  
- `vouchap-app/src/mobile-ui/components/MarketplaceServiceSelectionModal.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/service-catalog.tsx`

---

### 2026-04-07（Service Marketplace 确认浮窗：对齐 Add client 布局 + SkuPreview）

**User（提示词/原意）**  
- 找已设计过的**标准 SKU 预览**；浮窗布局需**复用 Add client** 浮窗。

**Assistant（实现前说明，若有）**  
- 标准预览组件为 **`SkuPreview`**（Add client / engagements / invite 共用）；Add client 外壳为 **`CenterModal`** + **`FirmAddClientModal`** 内 **`addClientFormRow`** 双栏（左滚动表单区、右 **`Service preview`** + **`SkuPreview`**）。  
- 将 **`MarketplaceServiceSelectionModal`** 改为同一 **`CenterModal`** 尺寸（**`maxWidth={840}` `cardHeight={660}`**）、同款双栏样式与右侧 **`SkuPreview`**；入参由 **`templatePreviewItem`** 改为 **`previewSku: FirmSku`**（catalog 传 **`pendingMarketplaceSku`**）。  
- 左侧保留确认文案 + Firm/Service 高亮 + Next steps；底部按钮样式对齐 Add client（**`flex: 1` / `flex: 1.618`**）。列表符号改为 **•**。

**Assistant（实现后说明 / 本轮结论）**  
- 已替换实现并完成 catalog 传参；**lint** 无报错。  
- **验证**：打开确认浮窗 → 外观与 Add client 一致（大圆角卡片、双栏、右侧文档树预览）；**Continue** 进入 consent 流程不变。

**关联**  
- `MarketplaceServiceSelectionModal.tsx`、`service-catalog.tsx`；参照 `FirmAddClientModal.tsx`、`SkuPreview.tsx`、`CenterModal.tsx`

---

### 2026-04-07（Marketplace 确认浮窗：修正按钮相对 SkuPreview 下缘偏高/偏低）

**User（提示词/原意）**  
- 按钮仍**太靠下**，与预览组件下缘**没对齐**。

**Assistant（实现前说明，若有）**  
- 根因：**`formRow` / 左栏用了 `minHeight`**，左栏（文案 + 步骤 + 按钮）**内容高度常大于** 右侧「标题 + 560 预览」，行高由左栏**撑开**；右栏 **`stretch`** 后在 **`SkuPreview` 下方出现空白**，按钮贴着**行底**就会落在预览卡**下缘之下**。  
- 处理：双栏行改为**固定 `height: 560 + lineHeight(18) + marginBottom(8)`**，与 `previewTitle` 的 **`lineHeight` / `marginBottom` 常量一致**；去掉会在视觉上把按钮再往下推的 **`btnRow.paddingTop`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`MarketplaceServiceSelectionModal.tsx`**。

---

### 2026-04-07（Marketplace 确认浮窗：Cancel/Continue 与 SkuPreview 下缘对齐）

**User（提示词/原意）**  
- **Cancel / Continue** 按钮**下缘**与**预览组件下缘**对齐。

**Assistant（实现前说明，若有）**  
- 原先按钮在左侧 **`ScrollView`** 内且左栏 **`maxHeight: 560`**，与右侧「**Service preview** + 560 卡片」总高不一致。  
- 改为左侧 **`leftPane`**：`minHeight` = 与右栏相同的 **`PREVIEW_COLUMN_HEIGHT`**（**560 + 标题区**），**`ScrollView` `flex:1`** 仅承载说明与高亮、Next steps；**`btnRow` 移出 Scroll** 置于列底；双栏 **`alignItems: stretch`**。占位预览 **`minHeight/maxHeight`** 与卡片高一致。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`MarketplaceServiceSelectionModal.tsx`**；静态检查通过。  
- **验证**：打开确认浮窗 — 右栏卡片底与左栏按钮底同一水平线；左栏正文过长时仅中间区域滚动。

---

### 2026-04-08（Engagement Todos 操作行：隐藏 0 文件 / 隐藏 canceled）

**User（提示词/原意）**  
- engagement 的 todos 列表页，在操作行（Todos/Info 页签、Terminate 等所在行），与文件计数列、状态标签列对齐位置增加复选框：**隐藏 0 文件**、**隐藏 canceled**（产品 UI 文案英文）。

**Assistant（实现前说明，若有）**  
- 在 **`ProjectDetailView`** 的 **`operationBar`** 内增加两枚筛选（`Pressable` + `Ionicons`），右对齐以贴近列表右侧「文件列 / 状态列」；列宽取自 **`TaxFilingTodosView`** 内与 `progressFilesCol`、`statusCol` 一致的导出常量 **`ENGAGEMENT_TODO_TOOLBAR_FILTER_LAYOUT`**。  
- 在 **`TaxFilingTodosView`** 增加可选 props **`hideTasksWithNoFiles` / `hideCanceledTasks`**，对 **`itemKind === 'task'`** 递归过滤树（无附件视为 `taskFilesMap[id]` 长度 0；**`status === 'canceled'`**）；空 phase/section 连带移除；与 Web 拖放预览树同一套源树再过滤；catalog 模式不启用。

**Assistant（实现后说明 / 本轮结论）**  
- 已实现：`ProjectDetailView.tsx`（状态 + 操作行 UI + 传参）、`TaxFilingTodosView.tsx`（导出布局常量、**`filterProjectTodoTreeForListDisplay`**、**`displayListTree`**、筛选后无行时提示 **「No tasks match the current filters.」**）。  
- **验证**：Firm engagement / client project 详情、Todos 页签、有真实任务树时，勾选后列表仅隐藏对应 task；全被筛掉时出现提示文案；onboarding SKU 只读 catalog 树不显示筛选。  
- **已知限制**：移动端下列宽为紧凑近似值，与列表右侧列像素级对齐可能略差于 Web。

**关联**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`、`TaxFilingTodosView.tsx`

---

### 2026-04-08（Engagement Todos 筛选条与列表列水平对齐修正）

**User（提示词/原意）**  
- 复选框位置太靠右，与文件列/状态列未对齐。

**Assistant（实现前说明，若有）**  
- 原实现把筛选放在 `operationBarMain` 内 `flex-end`，会贴在 Web **Terminate** 或移动端 **状态 pill** 左侧，与列表右侧列（相对 Scroll 16 + `treeRow.paddingRight`）不一致。  
- 改为：`operationBar` `position: 'relative'`，筛选 **`absolute`**，`right` 仅用 **`treeRow` 的 `paddingRight`**（与 `operationBar` 已有 16 内边距衔接）；Web **`operationRight`**、移动端 **pill** 在显示筛选时预留 **`fileCol + gap + statusCol`** 宽度，避免遮挡。

**Assistant（实现后说明 / 本轮结论）**  
- 已调整：`ENGAGEMENT_TODO_LIST_ALIGNED_RIGHT_INSET` 改为 12（Web）/ 4（原生）；`ProjectDetailView` 去掉流式筛选区、改为绝对层 + 预留边距。

**关联**  
- 同上两文件

---

### 2026-04-08（筛选条 right  inset 修正：16 + treeRow padding）

**User（提示词/原意）**  
- 筛选跑到最右端，比刚才更不对齐。

**Assistant（实现后说明 / 本轮结论）**  
- **原因**：绝对定位的 `right` 相对 `operationBar` **外缘**计量时，仅用 `treeRow.paddingRight`（12/4）会少算与列表一致的 **16**（与 `scrollContent` / bar 相同的横向 padding），筛选项会多靠右约 16px。  
- **处理**：`ENGAGEMENT_TODO_LIST_ALIGNED_RIGHT_INSET` 恢复为 **`16 + (web ? 12 : 4)`**，并同步 **`components/`** 与 **`src/mobile-ui/components/`** 两份 `TaxFilingTodosView.tsx`（仓库内双份实现）。

**关联**  
- `TaxFilingTodosView.tsx`（两处）

---

### 2026-04-08（Todos 筛选：操作行中部 + 不挤占 Terminate + 缩小字号）

**User（提示词/原意）**  
- 筛选仍在 Terminate 右侧，应在**该行中部**；**不影响**右端按钮位置；**字号略小**。

**Assistant（实现后说明 / 本轮结论）**  
- **`ProjectDetailView`**：操作行改为三段 — **左** Todos/Info、`flex:1` **居中**筛选、`flexShrink:0` **右** 状态 pill（移动）或 Web **operationRight**；去掉绝对定位及对 `operationRight` / pill 的 `marginRight` 预留。  
- 筛选：**Ionicons 16**，文案 **Web 10 / 原生 8** `pt`；项间 `todoFilterBetween`；`todoFilterCheck` 使用 `maxWidth: '48%'` 防窄屏溢出。  
- 移除不再使用的 **`ENGAGEMENT_TODO_*` 导出**（`components/TaxFilingTodosView.tsx`；`src/mobile-ui` 副本已无该段）。

**关联**  
- `components/ProjectDetailView.tsx`、`components/TaxFilingTodosView.tsx`（及同步的 `src/mobile-ui/components/ProjectDetailView.tsx`）

---

### 2026-04-08（Todos 筛选文案单行）

**User（提示词/原意）**  
- 位置可以；**文案不要换行**。

**Assistant（实现后说明 / 本轮结论）**  
- `ProjectDetailView` 筛选 `Text`：`numberOfLines={1}`、`ellipsizeMode="tail"`；`todoFilterCheckRow` `flexWrap: 'nowrap'`；`todoFilterCheck` / `todoFilterCheckText` `flexShrink: 1`、`minWidth: 0` 以便极窄时单行省略而非折行。

**关联**  
- `components/ProjectDetailView.tsx`、`src/mobile-ui/components/ProjectDetailView.tsx`

---

### 2026-04-08（Tina 附件 display_name：简明、与 summary 解耦）

**User（提示词/原意）**  
- Tina 识别的文件名此前要更完整可读，现在过于啰嗦，和文件描述一样；要**简明但仍完整可读**。

**Assistant（实现前说明，若有）**  
- 原逻辑用 `summary` 首行 + 文件名拼 `head — tail`，标题与 `summary` 字段大量重复。  
- 改为：`buildTaxFilingAttachmentDefaultDisplayName` 以 **`docType` 可读标签**为主；**优先**非泛化**原始文件名 stem**；仅在 IMG_/DSC_ 等泛化名时用 **summary 的短片段**（首句或截断至 ~36 字），整体 cap **~68** 字符；去掉与 type 重复的 tail。

**Assistant（实现后说明 / 本轮结论）**  
- 已重写 **`vouchap-app/src/shared-logic/tax-filing-attachment-display-name.ts`**。  
- **验证**：新识别附件列表标题应短于描述；仍含类型 + 可辨片语。

**关联**  
- 调用方：`tax-filing-attachment-followup.ts`、`chat-to-log.tsx`、`TaxFilingTodosView.tsx`、`firm.ts`（通过同一函数）

---

### 2026-04-08（Tina display_name：优先摘要可读短语）

**User（提示词/原意）**  
- 上一版简化过度；示例应显示为 **「Prescription receipt from Greencrest Pharmacy」** 一类，而非 **EXPENSE RECEIPT · 1000092341**。

**Assistant（实现后说明 / 本轮结论）**  
- 更新 **`tax-filing-attachment-display-name.ts`**：有 `summary` 时优先 **`readablePhraseFromSummary`**（去 *This is a…* 前缀、在 **「 for 」** 前截断、可再按首句 `. ` 截断），再句首大写；总长 cap **68**。纯数字/仅数字文件名视为泛化，不再与 doc_type 拼成标题。无可用摘要短语时回退 **doc_type · 文件名 / 短摘要片段**。

**关联**  
- `src/shared-logic/tax-filing-attachment-display-name.ts`

---

### 2026-04-08（附件卡片：避免与标题重复的summary + 通用去前缀）

**User（提示词/原意）**  
- 反对靠穷举规则的生硬字符截断；举例：标题与灰字 summary 开头重复，且 ellipsis 落在词中间（如 *Decemb…*）。

**Assistant（实现前说明，若有）**  
- 标题侧：用**一条通用正则**覆盖 *This …（中间 1–4 个词）… is a/an/the …*，与现有 *This is a…* 并列，减少「This document is a …」未剥离问题。  
- 卡片第二行：新增 **`taxFilingAttachmentCardSubtitleSummary`**，优先展示 **「 for 」之后**的补充信息（与标题上「 for 」前短语对齐），否则尝试去掉与 `cardTitle` 相同前缀，全重复则**不展示**第二行。  
- UI：`numberOfLines` 放宽、`ellipsizeMode="tail"`，由平台处理省略。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`vouchap-app/src/shared-logic/tax-filing-attachment-display-name.ts`**（`stripBoilerplatePrefixes`、`taxFilingAttachmentCardSubtitleSummary` 导出）；**`vouchap-app/src/mobile-ui/app/chat-to-log.tsx`** 附件预览卡用统一 `attachmentCardTitle` / `attachmentCardSubtitle`。  
- **验证**：tax filing 聊天中带 *… report for GAO…* 的摘要：标题应接近 *Diagnostic imaging report*，副标题以 *GAO,…* 起头且无整句重复；极长仍可能 tail 省略但不再人为 slice。  
- **限制**：无 *for* 且标题与 summary 结构不一致时，仍可能显示完整 summary；`ellipsizeMode` 在部分平台仍可能非严格词边界。

**关联**  
- `src/shared-logic/tax-filing-attachment-display-name.ts`、`src/mobile-ui/app/chat-to-log.tsx`

---

### 2026-04-08（报税识别提示词：summary 产出规则）

**User（提示词/原意）**  
- 应从模型侧优化提示词，让返回内容按合适规则生成（而非仅靠前端修修补补）。

**Assistant（实现前说明，若有）**  
- 在 **`tax-filing-recognition-prompt.ts`** 的 `BASE_SYSTEM_PROMPT` 增加独立 **# Summary field** 段：英文 only、禁止 *This document is…* 类套话、主体优先句式、一至两句、非税类附件同样规则；同步更新 JSON schema 示例里的 `summary` 说明。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新 **`vouchap-app/src/shared-logic/tax-filing-recognition-prompt.ts`**。  
- **验证**：新跑 `runTaxFilingRecognition` / 上传附件识别后，`summary` 应以表单/报告类型直起句，少见与列表标题整段重复；已有历史行不受迁移影响。

**关联**  
- `src/shared-logic/tax-filing-recognition-prompt.ts`

---

### 2026-04-08（aim.link 旧栈架构梳理 + v2 新仓库初始化）

**User（提示词/原意）**  
- workspace 中 `aim.link` 约 23 个子项目，需从代码梳理原软件整体功能架构，以便在架构上精简剔除；新栈：后端与数据库 Supabase，Web 部署 Cloudflare，App 为 Expo 原生 React；全新 git 项目 `aim.link(v2)`，不改动现有 5 个 workspace 项目；Supabase 上已建新项目 aim.link。

**Assistant（实现前说明，若有）**  
- 浏览 `/Users/macbook/aim.link` 顶层目录与关键 `package.xml`/`pom.yml`，归纳：中台微服务 + 多只读 SaaS 业务服务 + 三套前端（PC、独立登录站、Expo）+ CRM（Blade）+ 脚本与 Maven 依赖仓；不在旧仓库内改代码。  
- 在 `/Users/macbook/aim.link-v2`（目录名避免括号）执行 `git init` 与最小 README + `.gitignore` 的首 commit，与现有 Vouchap 等仓库隔离。

**Assistant（实现后说明 / 本轮结论）**  
- 交付：对用户的中文答复中含**旧栈功能架构图式说明**与 **v2 目标部署对照**；新建 **`/Users/macbook/aim.link-v2`**（`main` 分支，首提交仅为脚手架）。  
- **验证**：`cd /Users/macbook/aim.link-v2 && git log -1 --oneline`；未触碰 `aim.link`、`aim-link-website` 等现有仓库工作区。  
- **残留**：v2 尚未添加 `app/`、`web/`、`supabase/migrations`；需在 Supabase Dashboard 绑定本地 CLI 与远程后再补。

**关联**  
- 旧代码库：`/Users/macbook/aim.link`；新仓库：`/Users/macbook/aim.link-v2`

---

### 2026-04-09（receipt item 拆分税改为异步，不阻塞识别与落库）

**User（提示词/原意）**  
- `vouchap` 项目近期增加的 item 拆分税影响了 item 本身识别和落库，要求核查优化；拆分税必须采用异步方式，不能影响既有 receipts/items 的识别记录过程。

**Assistant（实现前说明，若有）**  
- 排查 `vouchap-app/src/shared-logic/database.ts`、`receipt-processor.ts`、`receipt-item-tax.ts` 后确认：`saveReceipt` / `updateReceipt` 中同步 `await applyReceiptItemTaxesAndReconcile(...)` 会把税拆分链路耦合进主事务流程。  
- 计划将税拆分改为“主数据提交后后台异步执行（microtask）+ 全量异常兜底”，确保 receipts 与 items 识别/保存路径不被拆分税阻断。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 `vouchap-app/src/shared-logic/database.ts` 新增 `runReceiptItemTaxAsync(...)`：使用 `queueMicrotask`（降级 `setTimeout(0)`）异步触发 `applyReceiptItemTaxesAndReconcile` 与 `scheduleReceiptTaxRecalcIfNeeded`，并在内部捕获异常，仅记录 warning。  
- `saveReceipt` 与 `updateReceipt` 已改为调用该异步入口，不再同步等待税拆分计算。  
- 结果：receipt 主记录与 receipt_items 的识别/落库流程与拆分税解耦；即使拆分税失败也不会反向影响主流程。

**关联**  
- `vouchap-app/src/shared-logic/database.ts`

---

### 2026-04-09（移动端上传误报 failed + 单行小票 item 兜底）

**User（提示词/原意）**  
- 移动端上传图片会提示 failed，但列表里又有识别结果；且同一小票反复识别不出唯一一行 item。

**Assistant（实现前说明，若有）**  
- 排查 `receipts.tsx` 上传链路后，发现上传后立即刷新列表的 `loadReceipts` 若瞬时查询失败会弹 `Failed to load expenses`，容易被误解为上传失败。  
- 排查 `receipt-helpers.ts` 后，发现 `convertGeminiResultToReceipt` 对空/弱结构 items 容错不足，可能出现“识别结果存在但落库无 item”。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`：为 `loadReceipts` 增加 `silentError` 参数；在上传后两次自动刷新（创建占位记录后、后台识别完成后）使用静默模式，避免误报 toast 干扰用户。  
- `vouchap-app/src/shared-logic/receipt-helpers.ts`：新增 `fallbackExpenseItemPrice`；当模型未返回 items 或为空时自动注入一条 `Receipt total (merged)`；同时对 `categoryName` 增加兜底来源（`categoryName -> name -> description -> Other`），并在映射后仍为空时再补一条默认 item。  
- 结果：上传后“失败提示但实际已入库”的误导显著降低；单行小票在模型漏提 item 时仍可稳定落一条 item。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`  
- `vouchap-app/src/shared-logic/receipt-helpers.ts`

---

### 2026-04-09（手动新增 item 保存失败：疑似 Supabase 迁移未完整应用）

**User（提示词/原意）**  
- 手动在小票里自行添加 item 也保存失败，怀疑是 Supabase 迁移问题。

**Assistant（实现前说明，若有）**  
- 重点排查 `receipt_items` 相关迁移、触发器函数与前端保存路径，确认是否存在“列已改名但触发器仍引用旧列”的线上漂移。

**Assistant（实现后说明 / 本轮结论）**  
- 高概率根因定位为：`receipt_items` 从 `purpose_id` 改到 `attribution_id` 后，若线上未应用 `20260405120000_receipt_items_usage_trigger_use_attribution_id.sql`，触发器函数 `update_usage_counts_on_item_change` 仍引用旧列，会导致 item 保存时报错。  
- 已给出建议：在 Supabase 先执行函数定义核查，再执行该迁移（或直接执行函数替换 SQL）恢复。

**关联**  
- `vouchap-app/supabase/migrations/20260403180000_rename_line_item_purpose_id_to_attribution_id.sql`  
- `vouchap-app/supabase/migrations/20260405120000_receipt_items_usage_trigger_use_attribution_id.sql`

---

### 2026-04-09（跟进诊断结果：usage trigger 已正确，继续排查其余 DB 依赖）

**User（提示词/原意）**  
- 返回了 SQL 诊断结果：`update_usage_counts_on_item_change` 函数体已使用 `attribution_id`，无旧 `purpose_id` 引用。

**Assistant（实现后说明 / 本轮结论）**  
- 已排除该函数为根因；下一步聚焦：  
  1) 其它触发器/函数是否仍引用 `purpose_id`；  
  2) `receipt_items` 是否有额外约束（如名称非空白 check）与前端新增空名称 item 冲突；  
  3) RLS / FK 在 `UPDATE receipts` -> 重建 `receipt_items` 这一路径上的实际报错点。  
- 已建议用户执行一键巡检 SQL 获取精确失败点，再给出定向修复。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`  
- `vouchap-app/src/shared-logic/database.ts`

---

### 2026-04-09（用户要求 SQL 落文件，便于执行与倒查）

**User（提示词/原意）**  
- 不要在对话里散贴 SQL，要求把要执行的 SQL 落到文件，后续便于复用和回溯。

**Assistant（实现后说明 / 本轮结论）**  
- 已新增 SQL 脚本文件：`vouchap-app/supabase/receipt-items-save-failure-diagnose-and-fix.sql`。  
- 内容包含三部分：  
  1) `receipt_items`/触发器/约束/函数残留 `purpose_id` 诊断；  
  2) 缺失 `categories.usage_count`、`attributions.usage_count` 的修复；  
  3) `usage_count` 回填（可选）。

**关联**  
- `vouchap-app/supabase/receipt-items-save-failure-diagnose-and-fix.sql`

---

### 2026-04-09（修复 SQL 脚本 42809：array_agg aggregate 报错）

**User（提示词/原意）**  
- 执行 SQL 脚本仍报：`ERROR: 42809: "array_agg" is an aggregate function`。

**Assistant（实现后说明 / 本轮结论）**  
- 已修复 `vouchap-app/supabase/receipt-items-save-failure-diagnose-and-fix.sql` 中函数扫描段：  
  - 对 `pg_proc` 增加 `p.prokind in ('f','p')` 过滤，仅扫描普通函数/过程；  
  - 避免对 aggregate/window 对象调用 `pg_get_functiondef` 引发 42809。  
- 现在可重新执行脚本，不应再在该位置触发 `array_agg` 报错。

**关联**  
- `vouchap-app/supabase/receipt-items-save-failure-diagnose-and-fix.sql`

---

### 2026-04-09（发现残留函数 update_all_purpose_usage_counts，补兼容修复）

**User（提示词/原意）**  
- 诊断结果返回残留函数：`public.update_all_purpose_usage_counts`。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 `vouchap-app/supabase/receipt-items-save-failure-diagnose-and-fix.sql` 增加兼容修复段：  
  - `CREATE OR REPLACE FUNCTION public.update_all_purpose_usage_counts()`；  
  - 逻辑改为基于 `receipt_items.attribution_id` 回填 `attributions.usage_count`，避免旧语义函数残留影响。  
- 这样即便线上仍有旧函数名调用，也不会再依赖 legacy `purposes/purpose_id`。

**关联**  
- `vouchap-app/supabase/receipt-items-save-failure-diagnose-and-fix.sql`

---

### 2026-04-09（usage_count 已存在后的兜底修复：新增 item 名称非空）

**User（提示词/原意）**  
- 诊断结果显示 `attributions.usage_count` 与 `categories.usage_count` 均已存在，继续定位新增 item 保存失败。

**Assistant（实现后说明 / 本轮结论）**  
- 结合前端与落库逻辑，补充“名称非空”防御，规避环境中可能存在的空白名称约束导致保存失败：  
  - `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`：新增 item 默认名由空字符串改为 `Receipt item`。  
  - `vouchap-app/src/shared-logic/database.ts`：新增 `normalizeReceiptItemNameForSave`，在 `saveReceipt` / `updateReceipt` 写入 `receipt_items` 时统一将空白名称兜底为 `Receipt item`。  
- 已通过相关文件 lint 检查。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`  
- `vouchap-app/src/shared-logic/database.ts`

---

### 2026-04-09（老 app 拍照/文档识别无法落库 items：图片路径缺 items 兜底）

**User（提示词/原意）**  
- 老的 app 不能识别、不能落库 items；要求检查并修复。

**Assistant（实现前说明，若有）**  
- 对照 `recognizeReceipt`（图片）与 `recognizeReceiptFromText`：`JSON.parse` 后直接对 `parsedResult.items` 做 `reduce`/`map`，若模型省略 `items` 或非数组/空数组会抛错，整轮识别失败则无法进入 `convertGeminiResultToReceipt` 与 `saveReceipt`。文字路径已有兜底，图片/文档路径缺失，表现为「老流程（拍照为主）」更易失败。  
- `saveReceipt` 在缺 `categoryId` 时用 `item.name` 去 `findCategoryByName`，易把商品名当成分类名，与分类解析不一致；改为优先 `item.category?.name` / `categoryName`。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/shared-logic/gemini.ts`：新增 `ensureGeminiParsedReceiptItems`，在 `recognizeReceipt` 与 `recognizeReceiptFromDocument` 中于 `reduce`/`map` 之前调用，与文字路径一致至少合成一行（`General Purchase` + 默认分类/用途 + `max(0, totalAmount - tax)`）。  
- `vouchap-app/src/shared-logic/database.ts`：`saveReceipt` 分类兜底查找改为 `categoryNameHint`（category 名 / categoryName），不再误用商品名。  
- 验证建议：用拍照上传一张小票，或构造模型返回无 `items` 的 JSON（若可），应不再整单报错；保存后 `receipt_items` 至少一行。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`  
- `vouchap-app/src/shared-logic/database.ts`

---

### 2026-04-09（撤回 purpose_id 兼容迁移；问题域更正为行税拆分后）

**User（提示词/原意）**  
- 撤回上一步；现在不是 attribution 兼容问题，app 是改为 attribution 之后构建的；问题是在开发拆分 items 税额之后出现的。

**Assistant（实现后说明 / 本轮结论）**  
- 已删除迁移 `20260413120000_receipt_items_legacy_purpose_id_compat.sql`；已从 `receipt-items-save-failure-diagnose-and-fix.sql` 移除 Part D（purpose_id/attribution 兼容说明）。  
- 与用户结论对齐：后续应聚焦「拆分 items 税额」相关（应用侧如 `receipt-item-tax` / `applyReceiptItemTaxesAndReconcile`、库侧如 `receipt_item_taxes` 与相关迁移/RLS/触发器），而非 purpose_id 列兼容。

**关联**  
- （撤回）`20260413120000_receipt_items_legacy_purpose_id_compat.sql`、诊断脚本 Part D

---

### 2026-04-10（logo2 商店图标 / logo3 应用内与网站）

**User（提示词/原意）**  
- `assets` 下增加 `logo2`、`logo3` 两个 PNG：`logo2` 用于构建 app 的市场图标；`logo3` 用于应用内和网站各处展示图标。

**Assistant（实现后说明 / 本轮结论）**  
- 将 `Vouchap/assets/logo2.png`、`logo3.png` 复制入 `vouchap-app/src/mobile-ui/assets/`（经 `assets` 符号链接供 Metro 打包）。  
- `vouchap-app/app.config.js`：`expo.icon`、`android.adaptiveIcon.foregroundImage` → `logo2.png`；`expo.web.favicon` → `logo3.png`。  
- 应用内原 `icon.png` 引用改为 `logo3.png`（`WebSidebar`、`login`、`register`、`reset-password`、`set-password`、`setup-space`）。  
- `vouchap-website`：`public/logo3.png`，`layout.tsx` / `Navbar` / `client-join` / `auth/confirm` 中 `/logo.png` 改为 `/logo3.png`。  
- 更新 `vouchap-app/src/mobile-ui/assets/README.md` 与 `Vouchap/assets/README.md` 说明同步方式。  
- 验证：改图标后执行 `npx expo prebuild` 或完整原生构建以刷新商店图标；网站与 Web favicon 以 `public/logo3.png` 为准。

**关联**  
- `vouchap-app/app.config.js`、`vouchap-app/src/mobile-ui/assets/logo2.png`、`logo3.png`  
- `vouchap-website/public/logo3.png`

---

### 2026-04-10（logo3 文件更新后同步到 app / 网站）

**User（提示词/原意）**  
- logo3 文件更新了一下，各处更新。

**Assistant（实现后说明 / 本轮结论）**  
- 无代码变更；自 `Vouchap/assets/logo3.png` 覆盖复制至 `vouchap-app/src/mobile-ui/assets/logo3.png` 与 `vouchap-website/public/logo3.png`。  
- 验证：Expo 可 `-c` 清缓存重载；Next 站若 CDN 缓存 favicon 需硬刷新或等失效。

---

### 2026-04-10（仅 Web 左侧栏用 logo3，其余用 logo.png）

**User（提示词/原意）**  
- 应用内和网站内，除了 web 端左侧栏用 logo3，其余各处仍用 logo.png 比较合适。

**Assistant（实现后说明 / 本轮结论）**  
- `WebSidebar.tsx` 保留 `logo3.png`；登录/注册/重置密码、setup-space、Expo `web.favicon` 改回 `logo.png`；营销站 `layout` / `Navbar` / `client-join` / `auth/confirm` 改回 `/logo.png`。  
- 自 `vouchap-website/public/logo.png` 复制入 `vouchap-app/src/mobile-ui/assets/logo.png` 与 `Vouchap/assets/logo.png` 以便打包。  
- 已更新 `vouchap-app/src/mobile-ui/assets/README.md` 与 `Vouchap/assets/README.md` 说明分工。

**关联**  
- `vouchap-app/app.config.js`、`vouchap-app/src/mobile-ui/components/WebSidebar.tsx`  
- `vouchap-website/app/layout.tsx`、`components/Navbar.tsx` 等

---

### 2026-04-10（Web 左侧栏字标上移 + 黑金色）

**User（提示词/原意）**  
- web 端左侧栏 logo 下方的 Vouchap，位置上移与 logo 靠近，更换成跟 logo 一样风格的黑金色。

**Assistant（实现后说明 / 本轮结论）**  
- `WebSidebar.tsx`：缩小品牌区与字标间距（`marginTop: -8`、`logoImage` 轻微负下边距、略收 `mainNavSection` 上边距）；字标拆为「Vouch」`#0D0D0D` +「ap」金属金 `#C9A24D`，Poppins 字重 700，金色段加轻 `textShadow` 贴近黑金质感。

**关联**  
- `vouchap-app/src/mobile-ui/components/WebSidebar.tsx`

---

### 2026-04-10（侧栏字标 Poppins 加粗至 900）

**User（提示词/原意）**  
- 字体需进一步加粗。

**Assistant（实现后说明 / 本轮结论）**  
- `WebSidebar` 品牌字 `fontWeight` 由 `700` 改为 `900`；`_layout.tsx` 中 Google Fonts 由仅 `wght@700` 改为 `700;900`，并 `document.fonts.load('900 25px Poppins')` 与字标字号一致。

**关联**  
- `vouchap-app/src/mobile-ui/components/WebSidebar.tsx`、`vouchap-app/src/mobile-ui/app/_layout.tsx`

---

### 2026-04-10（字标改为黑色金边，非分段配色）

**User（提示词/原意）**  
- 黑色金边，而不是部分黑色部分金色。

**Assistant（实现后说明 / 本轮结论）**  
- `WebSidebar.tsx`：整词「Vouchap」统一为填充 `#0D0D0D`，Web 端使用 `WebkitTextStroke: 1.25px #C9A24D` + `WebkitTextFillColor: #0D0D0D` 实现金边黑字；去掉 Vouch/ap 分段。

**关联**  
- `vouchap-app/src/mobile-ui/components/WebSidebar.tsx`

---

### 2026-04-09（ExpoDocumentPicker 原生模块未找到：懒加载 + app.config 插件）

**User（提示词/原意）**  
- 终端报错：`Cannot find native module 'ExpoDocumentPicker'`，栈指向 `TaxFilingTodosView.tsx` 对 `expo-document-picker` 的 import。

**Assistant（实现前说明，若有）**  
- 依赖已在 package.json 时，顶层 import 会在模块加载时绑定原生桥；当前运行的 Android 二进制（Expo Go 与 SDK 不匹配或 dev client 未包含该模块）会整屏崩溃。  
- 改为按需 `import('expo-document-picker')` 通过封装 `pickTaxFilingDocument`，避免进入含 TaxFilingTodosView 的路由即崩；并在 `app.config.js` 增加 `expo-document-picker` 插件，便于 `prebuild`/`run:android` 正确链接。彻底修复需本地重建原生：`npx expo run:android`（或 iOS）。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `pickTaxFilingDocument` 封装；`TaxFilingTodosView.tsx` 与 `tax-filing/order/[orderId]/index.tsx` 改为调用之。  
- `app.config.js` 的 `plugins` 增加 `"expo-document-picker"`。  
- **更正路径**：`@/lib/*` 在 tsconfig 中映射到 `src/shared-logic/*`，实现文件须在 `src/shared-logic/tax-filing-document-picker.ts`（非 `mobile-ui/lib`），否则 Metro 报 SHA-1 / 找不到文件。

**关联**  
- `vouchap-app/src/shared-logic/tax-filing-document-picker.ts`  
- `vouchap-app/app.config.js`  
- `vouchap-app/src/mobile-ui/components/TaxFilingTodosView.tsx`  
- `vouchap-app/src/mobile-ui/app/tax-filing/order/[orderId]/index.tsx`

---

### 2026-04-11（发布应用版本 2.5.7 Build 45）

**User（提示词/原意）**  
- app 版本号更新为 2.5.7。

**Assistant（实现后说明 / 本轮结论）**  
- 按仓库版本同步准则：`package.json` / `package-lock.json` 版本 2.5.7；`app.config.js` 与 Android `versionCode`、iOS `CFBundleVersion` / `CURRENT_PROJECT_VERSION` 统一为 Build **45**；`versionName` / `CFBundleShortVersionString` / `MARKETING_VERSION` 为 **2.5.7**；已更新 `ios/Vouchap.xcodeproj/project.pbxproj`。  
- 提交信息：`发布版本号 2.5.7 (Build 45)`。

**关联**  
- `vouchap-app/package.json`、`app.config.js`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`、`ios/Vouchap.xcodeproj/project.pbxproj`

---

### 2026-04-10（全平台 production 构建：Web 导出 + EAS iOS/Android）

**User（提示词/原意）**  
- 全平台构建 production。

**Assistant（实现前说明，若有）**  
- 无代码变更。在 `vouchap-app` 执行：`NODE_ENV=production npx expo export -p web`；`npx eas build -p all --profile production --non-interactive --no-wait`（提交云端队列，不阻塞等待完成）。

**Assistant（实现后说明 / 本轮结论）**  
- **Web**：`expo export -p web` 成功，产物目录 `vouchap-app/dist/`。  
- **EAS（production）**：Android、iOS 均已上传并排队构建；CLI 显示远程 **autoIncrement**：Android `versionCode` 46→**47**，iOS `buildNumber` 28→**29**（与本地曾提交的 2.5.7 / Build 45 可能不一致，以 EAS/商店侧为准）。  
- **构建日志**：Android https://expo.dev/accounts/aimlink/projects/vouchap/builds/f239a8f6-6bab-4f0f-a3f0-fc4e97dd5d84 ；iOS https://expo.dev/accounts/aimlink/projects/vouchap/builds/ebba0ae5-49e4-44aa-a30f-0d6e523015b9 。  
- **验证**：Web 检查 `dist/`；移动端在 Expo 控制台等待绿勾后下载 artifact。归档体积约 334 MB，后续可考虑 `.easignore` 减小上传。

**关联**  
- `vouchap-app/dist/`、EAS profile `production`

---

### 2026-04-11（Web Expenses：Eric 气泡位置与 Line items 双气泡）

**User（提示词/原意）**  
- Web 端 expenses：关闭聊天右栏后 Eric 头像气泡偏下，触摸出现输入区时头像跳动；进入 line items 列表后两个头像气泡重叠。

**Assistant（实现前说明，若有）**  
- 根因 1：`receipt-items` 页内嵌 `WebChatFab embedded`，但 `_layout` 仅排除 `/receipts`，未排除 `/receipt-items`，全局绝对定位 FAB 仍渲染 → 双气泡。  
- 根因 2：嵌入式 `fabContainerWeb` 为 80×80、bottom/right 40，而 `WebChatFab` 实际为 100×100 且展开态头像锚点为 bottom 52 → 折叠态视觉更靠下，悬停展开时头像上移跳动。  
- 计划：`_layout` 增加 `receipt-items` 排除；导出 `WEB_CHAT_FAB_*` 常量，`receipts` / `receipt-items` / `invoices` 的 `fabContainerWeb` 与组件内边距一致。

**Assistant（实现后说明 / 本轮结论）**  
- 已改：`_layout.tsx` 条件增加 `!pathname?.startsWith('/receipt-items')`；`WebChatFab.tsx` 导出 `WEB_CHAT_FAB_SIZE` / `WEB_CHAT_FAB_BOTTOM` / `WEB_CHAT_FAB_RIGHT`；三处列表页 `fabContainerWeb` 使用该常量。  
- **验证**：Web 在 `/receipts` 关右栏 → 悬停 FAB，头像与展开态对齐无跳变；进入 `/receipt-items` 仅单气泡。

**关联**  
- `vouchap-app/src/mobile-ui/app/_layout.tsx`、`WebChatFab.tsx`、`receipts.tsx`、`receipt-items.tsx`、`invoices.tsx`

---

### 2026-04-11（核实 App Store 图标：app.config 的 logo2 vs 裸工程原生资源）

**User（提示词/原意）**  
- 新 production 构建在 App Store 发布仍显示旧 logo；核实是否已正确替换为 logo2 用于 build。

**Assistant（实现前说明，若有）**  
- `app.config.js` 的 `icon` / `android.adaptiveIcon.foregroundImage` 已指向 `./assets/logo2.png`，但存在裸 `ios/`、`android/` 时 EAS/Xcode 实际打包 **Images.xcassets AppIcon** 与 **mipmap**，与 `expo.icon` 可脱节。  
- 核对：`App-Icon-1024x1024@1x.png` 与 `assets/icon.png` 哈希一致，均**非** logo2（旧图）。

**Assistant（实现后说明 / 本轮结论）**  
- 已从 `assets/logo2.png` 用 ImageMagick 生成 1024×1024 RGB PNG，覆盖 `ios/…/AppIcon.appiconset/App-Icon-1024x1024@1x.png`，并同步 `assets/icon.png`、`src/mobile-ui/assets/icon.png`。  
- 已按各 density 从 logo2 重生成 Android `ic_launcher_foreground.webp`、`ic_launcher.webp`、`ic_launcher_round.webp`（mipmap-mdpi 至 xxxhdpi）。  
- `app.config.js` 增加简短注释说明裸工程以原生资源为准。  
- **验证**：重新 EAS `production` iOS 构建并提审；App Store Connect 图标更新可能有缓存延迟。若 logo2 需透明底而非白底，需改 magick 参数后重做 iOS 1024。

**关联**  
- `vouchap-app/app.config.js`、`assets/logo2.png`、`assets/icon.png`、`ios/Vouchap/Images.xcassets/AppIcon.appiconset/`、`android/app/src/main/res/mipmap-*`

---

### 2026-04-13（Firm/Client 订阅与识别配额：实现方案分析，待确认后开发）

**User（提示词/原意）**  
- 开发版本控制与订阅定价：Firm $99/年含 50 engagements，分档增购单价；Client 月 10 次识别，超出 $0.1/credit；与 firm 有关联 engagement 且 processing 的 client 月上限 100 次；控制需在 CRM 可通过订单配置。要求先分析实现方案，讨论确定再动手。

**Assistant（实现前说明，若有）**  
- 无代码变更；对照 `vouchap-crm/sql/crm-schema.sql`（`sku_edition`、`sku_addon`、`space_orders`）、`crm-sku-seed.sql`、`SpaceOrders.tsx` 评估与目标定价的缺口。

**Assistant（实现后说明 / 本轮结论）**  
- 交付：中文方案分析（数据模型、CRM 配置方式、运行时 enforcement、与 Stripe 分期、待澄清业务规则）。待用户确认歧义后再实现。

**关联**  
- `vouchap-crm/sql/crm-schema.sql`、`crm-sku-seed.sql`、`src/pages/SpaceOrders.tsx`

---

### 2026-04-13（Firm/Client 订阅与识别配额：歧义确认后落地实现）

**User（提示词/原意）**  
- 整包定价；processing 关联时每月 100 次封顶（含 included与 credit）；失败不计入、重试成功计入；processing 按现有系统逻辑；space 单角色。按先前5 步计划直接改代码。

**Assistant（实现前说明，若有）**  
- DB：`crm` 扩展 `sku_edition.price_yearly`、`space_orders.metadata`；新表 `client_recognition_monthly_usage`、`space_billing_state`；RPC `get_client_recognition_quota`、`record_client_recognition_success`、`assert_firm_can_create_engagement`、`user_may_act_for_client_space`；触发器按 `metadata.recognition_credits_added` 加 credit；`firm.client_create_onboarding_order_from_published_sku` 内调用 firm 容量断言。种子 `FIRM_ANNUAL`/`CLIENT_SUB` 与整包 addon。  
- CRM：`SpaceOrders` 新建订单可选 metadata 字段；`Skus` 展示年价；`crm-schema`/`crm-sku-seed` 同步。  
- App：`client-recognition-quota.ts`；`createFirmOrder` 前 assert；报税附件/聊天/语音/收据与入出库处理链路在成功识别后 `record`，关键路径预检 `assert`；`getProjectTodoAttachmentWithContext` 增加 `clientSpaceId`。

**Assistant（实现后说明 / 本轮结论）**  
- 已提交上述迁移（`vouchap-app/supabase/migrations/20260413140000_*`、`20260413141000_*`）、CRM 与 `vouchap-app` 联动改动。Client 侧仅当存在有效 `CLIENT_SUB` 的 `space_orders` 时 enforcement；否则与旧空间行为一致。Firm 侧仅当存在 `FIRM_ANNUAL` 时限制新建 `firm.orders`（非 cancelled、非 completed 计数 + metadata 增购槽位）。  
- **验证**：Supabase 执行迁移与种子；CRM 为客户空间建 `CLIENT_SUB`、为 firm 空间建 `FIRM_ANNUAL` 并设 metadata；客户端走 chat-to-log / 报税附件识别，观察 `client_recognition_monthly_usage` 与 `space_billing_state`；超额与无 credit 应返回英文提示（部分 UI 为 `Limit: …`）。新建 engagement 超限时 `createFirmOrder` / client catalog RPC 应失败。  
- **残留**：Stripe 自助下单未接；`record` 与 AI 成功之间极端竞态下偶发「已识别成功但 record 失败」未做回滚；CRM 订单列表未展示 metadata 列。

**关联**  
- `vouchap-app/supabase/migrations/20260413140000_crm_subscription_quotas_client_firm.sql`、`20260413141000_crm_seed_firm_client_subscription_skus.sql`  
- `vouchap-app/src/shared-logic/client-recognition-quota.ts`、`firm.ts`、`tax-filing-attachment-followup.ts`、`receipt-processor.ts`、`inbound-processor.ts`、`outbound-processor.ts`、`chat-to-log.tsx`、`TaxFilingTodosView.tsx`  
- `vouchap-crm/sql/crm-schema.sql`、`crm-sku-seed.sql`、`src/pages/SpaceOrders.tsx`、`Skus.tsx`

---

### 2026-04-13（Space information：订单管理入口与页面）

**User（提示词/原意）**  
- space information 中需要增加订单管理的入口和页面。

**Assistant（实现前说明，若有）**  
- `crm.space_orders` 对 App 用户无 SELECT（RLS 仅 ops），需新增 `SECURITY DEFINER` RPC：校验 `public.user_spaces` 成员后返回该 space 的订单列表（含 SKU code/name、状态、起止与创建时间、source、metadata）。  
- App：`@/lib/space-orders.ts` 调用 RPC；新路由 `space-orders`；在 `management`的 Space Information 区块下增加与菜单一致的入口行；`space-manage` 增加跳转卡片；`_layout` 注册屏幕并将 `space-orders` 纳入 Web 侧「设置页」chat 气泡隐藏列表。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移：`vouchap-app/supabase/migrations/20260413142000_crm_list_space_orders_for_member.sql`（`crm.list_space_orders_for_space_member`、`GRANT EXECUTE` 给 `authenticated`）。  
- 页面：`src/mobile-ui/app/space-orders.tsx`（英文文案，列表展示订单与 metadata 摘要，支持下拉刷新）。  
- 入口：`management.tsx`、`space-manage.tsx`；`_layout.tsx` 标题「Order management」。  
- **验证**：部署迁移后，以空间成员账号打开 Management → Order management，应能看到该 space 的 `crm.space_orders` 列表；非成员或非当前 space 的 id 调用 RPC 应返回空集。  
- **残留**：仅列表只读；支付/续费仍走 CRM 或后续自助流程。

**关联**  
- `vouchap-app/supabase/migrations/20260413142000_crm_list_space_orders_for_member.sql`  
- `vouchap-app/src/shared-logic/space-orders.ts`、`src/mobile-ui/app/space-orders.tsx`、`management.tsx`、`space-manage.tsx`、`src/mobile-ui/app/_layout.tsx`

---

### 2026-04-13（CRM 既有 SKU 查询与计费模式整合说明）

**User（提示词/原意）**  
- 查询 CRM 中此前设计的 SKU，整合计费模式。

**Assistant（实现前说明，若有）**  
- 无代码变更；阅读 `vouchap-crm/sql/crm-schema.sql`、`crm-order-design.md`、`crm-sku-seed.sql` 及 `vouchap-app/supabase/migrations/20260413141000_crm_seed_firm_client_subscription_skus.sql`，归纳订单生效规则、通用 VCH 档位、增购包与 Firm/Client 订阅层。

**Assistant（实现后说明 / 本轮结论）**  
- 见对用户回复正文：**统一计费骨架**（`space_orders` → `sku_edition` + 可选 `metadata` / `sku_addon`）+ **两套并行产品线**（①通用客户档位 VCH_* 以凭证/月与模块为主；② Firm/Client 以年费 engagement与 AI 识别配额/credit 为主）。并注明 `CLIENT_SUB` 标价在种子中为 NULL、由 CRM/运营配置；Firm 增购槽位与 Client credit 依赖 `space_orders.metadata`。

**关联**  
- `vouchap-crm/sql/crm-order-design.md`、`crm-sku-seed.sql`、`crm-schema.sql`

---

### 2026-04-13（计费收敛：仅 Firm 年费+engagement credit / Client 免费+credit 增购 / 签约赠送 credit）

**User（提示词/原意）**  
- 去掉之前的计价，只保留：1）firm 年费 + engagement credit；2）client 基础 credit（免费）+ 增购 credit；3）firm 签约 client 的增量 credit。

**Assistant（实现前说明，若有）**  
- 移除 VCH 档位与旧 addon 目录依赖；`CLIENT_SUB` 不再作为识别 enforcement 开关。  
- DB：迁移重写 `assert_firm_can_create_engagement`（`engagement_credits_included` + `metadata.engagement_credits_added`，兼容旧 `engagements_included` / `engagement_addon_slots`）、`get_client_recognition_quota` / `record_client_recognition_success`（client 一律 enforcement，included 来自 `CLIENT_RECOGNITION_BASE`）；新增 `firm.orders` 触发器按 `FIRM_CLIENT_SIGNING_BONUS` 在首单时给 client 加 recognition credits；`on_space_created` 去掉 VCH_TRIAL 订单。  
- 种子：`crm-sku-seed.sql`、`crm-schema.sql` 区块 8、`crm-app-integration.sql`；CRM `SpaceOrders` 写 `engagement_credits_added` 并隐藏目录-only SKU；文档 `crm-order-design.md`、`crm-space-orders-trial-bulk.sql` 标注废弃。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移：`vouchap-app/supabase/migrations/20260413143000_crm_billing_model_firm_client_credits.sql`（含 catalog 清理/重建，删除未引用的 VCH/CLIENT_SUB 等 edition 行；addon 改为 ENGAGEMENT_CREDITS_REF / CLIENT_RECOGNITION_CREDITS_REF参考包，标价 0）。  
- **行为变化**：所有 client 空间均走识别配额；新注册空间不再自动插入试用 `space_orders`。  
- **验证**：应用迁移后检查 `sku_edition` 仅含新模型相关 code；建 `FIRM_ANNUAL` 订单后 engagement 上限；client 识别超 included 需 credit；首条 `firm.orders`（某 firm+client）应增加 `space_billing_state`。  
- **残留**：主应用若仍有基于 VCH 的凭证/月模块 gating，需另行下线或改读新目录（本任务未全库搜索）。

**关联**  
- `vouchap-app/supabase/migrations/20260413143000_crm_billing_model_firm_client_credits.sql`  
- `vouchap-crm/sql/crm-sku-seed.sql`、`crm-schema.sql`、`crm-app-integration.sql`、`crm-order-design.md`、`src/pages/SpaceOrders.tsx`  
- `vouchap-app/src/shared-logic/client-recognition-quota.ts`

---

### 2026-04-13（VCH_TRIAL 仍存原因说明 + 清理迁移与 CRM 标价展示）

**User（提示词/原意）**  
- VCH_TRIAL 还在，是什么逻辑；其他 SKU 定价都显示免费是否有问题。

**Assistant（实现前说明，若有）**  
- 143000 删除 VCH_* 的条件是 **无 space_orders 引用**；历史注册试用订单仍指向 VCH_TRIAL 时会阻止删除。CRM「月价」列对 `NULL` 显示「免费」会把 **仅年付**（FIRM_ANNUAL）与 **目录策略行**（无标价）误导成免费。

**Assistant（实现后说明 / 本轮结论）**  
- 新增迁移 `20260413144000_crm_drop_legacy_vch_orders_then_skus.sql`：先删指向 VCH_* / CLIENT_SUB 的 `space_orders`，再删对应 `sku_edition`（会丢掉旧订单历史行，计费已不再依赖）。  
- `Skus.tsx`：月价无值改显示「—」；年价列统一「—」；addon 价0 显示为 reference/quote。  
- **验证**：跑迁移后 `sku_edition` 无 VCH_TRIAL；FIRM_ANNUAL 年价列仍为 USD 99。

**关联**  
- `vouchap-app/supabase/migrations/20260413144000_crm_drop_legacy_vch_orders_then_skus.sql`、`vouchap-crm/src/pages/Skus.tsx`

---

### 2026-04-14（Todo 筛选：锚定图标展开，点击空白关闭）

**User（提示词/原意）**  
- 筛选浮窗不要居中 alert；在 icon 位置直接展开；不要 Done 按钮和标题；点击页面其他位置即关闭。

**Assistant（实现前说明，若有）**  
- 在 `ProjectDetailView` 用 `measureInWindow` 记录筛选按钮屏幕坐标，将菜单 `absolute` 定位在图标下方（右缘与图标对齐并做屏幕边界夹紧）；全屏半透明 `Pressable` 仅负责点击关闭。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`：移除居中卡片、标题与 Done；新增 `todoFilterPopover` 锚点布局；筛选按钮外包 `View ref + collapsable={false}` 保证测量稳定；再次点击图标可关闭。  
- 已执行 lint，无新增报错。

**关联**  
- `vouchap-app/src/mobile-ui/components/ProjectDetailView.tsx`

---

### 2026-04-17（aim.link-v2：本地启动 Web 开发/测试服务）

**User（提示词/原意）**  
- aim.link-v2 测试服务器跑起来。

**Assistant（实现前说明，若有）**  
- 无 Vouchap 代码变更。在 **`/Users/macbook/aim.link-v2`** 根目录执行 **`npm run dev`**（workspace → **`apps/web`** 的 **Vite**），后台进程便于本机浏览器访问。

**Assistant（实现后说明 / 本轮结论）**  
- 服务已就绪：**`http://localhost:5173/`**；终端可能出现 **Sass legacy-js-api** 弃用警告，不影响当前开发访问。若需局域网访问可加 **`--host`**。  
- **验证**：本机浏览器打开上述地址。

**关联**  
- `aim.link-v2/package.json`、`aim.link-v2/apps/web/package.json`

---

### 2026-04-17（aim.link-v2：/signin 密码标签与校验提示对齐、底栏 Sign up 顺序）

**User（提示词/原意）**  
- password tag 应始终跟输入框垂直对齐，即使有错误提示时。  
- 这个页面的 Sign up 要放 don’t 问句之后。

**Assistant（实现前说明，若有）**  
- 无 Vouchap 代码变更。拟在 **`aim.link-v2`**：**`login-panel.scss`** 调整 **`aimlink-login-panel-user-field`** / **`user-label`**；**`AuthLoginPanel`** 底栏结构 + **`tips-signup`** 样式，抵消 **`header-tips-resend`** 的 **`float: left`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`user-field`**：**`align-items: flex-start`**；**`user-label`**：**`padding-top`** 与输入行对齐。  
- 底栏：**`tips-signup`** + **`tips-signup-lead`**，问句在 **`Sign up`** 前且问句不为链接蓝。  
- **`docs/PRD.md`**、**`docs/PROMPTS-LOG.md`**（**aim.link-v2**）已同步。  
- **验证**：**`npm run typecheck`**（**aim.link-v2**）；浏览器 **/signin** 人工看布局与底栏顺序。

**关联**  
- `aim.link-v2/apps/web/src/styles/login-panel.scss`  
- `aim.link-v2/apps/web/src/pages/AuthLoginPanel.tsx`  
- `aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/PROMPTS-LOG.md`

---

### 2026-04-17（aim.link-v2：/signin 占位符刷新与失焦不闪动）

**User（提示词/原意）**  
- 用户名和密码输入框内的预填文字，在刷新页面和点击页面空白时，会变化大小和闪动。

**Assistant（实现前说明，若有）**  
- 无 Vouchap 代码变更。拟在 **`aim.link-v2`** 的 **`login-form-native.scss`** 覆盖 Ant Design 默认 **`transition: all`**，统一 **`.ant-input-affix-wrapper`** 与内层字号，并处理 **autofill** 字阶。

**Assistant（实现后说明 / 本轮结论）**  
- 已收窄登录表单 **`Input` / `Input.Password`** 相关 **`transition`**，为 **affix wrapper** 设置与内层一致的 **`font-size` / `line-height`**，占位符 **`transition: none`**，**`-webkit-autofill`** 锁定字阶。  
- **`aim.link-v2`** 的 **`docs/PRD.md`**、**`docs/PROMPTS-LOG.md`** 已同步。  
- **验证**：**`npm run typecheck`**；浏览器 **/signin** 刷新与失焦目测。

**关联**  
- `aim.link-v2/apps/web/src/styles/login-form-native.scss`  
- `aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/PROMPTS-LOG.md`

---

### 2026-04-17（aim.link-v2：/signin 对齐与居中贴近原设计稿）

**User（提示词/原意）**  
- 原设计的对齐和居中方式更美观一点（附图）。

**Assistant（实现前说明，若有）**  
- 无 Vouchap 代码变更。拟在 **`aim.link-v2`**：登录行改 **栅格**（标签列 + 主输入列）、**Forgot** 与输入左对齐、**divider** 与主列同宽、**`AuthLoginPanel`** 登录态 **user** 宽度 **400px**。

**Assistant（实现后说明 / 本轮结论）**  
- **`AuthLoginPanel`**：**`user-labelCell` / `user-control` / `user-forgotRow`**；**Forgot** 去 **float**。  
- **`login-panel.scss`**：**Grid**、**CSS 变量**、**`user > divider` 100%**；**`&-user` 宽 400**。  
- **`docs/PRD.md`**、**`PROMPTS-LOG.md`** 已同步。  
- **验证**：**`npm run typecheck`**；**/signin** 目视。

**关联**  
- `aim.link-v2/apps/web/src/pages/AuthLoginPanel.tsx`  
- `aim.link-v2/apps/web/src/styles/login-panel.scss`  
- `aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/PROMPTS-LOG.md`

---

### 2026-04-17（aim.link-v2：/signin 对照说明 + 修复 Form explain 被 height:0 压没）

**User（提示词/原意）**  
- 截图给了仍不到位；问刚三个问题都改成什么了。

**Assistant（实现前说明，若有）**  
- 无 Vouchap 业务代码变更。复查 **`aim.link-v2`** **`login-panel.scss`** 中 **`.ant-form-item-explain`** 层叠。

**Assistant（实现后说明 / 本轮结论）**  
- 移除 **`height:0 !important`** 相关规则，**`.aimlink-login-panel-user .ant-form-item-explain`** 改为 **`auto`**；**`PROMPTS-LOG`** 追加用户对照说明条。  
- **验证**：**/signin** 密码校验文案应正常显示。

**关联**  
- `aim.link-v2/apps/web/src/styles/login-panel.scss`、`aim.link-v2/docs/PROMPTS-LOG.md`

---

### 2026-04-17（aim.link-v2：/signin 与用户 1:2 图对位 — Forgot、输入、标题、底栏）

**User（提示词/原意）**  
- 1 图为当前效果，2 图为希望的原版效果，问能否对比出来。

**Assistant（实现前说明，若有）**  
- 无 Vouchap 代码变更。对比后拟修 **`tips-forgot`** BEM 选择器、输入垂直居中、标题与页签 **`Log In`**、底栏无 **`?` 与 Sign up 之间空隙**。

**Assistant（实现后说明 / 本轮结论）**  
- **`aim.link-v2`**：**`login-panel.scss`**、**`login-form-native.scss`**、**`AuthLoginPanel.tsx`**、**`document-meta.ts`**、**`index.html`**、**`SignInPage.tsx`**、**`docs/PRD.md`**、**`PROMPTS-LOG.md`**、**`README.md`**。  
- **验证**：**`npm run typecheck`**。

**关联**  
- `aim.link-v2/apps/web/src/styles/login-panel.scss`  
- `aim.link-v2/apps/web/src/styles/login-form-native.scss`  
- `aim.link-v2/apps/web/src/pages/AuthLoginPanel.tsx`  
- `aim.link-v2/apps/web/src/lib/document-meta.ts`、`apps/web/index.html`  
- `aim.link-v2/docs/PRD.md`、`aim.link-v2/docs/PROMPTS-LOG.md`、`aim.link-v2/apps/web/README.md`

---

### 2026-04-18（Vouchap：小票 item_alias 识别与写库 — 兼容模型 snake_case）

**User（提示词/原意）**  
- 识别小票的 `item_alias` 字段并没有识别和写库。

**Assistant（实现前说明，若有）**  
- 排查链路：**Gemini 解析** `resolveReadableItemName` 与 **`convertGeminiResultToReceipt`** 仅读取 **`itemAlias`（camelCase）**；若模型返回 **`item_alias`** 等 snake_case，别名在解析阶段丢失，**`database.ts` 插入的 `item_alias` 恒为 null**。拟在 **`gemini.ts`** 集中规范化别名来源，并在 **`receipt-helpers.ts`**（receipt/invoice 转换）做相同兜底。

**Assistant（实现后说明 / 本轮结论）**  
- **`gemini.ts`**：新增 **`normalizedItemAliasFromModel`**，在 **`resolveReadableItemName`** 中合并 **`item_alias` / `display_name` / `readable_name`** 等与税字段一致的命名兼容。  
- **`receipt-helpers.ts`**：新增 **`pickItemAliasFromModelItem`**，**`convertGeminiResultToReceipt`** 与 **`convertGeminiResultToInvoice`** 写入行项时统一取别名。  
- **验证建议**：走一遍拍照识别，在 Supabase **`receipt_items.item_alias`** 或 App 明细中确认非空；若远端未跑迁移 **`20260414170000_add_item_alias_to_receipt_invoice_items.sql`**，插入仍可能报错或列不存在，需单独部署 DB。  
- **残留风险**：若模型把可读名称只写在其它未约定字段，仍可能不落别名。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`  
- `vouchap-app/src/shared-logic/receipt-helpers.ts`  
- `vouchap-app/supabase/migrations/20260414170000_add_item_alias_to_receipt_invoice_items.sql`

---

### 2026-04-18（Vouchap：小票 item_alias 覆盖率与可读性 — 解析启发式 + 提示词）

**User（提示词/原意）**  
- 部分有写入了，但正确性和可读性明显还是不足；有部分仍然为空。

**Assistant（实现前说明，若有）**  
- 空值：模型未产出或产出在非约定字段；**仅 camelCase `itemAlias`** 时部分场景已修，但仍会漏 **`description` / `lineDescription` 等作可读说明** 与 **`productName` / `label`** 等键。  
- 可读性：**提示词**对 `itemAlias` 仍偏「可选」，示例行不像真实 SKU。  
- 拟新增 **`receipt-item-alias.ts`** 统一 **`pickReceiptLineItemAlias`**（多键 + 当 **`name` 像代码** 时用 **`description` 类字段** 作别名）与 **`aliasDistinctFromLineName`**（去重、**过滤像金额的字符串**）；**`gemini.ts`** / **`receipt-helpers.ts`** 共用；收紧 **`RECEIPT_JSON_ITEMS_RULE`** 与示例。

**Assistant（实现后说明 / 本轮结论）**  
- 新模块 **`vouchap-app/src/shared-logic/receipt-item-alias.ts`**：**显式别名键**扩展；**代码行名**时从 **description / details / memo / notes** 等提升为别名；**与行名相同**或**疑似纯金额**的别名丢弃。  
- **`gemini.ts`**：`resolveReadableItemName` 改为调用上述逻辑；**`RECEIPT_JSON_ITEMS_RULE`**、**规则 8 子条**、**`RECEIPT_JSON_ITEMS_EXAMPLE`**、**文字识别 Output JSON** 说明已加强。  
- **`receipt-helpers.ts`**：小票/发票行项 **`itemAlias`** 与 **`itemName`** 对齐去重。  
- **验证**：`npx tsc --noEmit`；实机多类小票（纯数字行、SKU、双语小票）看 **`item_alias`** 是否仍大量为空。  
- **残留**：模型完全不返回可读语义且行上无第二描述时，**无法凭空编造**别名；若需更高覆盖只能接受 **二次 LLM 精炼** 或 **人工规则库**（未做）。

**关联**  
- `vouchap-app/src/shared-logic/receipt-item-alias.ts`  
- `vouchap-app/src/shared-logic/gemini.ts`  
- `vouchap-app/src/shared-logic/receipt-helpers.ts`

---

### 2026-04-18（Vouchap：移除小票行 `tax_class_code` 及行级拆税依赖）

**User（提示词/原意）**  
- 清理 **`tax_class_code`** 相关代码与数据库各表字段；原行级拆税方案有问题。（续作：补全 **`receipt-item-tax.ts`** 等残留。）

**Assistant（实现前说明，若有）**  
- 此前已新增迁移 **`20260418140000_drop_receipt_items_tax_class_code.sql`** 及 **`database.ts` / `types` / `receipt-helpers` / `gemini`** 侧去掉行字段与模型字段。  
- 本轮：**`receipt-item-tax.ts`** 去掉对 **`receipt_items.tax_class_code`** 的 select、行覆盖逻辑、POS 命中与 **receipt.tax fit** 后的回写；**`getApplicableTaxRules`** 去掉 **`lineTaxClassOverride`**，仅 **POS 规则解析类 + 默认 `STANDARD_TAXABLE`**；**`LineMeta`** 去掉 **`fromLineOverride` / `lineTaxClassFromModel`**；实体 POS 学习条件收紧为 **fit 后或非默认可税类**；**`gemini.ts`** 文字识别 Output JSON 行说明补 **`posTaxCode optional`**。

**Assistant（实现后说明 / 本轮结论）**  
- 行税计算与对账不再读写 **`public.receipt_items.tax_class_code`**；CRM 维度的 **`tax_class_code` / `maps_to_tax_class_code`**（税率表、POS 规则）保留。  
- **验证**：部署迁移后跑一笔识别 → **`applyReceiptItemTaxesAndReconcile`** 无列不存在错误；`grep vouchap-app` 无 **`receipt_items`** 侧 **`tax_class_code`** 写入。全仓 **`npx tsc --noEmit`** 仍有大量历史无关错误，**`receipt-item-tax.ts`** 本轮无新增报错。  
- **残留**：未改 **vouchap-crm** 等独立仓库中的税类目录命名。

**关联**  
- `vouchap-app/supabase/migrations/20260418140000_drop_receipt_items_tax_class_code.sql`  
- `vouchap-app/src/shared-logic/receipt-item-tax.ts`  
- `vouchap-app/src/shared-logic/gemini.ts`

---

### 2026-04-18（Vouchap：删列后旧构建「认不出 item」— 原因与是否需发版）

**User（提示词/原意）**  
- 移除该字段后此前构建的 app 识别不出 item，问原因；是否需要马上更新构建。

**Assistant（实现前说明，若有）**  
- 无代码变更。对照当前 **`database.ts`** 插入字段与 **Supabase/PostgREST** 对未知列的行为说明。

**Assistant（实现后说明 / 本轮结论）**  
- **原因**：若远端已执行 **`DROP COLUMN receipt_items.tax_class_code`**，**旧版 bundle** 仍可能在 **`receipt_items` insert/update** 中带 **`tax_class_code`**，API 会报错，**行项写库失败**，表现像「识别不出」实为 **持久化失败**；**`select receipt_items(*)`** 不因缺列而失败。  
- **是否马上更新**：远端已删列则 **需要尽快发版/OTA** 到已去掉该字段payload 的构建；或临时 **加回可空列** 作过渡（不推荐长期）。建议在 Supabase 日志或客户端 **`Receipt items insert error`** 中确认是否为 **unknown column**。  
- **若未跑删列迁移**：旧构建应仍能写列，需另查 **`item_alias`** 等其它迁移与 RLS。

**关联**  
- `vouchap-app/supabase/migrations/20260418140000_drop_receipt_items_tax_class_code.sql`  
- `vouchap-app/src/shared-logic/database.ts`（`receipt_items` insert 已不再含 `tax_class_code`）

---

### 2026-04-18（Vouchap：拆税与写库解耦 — 队列入队 + 后台 worker）

**User（提示词/原意）**  
- 拆税流程与数据库希望不影响已有前端功能与前端所需数据的写库；解耦成纯后端独立流程。

**Assistant（实现前说明，若有）**  
- 原状：**`database.ts`** 在保存小票后 **`queueMicrotask`** 内联调用 **`applyReceiptItemTaxesAndReconcile`**（虽 try/catch 不阻塞保存，仍在用户设备上跑 CRM/行税写库，与「纯后端」不符）。  
- 拟：**保存路径**仅 **`rpc('enqueue_receipt_tax_reconcile')`**；新增表 **`receipt_tax_recalc_queue`**；**`scripts/receipt-tax-queue-worker.ts`**（**service role**）轮询队列并调用既有 **`applyReceiptItemTaxesAndReconcile` + `scheduleReceiptTaxRecalcIfNeeded`**。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移 **`20260418150000_receipt_tax_recalc_queue.sql`**：**`receipt_tax_recalc_queue`** + **`enqueue_receipt_tax_reconcile`**（校验 **`auth.uid()`** 与 **`user_spaces`**）。  
- **`receipt-tax-queue-client.ts`**、**`database.ts`**：保存/更新小票后只 **入队**，不再在客户端执行拆税。  
- **`package.json`**：`receipt-tax-worker` / `receipt-tax-worker:once`。  
- **运维注意**：必须部署该迁移并在服务端配置 **`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`** 定时跑 **`npm run receipt-tax-worker`**（或等价调度），否则行税与对账列可能长期不更新；前端 **`receipts` / `receipt_items` 主数据写库**不受影响。  
- **验证**：跑迁移 → 保存小票 → 队列有行 → worker 跑后 **`receipt_item_taxes` / `tax_reconciliation_*`** 更新。

**关联**  
- `vouchap-app/supabase/migrations/20260418150000_receipt_tax_recalc_queue.sql`  
- `vouchap-app/src/shared-logic/receipt-tax-queue-client.ts`  
- `vouchap-app/src/shared-logic/database.ts`  
- `vouchap-app/scripts/receipt-tax-queue-worker.ts`  
- `vouchap-app/package.json`  
- **接续说明（通俗运维 + 演进备忘）**：`docs/RECEIPT-TAX-ASYNC-PIPELINE.md`

---

### 2026-04-18（Vouchap：拆税异步流水线 — 补文档便于接续）

**User（提示词/原意）**  
- 没听懂先前「运维注意点」；要求自己记好文档，后续进一步设计开发拆税时能接续得上。

**Assistant（实现前说明，若有）**  
- 无业务逻辑变更。新增结构化说明文档，用表格/简图把 **App 只入队、worker 才算税** 与 **不跑 worker 的后果** 写清楚。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 **`docs/RECEIPT-TAX-ASYNC-PIPELINE.md`**：以前 vs 现在、数据流、涉及文件表、运维清单、排障、后续 Edge/Cron 演进备忘；并在 **`PRD-SOURCE-LOG`** 上条「拆税解耦」**关联** 回填该路径。

**关联**  
- `docs/RECEIPT-TAX-ASYNC-PIPELINE.md`

---

### 2026-04-18（Vouchap：`enqueue_receipt_tax_reconcile` 迁移报错 relation sid）

**User（提示词/原意）**  
- **`20260418150000`** 迁移报错：`relation "sid" does not exist`。

**Assistant（实现前说明，若有）**  
- 怀疑 **`$$` 定界**或 **`sid` 标识符**在部分执行环境下被误解析，导致 PL/pgSQL 变量被当成关系名。

**Assistant（实现后说明 / 本轮结论）**  
- **`20260418150000_receipt_tax_recalc_queue.sql`**：`DECLARE sid` 改为 **`v_space_id`**；函数体定界 **`$$` → `$function$`**。若表已建、仅函数失败，可重跑该迁移或单独 **`CREATE OR REPLACE FUNCTION`** 该段。

**关联**  
- `vouchap-app/supabase/migrations/20260418150000_receipt_tax_recalc_queue.sql`

---

### 2026-04-18（Vouchap：迁移仍报 relation v_space_id）

**User（提示词/原意）**  
- 执行迁移仍报错 **`relation "v_space_id" does not exist`**。

**Assistant（实现前说明，若有）**  
- 判定为 **按分号拆分 SQL** 时 **`$function$` 块未整体保留**，PL/pgSQL 片段被当普通 SQL 执行，变量名被当成关系名。

**Assistant（实现后说明 / 本轮结论）**  
- **`enqueue_receipt_tax_reconcile`** 改为 **`AS ' ... '`** 单引号包裹整段函数体；**`RAISE`** 文案中单引号 **`''`** 转义。整段 **`CREATE FUNCTION`** 对外仅末尾一个分号，避免拆分器误切。

**关联**  
- `vouchap-app/supabase/migrations/20260418150000_receipt_tax_recalc_queue.sql`

---

### 2026-04-18（Vouchap：`enqueue` 迁移仍 42P01 — 改为 LANGUAGE sql）

**User（提示词/原意）**  
- 单引号 plpgsql 后仍报 **`relation "v_space_id" does not exist`**。

**Assistant（实现前说明，若有）**  
- 执行环境仍会拆开函数体；去掉 plpgsql 与一切局部变量。

**Assistant（实现后说明 / 本轮结论）**  
- **`20260418150000`**：新增 **`receipt_tax_recalc_queue_pending_receipt_uniq`**；**`enqueue_receipt_tax_reconcile`** 改为 **`LANGUAGE sql`** 单条 **`WITH checks … INSERT … ON CONFLICT`**；校验失败 **`CASE` 短路 + `1/0`**。**`RECEIPT-TAX-ASYNC-PIPELINE.md`** 补说明。若已有多条 **同 receipt 未处理** 行，建唯一索引前需清理重复。

**关联**  
- `vouchap-app/supabase/migrations/20260418150000_receipt_tax_recalc_queue.sql`  
- `docs/RECEIPT-TAX-ASYNC-PIPELINE.md`

---

### 2026-04-18（Vouchap：发布版本号 2.5.8 Build 46）

**User（提示词/原意）**  
- 版本号更新 **2.5.8**。

**Assistant（实现前说明，若有）**  
- 按 **`.cursorrules`** 同步 **`package.json` / `package-lock.json` / `app.config.js` / `android/app/build.gradle` / `ios/Vouchap/Info.plist`**；构建号 **45→46**；仓库无 **`app.json`** 故未改。

**Assistant（实现后说明 / 本轮结论）**  
- 版本 **2.5.8**，**iOS CFBundleVersion / Android versionCode** 均为 **46**；**`git commit` + `git push`**，提交信息 **`发布版本号 2.5.8 (Build 46)`**。

**关联**  
- `vouchap-app/package.json`、`package-lock.json`、`app.config.js`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`

---

### 2026-04-20（独立站点：antbim-website 重设计 + Vercel）

**User（提示词/原意）**  
- 在 workspace 新建项目 **`antbim-website`**，参考 **`https://www.antbim.com/`** 重新设计网站；已有内容需全面用上；UI 风格可按素材重新构思；同样发布在 Vercel 上。

**Assistant（实现前说明，若有）**  
- 在 **`/Users/macbook/antbim-website`** 新建 **Next.js 14 + App Router + Tailwind** 营销落地页；将官网公开信息结构化为 **`lib/site-content.ts`**；首页分段覆盖产品八大模块、五大能力块、ERP、解决方案、案例、资源中心/资讯、信任数据与 CTA；提供 **`vercel.json`** 与 **README** 部署说明。因本机 **`~/.npm` 权限问题**，使用 **`npm install --cache /tmp/npm-cache-antbim`**。未代用户执行 **`vercel --prod`**（需账号/仓库绑定）。

**Assistant（实现后说明 / 本轮结论）**  
- 项目已创建且 **`npm run build`** 通过；页脚注明为重设计演示站点以免与官方混淆，可按需删改。Vercel：将目录推送到 Git 后在 Dashboard 设 Root Directory **`antbim-website`**，或在该目录执行 **`npx vercel --prod`**。

**关联**  
- `/Users/macbook/antbim-website/`（`app/page.tsx`、`components/*`、`lib/site-content.ts`、`README.md`、`vercel.json`）

---

### 2026-04-20（antbim-website：配置 GitHub remote，推送需本机登录/建库）

**User（提示词/原意）**  
- **git 到 github**。

**Assistant（实现前说明，若有）**  
- 根据 sibling 仓库推断 **`origin`** 为 **`https://github.com/jameszjgao/antbim-website.git`**；尝试 **`git push`** 因远端仓库尚未创建而失败；本机 **`gh` 未登录**、**SSH 无可用公钥**，无法在无交互环境下代建仓库或推送。

**Assistant（实现后说明 / 本轮结论）**  
- 已 **`brew install gh`**（此前环境无 `gh`）；**`origin`** 已指向上述 URL；**`README.md`** 增补 GitHub 推送步骤（网页建空库或 **`gh repo create`**）；提交 **`docs: add GitHub push instructions`**。用户需在 GitHub 创建 **`jameszjgao/antbim-website`**（或改掉 remote）后执行 **`git push -u origin main`**，或 **`gh auth login`** 后按 README 方式 B 操作。

**关联**  
- `/Users/macbook/antbim-website/README.md`、`.git/config`（`origin`）

---

### 2026-04-20（antbim-website：请求发布 Vercel — 本机无凭据）

**User（提示词/原意）**  
- **发布到 vercel**。

**Assistant（实现前说明，若有）**  
- 在 **`/Users/macbook/antbim-website`** 执行 **`npx vercel deploy --prod --yes`**；环境变量 **`VERCEL_TOKEN`** 未设置。

**Assistant（实现后说明 / 本轮结论）**  
- CLI 报错：**`No existing credentials found`**（需 **`vercel login`** 或 **`--token`**），无法在助手侧代完成浏览器授权。已扩充 **`README.md`**「发布到 Vercel」：**GitHub Import**、**CLI 登录 + prod**、**Token 非交互部署** 三种路径。用户任选其一后即可上线。

**关联**  
- `/Users/macbook/antbim-website/README.md`

---

### 2026-04-20（antbim-website：从 GitHub 发布到 Vercel — 文档细化）

**User（提示词/原意）**  
- **从 github 发布到 vercel**。

**Assistant（实现前说明，若有）**  
- 无代码逻辑变更；在 **`antbim-website/README.md`** 将「GitHub → Vercel」流程写为可执行分步（GitHub App 授权、Import、Root Directory、Production Branch、Preview）。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新 README **方式 A**；推送 **`main`** 即触发 Vercel 生产部署，PR 预览依赖项目 Git 设置。仍需用户在 Dashboard 完成 Import（助手无法代登录）。

**关联**  
- `/Users/macbook/antbim-website/README.md`

---

### 2026-04-20（antbim-website：默认浅色 + 明暗切换）

**User（提示词/原意）**  
- **只有深色模式，需默认浅色，并可切换**。

**Assistant（实现前说明，若有）**  
- 引入 **`next-themes`**（`class` 策略）、**`ThemeProvider`** 默认 **`light`**、**`enableSystem={false}`**；**`ThemeToggle`** 置于顶栏；**Tailwind** **`darkMode: 'class'`**；全局与各区块补 **`dark:`** 与浅色基准；浅色栅格 **`grid-fade-light`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`npm run build`** 通过；主题会持久化。改动见 **`antbim-website`**：`app/providers.tsx`、`components/ThemeToggle.tsx`、`tailwind.config.ts`、`app/globals.css`、`app/layout.tsx`、`SiteHeader` / `SiteFooter`、`app/page.tsx`、`package.json`。

**关联**  
- `/Users/macbook/antbim-website/`

---

### 2026-04-20（antbim-website：镜像官网图片与 Logo 并接入页面）

**User（提示词/原意）**  
- **原网站上的素材需更全面用上，尤其是图片和 logo**。

**Assistant（实现前说明，若有）**  
- 拉取 **`https://www.antbim.com/`** HTML（**`--compressed`**），提取 CDN 路径；下载至 **`public/assets/antbim/`** 并语义化重命名；新增 **`lib/antbim-assets.ts`**；**`HeroBanner`** 客户端轮播 4 张官网横幅；**`SiteHeader` / `SiteFooter`** 使用 **`logo-header.jpg`** 与 **`icon-phone.png`**；能力块、ERP、案例卡片配图；**`README`** 与页脚注明镜像来源与商用替换提示。

**Assistant（实现后说明 / 本轮结论）**  
- **`npm run build`** 通过；仓库增大约 **7MB+** 静态资源。若 CDN 防盗链变化需重新抓取。

**关联**  
- `/Users/macbook/antbim-website/public/assets/antbim/`、`lib/antbim-assets.ts`、`components/HeroBanner.tsx`、`app/page.tsx`、`components/SiteHeader.tsx`、`components/SiteFooter.tsx`、`README.md`

---

### 2026-04-20（antbim-website：首屏与 Logo 对齐参考 — 去轮播、统一字标）

**User（提示词/原意）**  
- 附图参考：**图片应用很凌乱，logo 没有用上**。

**Assistant（实现前说明，若有）**  
- 新增 **`BrandLogo`**：橙底「蚂」字标 + 字标两行，**顶栏 / 页脚**统一使用，**移动端始终显示字标**（此前易只见小图）。首屏去掉 **`HeroBanner`** 轮播与底点，改为浅灰底 + 低对比水印「数字化经营」+ 右侧柔光；**单张白卡片**承载 **`brand-hero-illustration`**，**CTA 置于主图之下**；能力纵深去掉每块大图，改为标题区 + 要点列表；ERP 区去掉与首屏重复的大图；导航「资源中心」改为「**资讯中心**」对齐参考；删除未再使用的 **banner webp** 与 **`HeroBanner.tsx`**；**`antbim-assets`** 去掉 **`banners`** 导出。

**Assistant（实现后说明 / 本轮结论）**  
- **`npm run build`** 通过；**`README`** 已更新说明。

**关联**  
- `/Users/macbook/antbim-website/components/BrandLogo.tsx`、`SiteHeader.tsx`、`SiteFooter.tsx`、`app/page.tsx`、`lib/antbim-assets.ts`、`lib/site-content.ts`、`README.md`

---

### 2026-04-20（antbim-website：运营方授权 — 学全站内容并重设计为替换官网的营销站）

**User（提示词/原意）**  
- 需把**原网站上的所有内容学习理解了**，然后**重新设计**，以**最有利于蚂蚁分工的营销推广**为目的；用户即**蚂蚁分工运营方**，**原网站素材直接授权可用**；**后续设计的网站需直接替换原站**。

**Assistant（实现前说明，若有）**  
- 抓取 **`antbim.com`** 首页 HTML（**meta 长描述**、模块文案）及 **`/Solution/`**（行业/场景标签与案例标题节选）；重写 **`lib/site-content.ts`**：品牌长文、转化路径、**`whyAntbim`**、**`industryTags` / `scenarioTags` / `solutionCopy`**、能力块 **`marketingOutcome`**、**`midFunnelCta`**、**`faqItems`**、**`resourceHubItems`**、案例 **`outcome`**、资讯补三条场景实践标题；**`app/page.tsx`** 增「为什么选择」、中段 CTA、解决方案双栏标签云、FAQ **`details`**、资源结构化列表；**`SiteFooter`** 去「演示」表述改**运营授权**；**`README`** 改为**替换原站**清单与营销目标说明；**`siteMeta.title/description`** 对齐 SEO。

**Assistant（实现后说明 / 本轮结论）**  
- **`npm run build`** 通过。原站若还有子栏目独占长文，上线前可再拆独立路由或外链；**#cta** 按钮仍为占位，需接表单与真实资讯 URL。

**关联**  
- `/Users/macbook/antbim-website/lib/site-content.ts`、`app/page.tsx`、`components/SiteFooter.tsx`、`README.md`

---

### 2026-04-20（antbim-website：替换原站 1:1 栏目与 URL — 全量保留）

**User（提示词/原意）**  
- 替换原站时要 **1:1 栏目与 URL 迁移**，**全部保留**，**不合并和省略**。

**Assistant（实现前说明，若有）**  
- 以 **`sitemap.xml`** 为权威路径全集生成 **`lib/migration/legacy-paths.ts`**；首页 **`/`** 仍由 Next 营销页承接（与「新首页替换」目标一致），其余 path 在迁移期由 **Edge middleware** 按环境变量 **rewrite** 到 **`LEGACY_UPSTREAM_ORIGIN`**；文档强调 **DNS 已切到本站时 upstream 不可同源** 以免死循环。顶栏与页内主要外链改为 **`legacyPublicPaths`**（与旧站 path 一致，含 **`/Solution/`** 大小写）。提供 **`npm run sync-legacy-paths`** 与 **`.env.example`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已生成 **668** 条（不含 `/`）+ 脚本补 **`/wxGetOpenId.jsp`**；**`npm run build`** 通过。未在 sitemap 出现的入口需维护 **`EXTRA_PATHNAMES`** 后重跑同步。演示/下载类按钮暂统一指向旧站 **`/h-msgBoard.html`**（若后续对照原站 HTML 有更细 URL，可在 **`conversion`** 中拆分）。

**关联**  
- `/Users/macbook/antbim-website/middleware.ts`、`lib/migration/legacy-paths.ts`、`scripts/sync-legacy-paths.mjs`、`lib/site-content.ts`、`app/page.tsx`、`components/SiteHeader.tsx`、`README.md`、`.env.example`、`package.json`

---

### 2026-04-20（antbim-website：顶栏使用原站横版带名称 Logo）

**User（提示词/原意）**  
- 原网站**带名称的 logo** 需用上（用户附图：橙标 +「蚂蚁分工」横版字标）。

**Assistant（实现前说明，若有）**  
- 将用户提供的 PNG 落入 **`public/assets/antbim/logo-wordmark.png`**；**`antbim-assets.ts`** 增加 **`logoWordmark`**；**`BrandLogo`** 改为 **`next/image`** 展示该资源，顶栏 **`priority`** 以利 LCP；组件标 **`"use client"`** 以便继续被 **`SiteHeader`**（客户端组件）引用。

**Assistant（实现后说明 / 本轮结论）**  
- 已替换原先「蚂」字占位格 + 双行字标；**`npm run build`** 通过。若暗色顶栏对比不足，可再提供反白字标版本并做 **`dark:`** 切换。

**关联**  
- `/Users/macbook/antbim-website/public/assets/antbim/logo-wordmark.png`、`lib/antbim-assets.ts`、`components/BrandLogo.tsx`、`components/SiteHeader.tsx`

---

### 2026-04-20（antbim-website：Favicon 使用原站 favicon.ico）

**User（提示词/原意）**  
- **favicon** 也需要用**原站的图片**。

**Assistant（实现前说明，若有）**  
- 从 **`https://www.antbim.com/favicon.ico`** 拉取；响应对 body 为 **gzip**，需 **`gunzip -c`** 得到真实 **MS Windows icon**（多尺寸）后写入 **`app/favicon.ico`**，由 Next App Router 自动作为 **`/favicon.ico`** 提供，无需改 **`metadata.icons`**。

**Assistant（实现后说明 / 本轮结论）**  
- 已落盘 **`antbim-website/app/favicon.ico`**（约 108KB，含多分辨率）；**`npm run build`** 通过。

**关联**  
- `/Users/macbook/antbim-website/app/favicon.ico`

---

### 2026-04-20（antbim-website：注册/登录指向 login.antbim.cn）

**User（提示词/原意）**  
- **注册/登录**按钮指向 **`https://login.antbim.cn/login`**。

**Assistant（实现前说明，若有）**  
- 在 **`lib/site-content.ts`** 增加 **`authAppLoginUrl`**，**`conversion.login.href`** 改为该绝对地址；**`legacyPublicPaths.login`** 更名为 **`legacyMarketingLogin`**（仅注释旧站 **`/h-login.html`**，避免与正式登录域混淆）。**`SiteHeader`** 顶栏与移动端抽屉改为 **`<a rel="noopener noreferrer">`**，去掉仅用于该外链的 **`next/link`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`npm run build`** 通过。

**关联**  
- `/Users/macbook/antbim-website/lib/site-content.ts`、`components/SiteHeader.tsx`

---

### 2026-04-20（antbim-website：顶栏各 path 默认回源，避免 404）

**User（提示词/原意）**  
- **各页签都 404**，应把页面**补全**（意指栏目页应能打开）。

**Assistant（实现前说明，若有）**  
- 根因多为未配置 **`LEGACY_PROXY_ENABLED` / `LEGACY_UPSTREAM_ORIGIN`** 时中间件直接放行，Next 又无对应路由。调整 **`middleware.ts`**：默认上游 **`https://www.antbim.com`**；**`LEGACY_PROXY_ENABLED`** 仅 **`0`/`false`** 时关闭，否则在**请求 Host 与上游 Host 不同**时默认回源（本地、**`*.vercel.app`** 预览免配）；**请求 Host 与上游 Host 相同**时跳过回源以防 DNS 已指本站时的死循环，并文档说明生产须独立 **`LEGACY_UPSTREAM_ORIGIN`** 或慎用 **`LEGACY_FORCE_SAME_HOST_PROXY`**。同步 **`.env.example`**、**`README.md`**。

**Assistant（实现后说明 / 本轮结论）**  
- **`npm run build`** 通过。生产同域仍 404 时属预期保护，需按 README 配置镜像 origin。

**关联**  
- `/Users/macbook/antbim-website/middleware.ts`、`.env.example`、`README.md`

---

### 2026-04-27（Vouchap：版本号更新至 2.5.9）

**User（提示词/原意）**  
- “Vouchap项目，app版本号更新2.5.9”。

**Assistant（实现前说明，若有）**  
- 按仓库版本管理规则，同步更新 `vouchap-app` 的版本号与原生构建号：`package.json`、`package-lock.json`、`app.json`、`app.config.js`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`；将版本升级到 `2.5.9`，Build 从 `46` 递增到 `47`。

**Assistant（实现后说明 / 本轮结论）**  
- 已完成版本同步：`version = 2.5.9`，`iOS CFBundleVersion = 47`，`Android versionCode = 47`，并补充最小 `app.json` 以满足发布规则链路完整性。  
- 已按规范提交并推送，提交信息：`发布版本号 2.5.9 (Build 47)`。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/package.json`、`package-lock.json`、`app.json`、`app.config.js`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`

---

### 2026-04-27（Vouchap：对齐 Expo 已构建号并改为后续自动递增）

**User（提示词/原意）**  
- “现在expo上已经构建的构建号ios是32，android是49。保持一致，后续本地不用动，有Expo在每次构建时自动更新。”

**Assistant（实现前说明，若有）**  
- 将本地版本配置中的构建号对齐到 Expo 当前状态：iOS 使用 `32`，Android 使用 `49`；不修改语义版本 `2.5.9`，仅修正构建号基线。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新构建号：`app.config.js`、`app.json`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`。  
- 当前本地与 Expo 已构建号一致，可按你的要求后续由 Expo 构建自动递增，不再手动同步本地构建号。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/app.config.js`、`app.json`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`

---

### 2026-04-27（Vouchap：触发全平台 Production 构建）

**User（提示词/原意）**  
- “全平台构建production”。

**Assistant（实现前说明，若有）**  
- 在 `vouchap-app` 使用 EAS `production` profile 触发 `--platform all` 构建；遵循 `eas.json` 中 `appVersionSource: remote` 与 `autoIncrement: true` 配置。

**Assistant（实现后说明 / 本轮结论）**  
- 已成功发起 Android + iOS 的 production 构建任务。  
- 本次自动递增结果：Android `versionCode 49 -> 50`，iOS `buildNumber 32 -> 33`（由 Expo 远端版本源递增）。  
- 当前状态：iOS `new`、Android `in queue`，构建仍在云端执行中，可通过日志链接实时查看。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/eas.json`

---

### 2026-04-28（Vouchap：Receipt 详情编辑态避免分类/用途改动覆盖草稿）

**User（提示词/原意）**  
- “receipt详情页中，修改entity、item名称、币种等内容之后，如果更换了category或attribution，会导致已修改的其他内容恢复原值。应该优化可以同时修改。”

**Assistant（实现前说明，若有）**  
- 排查 `receipt-details/[id].tsx` 中编辑态与实时刷新（realtime + `loadReceipt`）的状态同步逻辑，目标是避免在编辑过程中因分类/用途更新触发整单重载而覆盖 `editedReceipt` 草稿；保留必要场景下的强制回滚能力。

**Assistant（实现后说明 / 本轮结论）**  
- 已将 `loadReceipt` 改为带可选参数的 `useCallback`，并新增 `editingRef`：编辑态默认仅更新 `receipt` 基线，不覆盖 `editedReceipt`。  
- 修复后在同一编辑会话中可同时改 `entity/item name/currency/tax` 等字段，再改 `category/attribution` 不会把前述修改回滚。  
- 对于商品项直改失败场景，保留 `loadReceipt({ forceSyncEdited: true })` 强制同步回滚，避免脏草稿残留。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`

---

### 2026-04-28（Vouchap：核查并修复其他详情页编辑草稿被回刷覆盖）

**User（提示词/原意）**  
- “其他模块的详情页也需核查同类问题”。

**Assistant（实现前说明，若有）**  
- 排查 `invoice-details`、`inbound-details`、`outbound-details` 的详情页加载与 realtime 回刷逻辑，重点核查是否存在 `loadXxx` 直接覆盖 `editedXxx` 导致编辑态草稿回滚。

**Assistant（实现后说明 / 本轮结论）**  
- 已确认并修复 3 个详情页同类风险：新增 `editingRef`，将 `loadXxx` 改为 `useCallback` 且支持 `forceSyncEdited`；编辑态下默认只更新展示基线，不覆盖草稿，避免实时回刷导致用户已改字段丢失。  
- 已同步调整相关 `useEffect` 依赖（含 realtime refresh 调用），确保行为稳定；`ReadLints` 检查通过。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/invoice-details/[id].tsx`  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/inbound-details/[id].tsx`  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/outbound-details/[id].tsx`

---


### 2026-04-30（aim-link-website：统一登录入口到 appv2 /signin）

**User（提示词/原意）**  
- “把aim.link-website网站上的各处登录链接改为https://appv2.aim.link/signin”。

**Assistant（实现前说明，若有）**  
- 在 `aim-link-website` 全局检索旧登录 URL（`https://app.aim.link/login`），先覆盖前端页面中的用户可见入口，再同步更新项目内文档说明，最后回查确保无遗漏。

**Assistant（实现后说明 / 本轮结论）**  
- 已将旧登录链接统一替换为 `https://appv2.aim.link/signin`，覆盖首页、导航、服务页及相关文档条目。  
- 回查结果：仓库中不再存在 `https://app.aim.link/login`。

**关联**  
- `/Users/macbook/aim-link-website/src/pages/Home.jsx`  
- `/Users/macbook/aim-link-website/src/components/Navbar.jsx`  
- `/Users/macbook/aim-link-website/src/pages/Service.jsx`  
- `/Users/macbook/aim-link-website/OPTIMIZATION_REPORT.md`  
- `/Users/macbook/aim-link-website/CHECKLIST.md`

---

### 2026-05-01（Vouchap：客户端 Gemini key 文案与残留清理）

**User（提示词/原意）**  
- 在 Supabase 已用 CLI 配好密钥的前提下，要求助手直接改代码：排查并清理 app/web 端对 API key 的依赖与残留。

**Assistant（实现前说明，若有）**  
- 全库检索 `EXPO_PUBLIC_GEMINI`、`@google/generative-ai` 直连、根目录重复 `lib/gemini*`；集中整理 `vouchap-app/src/shared-logic/gemini.ts` 的错误码与提示，使其指向 Supabase `gemini-proxy`；移除 `.env` 中客户端 Gemini 变量，删除已无路径引用的根目录副本文件。

**Assistant（实现后说明 / 本轮结论）**  
- `gemini.ts`：统一 `throwGeminiProxyUnavailable` / 错误码 `GEMINI_PROXY_UNAVAILABLE`；移除对 `EXPO_PUBLIC_GEMINI_API_KEY`、`EAS Secrets` 的误导性提示与多余 `Constants` 引用；删除所有「无 key」分支（占位 key 恒为真时的死代码）。  
- 根目录 `app.config.js`：`extra.geminiApiKey` 与 `vouchap-app` 一致为占位字符串，不再读取 `EXPO_PUBLIC_GEMINI_API_KEY`。  
- 删除未再被 `@/lib/*` 解析使用的 `lib/gemini.ts`、`lib/gemini-helper.ts`；`test-gemini-api*.js` 仅接受环境变量 `GEMINI_API_KEY`（可选本地直连 Google 冒烟测试，与 App 无关）。  
- `/.env` 与 `vouchap-app/.env`：移除 `EXPO_PUBLIC_GEMINI_API_KEY` 行，改为注释说明密钥仅在 Supabase Function secret。  
- `ReadLints` 对改动 TS/JS 文件检查通过。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/gemini.ts`  
- `/Users/macbook/Vouchap/app.config.js`  
- `/Users/macbook/Vouchap/.env`  
- `/Users/macbook/Vouchap/vouchap-app/.env`  
- `/Users/macbook/Vouchap/test-gemini-api.js`  
- `/Users/macbook/Vouchap/test-gemini-api-simple.js`

---

### 2026-05-01（Vouchap：发布 vouchap-app 2.6.0 / Build 50）

**User（提示词/原意）**  
- 「版本号更新为2.6.0」。

**Assistant（实现前说明，若有）**  
- 按 `.cursorrules` 同步 `vouchap-app` 的 `package.json`、`package-lock.json`、`app.json`、`app.config.js`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`；并检查 `ios/.../project.pbxproj` 中 `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` 与构建号一致。

**Assistant（实现后说明 / 本轮结论）**  
- 应用版本号统一为 **2.6.0**；iOS `CFBundleVersion` 与 Android `versionCode` 统一为 **50**（`project.pbxproj` 同步为 `MARKETING_VERSION = 2.6.0`、`CURRENT_PROJECT_VERSION = 50`）。  
- 已执行 `git commit` + `git push`，提交说明：`发布版本号 2.6.0 (Build 50)`。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/package.json`  
- `/Users/macbook/Vouchap/vouchap-app/ios/Vouchap.xcodeproj/project.pbxproj`

---

### 2026-05-03（Vouchap：iOS 小票频繁 Needs Retake —— HEIC 误标为 JPEG 上传修复）

**User（提示词/原意）**  
- vouchap app **iOS 版频繁出现 needs retake**，**同一张小票 Android 正常**；均为 **v2.6.0**。

**Assistant（实现前说明）**  
- 追溯 `needs_retake`：`receipt-helpers` 中 `adjustedConfidence < 0.4`；`receipt-processor` 中识别失败/配额也会置该状态。  
- 对比上传链：`getImageExtAndMime` 仅从路径识别 `jpg/png/gif/webp`；iOS 相册常见 **HEIC**，路径无匹配扩展名时会被**默认成 `.jpg` + `image/jpeg`**，但字节仍为 **HEIC**，与 MIME 不一致易导致远端/Gemini 解码差、置信度低；Android 多为 JPEG，故现象不对称。  
- 计划在 **`uploadReceiptImageTempWithSpace`**、**`uploadReceiptImage`**（原生、图片类）上传前与 **`uploadSpaceImage`** 一致：**统一经 `expo-image-manipulator` 转为 JPEG**；非图片 MIME（如 PDF，`fileOpts`）跳过。

**Assistant（实现后说明 / 本轮结论）**  
- 在 `vouchap-app/src/shared-logic/supabase.ts` 增加 **`ensureNativeImageUriIsJpegForStorage`**，并在上述两函数中在读取/上传前调用；Web 与 `blob:`/`data:` 不变。  
- **验证建议**：iOS 从相册选 HEIC 小票 → 识别应不再因格式误判大面积 Needs Retake；Android 回归抽查。  
- **残留风险**：相册图会多一次 JPEG 重编码（与 scanner 已 JPEG 路径叠加时轻微质量损失）；非图片 `fileOpts` 必须保持正确 MIME 以免误转。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/supabase.ts`  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/receipt-helpers.ts`（置信度规则背景）

---

### 2026-05-03（Vouchap：v2.6.0 服务端 AI 与 iOS/Android 差异 —— 补充核实）

**User（提示词/原意）**  
- **v2.6.0** 把 AI 调到**服务端**后出现差异；**之前 iOS 拍照识别也正常**；要求**再核实其它可能原因**。

**Assistant（实现前说明）**  
- 无新代码变更；阅读 **`gemini-server-sdk`**、**`supabase/functions/gemini-proxy`**、**`recognizeReceipt`**：图片仍在**客户端** `downloadAsync` → base64，`generateContent` 经 **`gemini-proxy`** 转发 Google；澄清「服务端」仅密钥与 API 调用位置，**不**改变客户端图片字节与 **URL 推断 mime** 逻辑。

**Assistant（实现后说明 / 本轮结论）**  
- 列出除 **HEIC 误标** 外可能原因：**(1)** **`recognizeReceipt` / `downloadImageToBase64`** 仅用 **URL 子串**定 `mimeType`，与真实字节不一致时迁服务端前后都存在；**(2)** **`GEMINI_ENFORCE_SERVER_MODEL` / `GEMINI_MODEL_DEFAULT`** 若强制单模型，与旧版多模型回退相比对难样本的 **confidence / imageQuality** 可能更差；**(3)** **`receipt-helpers`** 金额钩稽与 **imageQuality** 惩罚导致 **adjustedConfidence &lt; 0.4**；**(4)** 相册入口 **`fromGallery`** 曾跳过预处理，与扫描/相机链不一致；**(5)** 模型随机性、分辨率与 **VisionKit vs Android** 扫描输出差异。  
- **建议**：对失败样本看 **`Confidence calculation`** 日志；核对 Edge Function 环境变量；长期可在客户端按 **魔数** 修正 **inlineData.mimeType**。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/gemini.ts`（`recognizeReceipt`、`downloadImageToBase64`）  
- `/Users/macbook/Vouchap/vouchap-app/supabase/functions/gemini-proxy/index.ts`  
- `/Users/macbook/Vouchap/vouchap-app/src/shared-logic/receipt-helpers.ts`

---

### 2026-05-04（Vouchap：重新识别 FAB 去文案 + 白底图标；needs_retake 隐藏确认）

**User（提示词/原意）**  
- 重新识别按钮**去除文案**；icon **白底风格**（与确认按钮一致感）；**识别不成功**时**去除确认**按钮。

**Assistant（实现前说明）**  
- 在 `receipt-details` / `invoice-details`：失败态 `retryFab` 仅保留 icon；白底圆 + 彩色 `refresh`（与确认 FAB 同尺寸与阴影）；确认 FAB 仅在 `status === 'pending'` 显示，`needs_retake` 不再显示。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新两详情页样式与条件渲染；`ReadLints` 通过。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/invoice-details/[id].tsx`

---

### 2026-05-04（Vouchap：确认/重新识别 FAB 外环色 + 内白圆 + 线形 icon）

**User（提示词/原意）**  
- **红底**内套**白底**+**红色线形** icon；与确认按钮**同样风格**（**紫底**+**白底**+**紫色线形** icon）。

**Assistant（实现前说明）**  
- 在 `receipt-details` / `invoice-details` 将确认与重新识别 FAB 统一为：外环为 `fab` 圆（确认紫、重试红），内层 `fabRingInner` 白圆，Ionicons 使用 `*-outline` 线形图标且与外环同色。

**Assistant（实现后说明 / 本轮结论）**  
- 确认：`checkmark-circle-outline` + `#6C5CE7`；重试：`refresh-outline` + `#E74C3C`，外环底 `#E74C3C`。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/invoice-details/[id].tsx`

---

### 2026-05-04（Vouchap：FAB 内白圆缩小以对齐编辑钮比例）

**User（提示词/原意）**  
- **白底尺寸过大**，跟**编辑按钮**比例不一致。

**Assistant（实现前说明）**  
- 编辑 FAB 为 64×64 满底 + 32pt 图标；将 `fabRingInner` 由 44 改为 **34**，线形 icon **26→22**，使外环可见宽度更接近编辑钮图示留白比例。

**Assistant（实现后说明 / 本轮结论）**  
- 已同步 `receipt-details` / `invoice-details`；`ReadLints` 通过。

**关联**  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`  
- `/Users/macbook/Vouchap/vouchap-app/src/mobile-ui/app/invoice-details/[id].tsx`

---

### 2026-05-06（Vouchap：input_type 历史回填 SQL + image/camera 图标区分）

**User（提示词/原意）**  
- 写 SQL：将 **2026-03-01 17:00 之前** 的 receipt/invoice 中 `input_type = 'image'` 改为 **`camera`**。  
- 将 **`image`** 提交方式在 **Web Method 列**与 **App 确认状态角标** 换为**图片样式** icon（与 `camera` 区分）。

**Assistant（实现前说明）**  
- 表名：`public.receipts`、`public.invoices`；字段 `input_type`、`created_at`、`updated_at`。截止时间默认按 **东八区 2026-03-01 17:00** 写入 SQL 注释中说明可改时区。  
- UI：`voucher-table-columns` 的 `InputTypeCell` 为 Web Method；列表 confirmed 角标在 `receipts` / `invoices` / `inbound` / `outbound`；抽 `input-type-ionicon.ts` 避免重复。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `vouchap-app/docs/sql/backfill-input-type-image-to-camera-before-2026-03-01.sql`（`BEGIN`/`COMMIT` 两段 `UPDATE`）。  
- `InputTypeCell`：`image` → `images-outline` + 文案 Image；`camera` → `camera` + Camera。  
- 角标统一 `inputTypeConfirmBadgeIonicon`：`image` → `images-outline`。  
- **验证**：在 Supabase 先 `SELECT COUNT` 再执行 SQL；App/Web 打开支出/收入列表，确认相册类为图集 icon、拍摄为相机 icon。  
- **残留**：若截止时间需与仓库 -06 时区对齐，请改 SQL 内 `timestamptz` 字面量。

**关联**  
- `vouchap-app/docs/sql/backfill-input-type-image-to-camera-before-2026-03-01.sql`  
- `vouchap-app/src/shared-logic/input-type-ionicon.ts`（`@/lib/*` → shared-logic，勿放 mobile-ui/lib）  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`、`invoices.tsx`、`inbound.tsx`、`outbound.tsx`

---

### 2026-05-06（Vouchap dev 白屏：Metro 解析 `@/lib/input-type-ionicon` 路径错误）

**User（提示词/原意）**  
- 「dev白屏了」

**Assistant（实现前说明）**  
- Metro 报错：`Failed to get the SHA-1 for .../src/shared-logic/input-type-ionicon`；`tsconfig` 中 `@/lib/*` 映射到 `shared-logic`，模块曾误放在 `mobile-ui/lib`，解析到不存在的 shared-logic 路径导致打包失败。

**Assistant（实现后说明 / 本轮结论）**  
- 将 `input-type-ionicon.ts` 移至 `src/shared-logic/input-type-ionicon.ts`，删除 `mobile-ui/lib` 下旧文件；`@/lib/input-type-ionicon` 导入不变。**验证**：`npx expo start` 后 Web/Android 应能正常 bundle。

**关联**  
- `vouchap-app/src/shared-logic/input-type-ionicon.ts`

---

### 2026-05-06（Vouchap：image 提交方式改为 solid `images` 与相机/录音一致）

**User（提示词/原意）**  
- 图片 icon 改为 **solid**，与已有相机/录音风格一致；**App** expenses/income 列表**确认状态**标识也要换 icon。

**Assistant（实现前说明）**  
- Web Method 列：`InputTypeCell` 中 `image` 由 `images-outline` 改为 **`images`**（Ionicons 实心）。  
- App 角标：`inputTypeConfirmBadgeIonicon` 同步为 **`images`**（receipts/invoices/inbound/outbound 已统一引用该函数）。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `input-type-ionicon.ts`、`voucher-table-columns.tsx`；`ReadLints` 通过。

**关联**  
- `vouchap-app/src/shared-logic/input-type-ionicon.ts`  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`

---

### 2026-05-06（Vouchap：image 提交方式 icon 与 Chat 上传一致，统一 solid `image`）

**User（提示词/原意）**  
- icon 与 **chat 窗口上传文件**一致，要 **solid** 版。

**Assistant（实现前说明）**  
- Chat 上传原为 `image-outline`；实心对应 **`image`**（与 `images` 多图标区分）。Method 列与 `inputTypeConfirmBadgeIonicon` 同步；`chat-to-log`、`WebChatFab` 上传钮改为 `image` 以全链路一致。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `input-type-ionicon.ts`、`voucher-table-columns.tsx`、`chat-to-log.tsx`（Web+Native 上传钮）、`WebChatFab.tsx`。

**关联**  
- `vouchap-app/src/shared-logic/input-type-ionicon.ts`  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`  
- `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`  
- `vouchap-app/src/mobile-ui/components/WebChatFab.tsx`

---

### 2026-05-06（Vouchap：App confirmed 角标与 Web Method 图标统一 + input_type 规范化）

**User（提示词/原意）**  
- App expenses/income 列表 **confirmed** 角标仍未与 Web 对齐；**image** 用图片 icon、**camera** 用相机 icon。

**Assistant（实现前说明）**  
- 抽出 `inputTypeMethodIonicon` + `normalizeInputTypeForUi`（大小写/异常值）；Web `InputTypeCell` 与角标共用同一映射；**text** 与 Web 一致改为 `document-text`（原角标 `menu`）。  
- 修正 invoice 列表 `inputType` 缺省：由一律 `image` 改为与 receipt 一致 `image_url ? image : text`。  
- 角标 icon **12→13** 略增可读性。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新 `input-type-ionicon.ts`、`voucher-table-columns.tsx`、`invoices.ts`（rowToInvoice + first paint）、`receipts.tsx` / `invoices.tsx` 角标字号；`ReadLints` 通过。

**关联**  
- `vouchap-app/src/shared-logic/input-type-ionicon.ts`、`invoices.ts`  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`、`invoices.tsx`

---

### 2026-05-09（Vouchap：小票支付账户按卡尾号匹配已有账户 + 提示词补强）

**User（提示词/原意）**  
- 精简提示词后 receipt 账户匹配变差；举例 Canadian Tire 小票票面有 Visa 尾号 **1102**，space 中已有 **credit card \*\*\*\*1102**，应能识别后直接匹配该账户。

**Assistant（实现前说明）**  
- 原链路依赖模型输出 `paymentAccountName` 后经 `findOrCreateAccount`（规范化全等 + 卡尾号启发式）；精简提示词后模型更易输出 `null` 或仅「VISA」导致无法与已有账户对齐。  
- 计划：① 收据/发票 JSON 增加 `paymentCardLastFour` 并在解析层规范化；② 提示词明确「尾号必须输出、列表项逐字匹配、禁止仅品牌词」；③ `resolveAccountByCardLastFourDigits` 在空间内按尾号+合并链解析唯一账户；④ `convertGeminiResultToReceipt` / `convertGeminiResultToInvoice` 优先尾号匹配再 `findOrCreateAccount`；⑤ 扩展 `extractCardSuffix` 以覆盖 `VISA #: ****…1102` 等票面格式。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-app/src/shared-logic/accounts.ts`（`extractCardSuffix` 导出、`normalizeCardLastFourDigits`、`resolveAccountByCardLastFourDigits`、票面 `#:` 掩码模式）、`gemini.ts`（规则与 schema、`paymentCardLastFour` 贯通图片/文档/文字/音频及发票侧）、`types/index.ts`、`receipt-helpers.ts`（`resolveAccountIdFromGeminiPaymentFields`）。  
- **验证建议**：用该 Canadian Tire 样张走识别 → 应绑定已有 `****1102` 账户；Dev 可查模型 JSON 是否含 `paymentCardLastFour` / 带尾号的 `paymentAccountName`。  
- **残留风险**：同一 space 内多条账户同名尾号时按 `usage_count` 择优，可能非用户主观「主卡」；模型仍完全不输出尾号时仅提示词与票面 regex 无法挽救。

**关联**  
- `vouchap-app/src/shared-logic/accounts.ts`、`gemini.ts`、`receipt-helpers.ts`、`types/index.ts`

---

### 2026-05-09（Vouchap：对比 #4fd4618 前规则 — 修复税费进 items、tax=0 与账户「仅 Visa」）

**User（提示词/原意）**  
- `#4fd4618` 精简提示词过度，识别/匹配异常（例：GST/RST 被写入 item、**Tax 显示 0**；账户仅 **Visa** 未对齐已有 `****1102`）。要求对比该 commit 前原提示词与代码并修复。

**Assistant（实现前说明）**  
- 旧版规则明确 **items 不含税行、税由 app 侧处理**；精简后模型常把 GST/RST 当普通行，且 `tax` 仍用 `total − sum(items)` 推断 → 三者相加已等于 total → **tax 恒为 0**。  
- 计划：① 恢复提示词关键约束（items=可售行、`tax`=销售税合计、分类/归因择项原则简述）；② 增加确定性后处理 `normalizeParsedReceiptTaxFields`：按行名/分类启发式剥离税行并汇总到 `tax`，再与 `totalAmount` 对齐；③ 全路径（图片/文档/文字/音频 + 发票同类路径）在 `convert` 前调用；④ `ensurePaymentAccountNameWithLastFour` 在仅有卡品牌但有 `paymentCardLastFour` 时补 **`Card ****{last4}`**，利于尾号匹配。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-app/src/shared-logic/gemini.ts`（提示词、`receiptItemLooksLikeSalesTaxBreakdown` / `separateReceiptTaxLinesFromItems` / `normalizeParsedReceiptTaxFields`、`ensurePaymentAccountNameWithLastFour`；收据/发票返回处税字段与 `dataConsistency` 与剥离后 items 一致）。`receipt-processor` 无需再改（税纠正在 `recognizeReceipt` 结果上已完成）。  
- **验证**：Canadian Tire 样张应 **Tax ≈ 3.00**、items 仅商品行；有尾号时账户应能匹配 `credit card ****1102`。  
- **残留**：启发式可能误剥含 “tax” 字样的极少数商品名；若发生可再收紧规则或依赖模型遵守提示词。

**关联**  
- `git show 4fd4618^:vouchap-app/src/shared-logic/gemini.ts`（旧提示词对照）  
- `vouchap-app/src/shared-logic/gemini.ts`

---

### 2026-05-09（Vouchap Web 再识别：税与 item 正确但账户为「VISA CREDIT」未对齐 ****1102）

**User（提示词/原意）**  
- 同一张小票 Web 再次识别：item/tax 已正确，账户仍显示 **VISA CREDIT**，未对应 space 内 **credit card \*\*\*\*1102**。

**Assistant（实现前说明）**  
- 模型常把票面 **Account type** 填进 `paymentAccountName`，而省略 `paymentCardLastFour`；`extractCardSuffix("VISA CREDIT")` 无数字，尾号匹配与 `ensurePaymentAccountNameWithLastFour` 的单品牌正则均不命中。  
- 计划：① `enrichParsedPaymentCardFields`：从**整段模型原文**与**解析后 JSON 深搜字符串**中提取 `\*{3,}(\d{4})` / `extractCardSuffix` 补全 `paymentCardLastFour`；② `paymentAccountLabelIsCardTypeOnly` 覆盖 **VISA CREDIT / CHIP CARD** 等，有尾号时改写 `paymentAccountName`；③ `ensurePaymentAccountNameWithLastFour` 同步；④ `resolveAccountIdFromGeminiPaymentFields` 对卡类型占位名**不走** `findOrCreateAccount(name)`，仅依赖尾号或 `Card \*\*\*\*`；⑤ 提示词强调勿用 account-type-only 作 `paymentAccountName`。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-app/src/shared-logic/gemini.ts`、`receipt-helpers.ts`。**验证**：再识别 Canadian Tire 样张应得到 `paymentCardLastFour: 1102` 并匹配已有账户或 `Card \*\*\*\*1102`。  
- **残留**：若模型全文完全不出现掩码数字串，仍无法推断尾号；需用户选手动账户。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`、`receipt-helpers.ts`

---

### 2026-05-09（Vouchap：receipt 级税种拆分灵活存储与分类统计）

**User（提示词/原意）**  
- 行级拆税到 item 已废弃；需在 **receipt 级**识别/存储税种拆分，并支持按税种分类统计；不同小票税种集合不固定，需灵活存储。

**Assistant（实现前说明）**  
- 库表已有 `receipts.tax_breakdown`（jsonb）；此前多为扁平 `{ GST: n, RST: m }`。  
- 计划：① 约定并存 **对象数组** `{ code, label, rateLabel?, amount, source? }` 与 **扁平对象**（向后兼容）；② 新增 `receipt-tax-breakdown.ts`（coerce、按行剥离税项生成 breakdown、按 `code` 聚合）；③ `gemini` 提示词与 `normalizeParsedReceiptTaxFields`：模型输出 `taxBreakdown`，或与启发式剥离的税行合并（优先剥离行金额）；④ `Receipt` / `GeminiReceiptResult` 类型与 `saveReceipt` / `updateReceipt` / 列表与详情查询映射 `tax_breakdown`；⑤ `receipt-item-tax` 中单行小票 + `tax_breakdown` 逻辑改为调用统一解析（支持数组）。

**Assistant（实现后说明 / 本轮结论）**  
- 已新增 `vouchap-app/src/shared-logic/receipt-tax-breakdown.ts`（`coerceReceiptTaxBreakdownEntries`、`taxBreakdownEntriesFromStrippedLineItems`、`parseReceiptTaxBreakdownToKindAmounts`、`aggregateTaxBreakdownTotalsByCode`）；已改 `gemini.ts`、`types/index.ts`、`receipt-helpers.ts`、`database.ts`、`receipt-item-tax.ts`。  
- **验证**：识别含多税种行的小票 → DB `tax_breakdown` 为数组或兼容旧扁平；`getReceiptById` / 列表接口返回 `taxBreakdown`；客户端可对 `getAllReceipts()` 结果调用 `aggregateTaxBreakdownTotalsByCode` 做汇总。  
- **残留**：UI 详情/报表尚未强制展示 breakdown（仅数据层就绪）；税种 `code` 依赖模型或启发式，陌生税种可能落入 `OTHER`。

**关联**  
- `vouchap-app/src/shared-logic/receipt-tax-breakdown.ts`、`gemini.ts`、`database.ts`、`receipt-helpers.ts`、`receipt-item-tax.ts`、`types/index.ts`

---

### 2026-05-09（Vouchap：远程库缺 receipts.tax_breakdown — 幂等补迁移）

**User（提示词/原意）**  
- `supabase db push` 显示 Remote database is up to date，但在数据库里看不到 `tax_breakdown` 列。

**Assistant（实现前说明）**  
- 列原定于 `20260411140000_tax_pos_rule_included_tax_kinds.sql` 末尾 `ADD COLUMN IF NOT EXISTS`；若迁移历史与真实库结构不一致（已记录为 applied 但未执行到该语句、或事后手工/还原导致列缺失），`db push` 不会再重跑旧文件。  
- 计划：新增仅含 `ALTER TABLE ... ADD COLUMN IF NOT EXISTS tax_breakdown` + `COMMENT` 的迁移，保证下一次 `db push` 必补齐列且对已存在环境无破坏。

**Assistant（实现后说明 / 本轮结论）**  
- 已添加 `vouchap-app/supabase/migrations/20260509140000_receipts_tax_breakdown_ensure.sql`。  
- **验证**：执行 `supabase db push` 后，在 SQL Editor 运行  
  `select column_name, data_type from information_schema.columns where table_schema='public' and table_name='receipts' and column_name='tax_breakdown';`  
  应返回一行 `jsonb`。  
- **注意**：确认 CLI `project ref` 与 Dashboard 查看的是同一项目。

---

### 2026-05-10（Vouchap：税种注册表 + tax_breakdown 支持 tax_kind_id；清理 legacy supplier/customer 外键列）

**User（提示词/原意）**  
- item 拆税已清理及部分取消功能（如客户供应商合并路径）导致表上冗余字段，要求 SQL 清理库表。  
- 税种需继续维护数据；票面同名不同类（如不同省 PST）应区分；`tax_breakdown` 应能记录**税种 id**，而非仅票面码。

**Assistant（实现前说明）**  
- **不删除** `entities`/`accounts` 的 `merged_into_id`（应用仍在用合并链解析）。  
- 对 pre-`entities` 时代的 `receipts.supplier_id`、`supplier_customer_id`、`invoices.customer_id` 等列：代码侧已无引用，可用 `DROP COLUMN IF EXISTS`（表存在时）清理。  
- 新增 **`crm.tax_kind_registry`**：自然键 `(country_code, region_code, tax_class_code, tax_kind_code)` 唯一一行一 id，与 `crm.tax_rate_standard` 种子一致；`tax_rate_standard` 增加 **`tax_kind_registry_id`** 并回填。  
- **`receipts.tax_breakdown`** 仍为 jsonb，注释约定数组元素可含 `tax_kind_id`、`crm_tax_rate_standard_id`；应用层类型与 `coerce` 已扩展。  
- 提供 **`crm.resolve_tax_kind_registry_id(...)`** 供客户端/RPC 解析 id。

**Assistant（实现后说明 / 本轮结论）**  
- 已添加迁移 `vouchap-app/supabase/migrations/20260510120000_tax_kind_registry_legacy_fk_cleanup.sql`。  
- 已更新 `types/index.ts`（`ReceiptTaxBreakdownEntry`）、`receipt-tax-breakdown.ts`（透传 id、**`aggregateTaxBreakdownTotalsByTaxKindId`**）。  
- **验证**：`supabase db push` 后检查 `crm.tax_kind_registry` 行数、`tax_rate_standard.tax_kind_registry_id` 非空比例；确认 legacy 列已删除。  
- **残留**：识别流水线尚未自动写入 `tax_kind_id`（需保存前用辖区 + `code` 调 `resolve` 或查表）；模型无法直接产出 registry uuid。

---

### 2026-05-10（Vouchap：移除 receipts.tax_jurisdiction_country / region）

**User（提示词/原意）**  
- `receipts.tax_jurisdiction_country` 等列无实际用处，是错误 item 拆税方案遗留，应去掉。

**Assistant（实现前说明）**  
- 行税引擎 **`applyReceiptItemTaxesAndReconcile`** 已能从 **币种默认值 + entity/processed_by 文本信号** 推断辖区，不依赖库列；列仅作历史持久化。  
- 计划：`DROP` 两列；从 **`Receipt` / `GeminiReceiptResult`**、`saveReceipt`/`updateReceipt`/列表与详情映射、**`receipt-helpers`**、**`gemini`** 归一化、**`receipt-item-tax`** 的 select/update 中移除；**`tax_breakdown` coerce** 与税行剥离改用 `region = null`（MB PST→RST 等可在 reconcile 阶段由推断的 `region` 处理 parse）。

**Assistant（实现后说明 / 本轮结论）**  
- 已添加 `vouchap-app/supabase/migrations/20260510150000_drop_receipts_tax_jurisdiction.sql`；已改 `database.ts`、`types/index.ts`、`receipt-helpers.ts`、`gemini.ts`、`receipt-item-tax.ts`。  
- **验证**：`db push` 后保存/重算小票，**`receipt_item_taxes`** 仍应生成；非 USD/CAD 且无推断国别时行为与此前「空辖区」一致。

---

### 2026-05-10（Vouchap：receipts 行税/对账列删除后与 database 映射对齐；确认 receipt 级税额模型）

**User（提示词/原意）**  
- `supplier_name`、`tax_reconciliation_status`、`tax_items_sum`、`tax_variance_amount`、`tax_audit_required`、`tax_audit_comment`、`merchant_entity_id` 等应无用，需核查清理。  
- 确认：**receipt 级**税额识别与库逻辑——可拆分税种并分类统计（加拿大联邦税、曼省/萨省省税、美国州税等），**不需**拆到 item。

**Assistant（实现前说明）**  
- 迁移 `20260510160000_drop_receipts_line_tax_reconcile_columns.sql` 已 DROP 上述列；`Receipt` 类型与 `saveReceipt`/`updateReceipt` 部分已删字段，但 **`getAllReceiptsForList` / `getAllReceipts` / `getReceiptById`** 仍向返回对象写入已删属性，会与 PostgREST 选列及 TS 不一致。  
- 计划：从上述三处映射中移除对账/审计相关字段；**`receipt-tax-queue-worker` 文件头**注明 worker 现为排空队列、业务 reconciler 已 no-op。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-app/src/shared-logic/database.ts`（三处 `Receipt` 映射不再含对账列）；已改 `vouchap-app/scripts/receipt-tax-queue-worker.ts` 注释。  
- **产品/数据逻辑（确认）**：税额以 **`receipts.tax`（合计）+ `receipts.tax_breakdown`（jsonb，可多行：票面 code / 可选 `tax_kind_id` 等）** 为主；统计用 **`receipt-tax-breakdown.ts`** 的按 code / `tax_kind_id` 聚合；**不**依赖行级 `receipt_item_taxes` 计算或展示（`receipt-item-tax` 已为 stub）。  
- **验证**：`supabase db push` 应用 `20260510160000_...` 后，列表/详情拉取小票无「列不存在」错误；`npx tsc --noEmit` 下 `src/shared-logic/database.ts` 无报错。  
- **补充**：同文件内 entity/account merge 解析对嵌套 `entities`/`accounts` 的 id 读取兼容对象与数组形态；`account` 映射同时接受 join 行 snake 与 `getAccountById` camel 字段。

---

### 2026-05-10（Vouchap：移除 receipt 税异步队列与 worker）

**User（提示词/原意）**  
- 提示词已整合为单次提交，不需要异步队列；继续清理。

**Assistant（实现前说明）**  
- **`receipt_tax_recalc_queue`** + **`enqueue_receipt_tax_reconcile`** 仅服务已废弃的行税 worker；应用侧已无可靠业务依赖。  
- 计划：新增迁移 `DROP FUNCTION` + `DROP TABLE`；删除 **`scripts/receipt-tax-queue-worker.ts`**、**`receipt-tax-queue-client.ts`**、**`receipt-item-tax.ts`**（已无其他引用）；从 **`package.json`** 去掉 `receipt-tax-worker` 脚本。

**Assistant（实现后说明 / 本轮结论）**  
- 已添加 `vouchap-app/supabase/migrations/20260510170000_drop_receipt_tax_recalc_queue.sql`。  
- 已删除上述 TS 文件与 npm 脚本。  
- **验证**：`supabase db push` 后 `\df enqueue_receipt_tax_reconcile` 无结果、表不存在；客户端不再调用该 RPC；若运维仍跑旧 worker 进程可停用。  
- **文档**：`docs/RECEIPT-TAX-ASYNC-PIPELINE.md` 顶部已标注废弃并指向上述迁移。

---

### 2026-05-10（Vouchap：拍小票 tax_breakdown 为空 — 识别返回漏传 + 归一化增强）

**User（提示词/原意）**  
- 库迁移已执行；dev 拍小票识别结果里 **`tax_breakdown` 为空**（例：Canadian Tire 票面 GST + RST 应写入分项）。

**Assistant（实现前说明）**  
- `normalizeParsedReceiptTaxFields` 已写入 `parsed.taxBreakdown`，但 **`recognizeReceipt`（图片）与 `recognizeReceiptFromDocument` 的 return 对象未包含 `taxBreakdown`**，下游 `convertGeminiResultToReceipt` 始终得到 `undefined`，入库即为 `null`。  
- 计划：返回对象增加 **`taxBreakdown: taxBreakdownForReceiptResult(...)`**；归一化前合并模型可能返回的 **`tax_breakdown`**；提示词规则 (7) 明确多税种 **MUST** `taxBreakdown`；**`parseAmount`** strip **`$`/空白** 以免金额解析失败。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-app/src/shared-logic/gemini.ts`、`receipt-tax-breakdown.ts`；`prAny`  cast 改为 `unknown` 中间层以过 `tsc`。  
- **验证**：dev 重拍含 GST+RST 小票 → 保存后 DB **`receipts.tax_breakdown`** 为两元素数组（或至少非空，取决于模型输出）；**`npx tsc --noEmit`** 下相关文件无新增报错。

---

### 2026-05-10（Vouchap：tax_breakdown 匹配税种注册表 id；落库不写税率文案）

**User（提示词/原意）**  
- 已有 `tax_breakdown` 但未写入税种 id，只有票面信息；正确逻辑应 **匹配税种** 并记录 **税种 id + 税额**；税率在税种/标准税率表中，不必在小票 json 里记。

**Assistant（实现前说明）**  
- 库侧已有 **`crm.tax_kind_registry`** 与 **`crm.resolve_tax_kind_registry_id(country, region, class, kind)`**。  
- 计划：新增 **`receipt-tax-kind-resolve.ts`**（币种推断国别、地址/城市/省名推断 region、MB 票面 PST→RST 与 US 合并税→`COMBINED_SALES_TAX`），对每行 RPC 解析 id；**`shapeTaxBreakdownForDb`** 仅保留 `tax_kind_id`、`code`、`label`、`amount`、`source`，去掉 **`rateLabel` / `crm_tax_rate_standard_id`**；在 **`saveReceipt` / `updateReceipt`** 写入前调用（并 best-effort 拉 **`entities.address`** 辅助辖区）。

**Assistant（实现后说明 / 本轮结论）**  
- 已添加 `vouchap-app/src/shared-logic/receipt-tax-kind-resolve.ts`；已改 `database.ts`、`types` 注释。  
- **验证**：CAD + 地址含 Winnipeg/MB 等时，GST/RST 两行应带不同 **`tax_kind_id`**；Dashboard 须暴露 **`crm` schema**（已有 `config.toml` / 托管 API settings）。若辖区推断失败，该行可无 id（仅票面字段）。

---

### 2026-05-09（Vouchap：票面税率作税种特征；币种仅「票面可见」才参与辖区特征）

**User（提示词/原意）**  
- 票面的**税率信息**也可作为匹配税种的特征。  
- **币种**：若票面有直接币种信息则可用；若仅为**推断**出来的币种，则**不宜**作为特征信息（尤其不宜单靠推断币种定辖区）。

**Assistant（实现前说明）**  
- 无新增代码需求：与既有设计对齐核对——`currencyPrintedOnReceipt === true` 时才用币种辅助国别（CAD/USD→CA/US）；否则国别依赖地址等文本推断。税率侧已有 `parsePrintedTaxRateFraction` + `crm.tax_rate_standard`（含 receipt 日期落在 effective 区间）解析 `tax_kind_registry_id`。

**Assistant（实现后说明 / 本轮结论）**  
- **结论**：上述规则已在 `receipt-tax-kind-resolve.ts`、`gemini.ts`（`currencyPrintedOnReceipt` 与抽取规则）、`convertGeminiResultToReceipt` / `saveReceipt` 传参中落实；`lib/` 与 `src/shared-logic` 对应文件已一致。  
- **验证**：票面含 `5%`/`HST` 等且标准表有匹配行时应落到正确 `tax_kind_id`；推断币种（`currencyPrintedOnReceipt: false`）不应触发「仅因币种」的 CA/US 捷径。  
- **残留**：模型若漏标 `currencyPrintedOnReceipt`，默认 false，国别更依赖 `supplierInfo.address`。

**关联**  
- `vouchap-app/src/shared-logic/receipt-tax-kind-resolve.ts`、`gemini.ts`、`receipt-helpers.ts`、`database.ts`

---

### 2026-05-09（Vouchap：tax_breakdown 有 GST/RST 但未写入 tax_kind_id）

**User（提示词/原意）**  
- 入库的 `tax_breakdown` 仍为票面字段（如 `code`/`label`/`rateLabel`/`amount`），**没有**与税种表关联的 `tax_kind_id`。

**Assistant（实现前说明）**  
- `resolveTaxBreakdownTaxKindIds` 在 **`resolveCountry` 为 null** 时整段提前返回（无地址且 `currencyPrintedOnReceipt` 为 false 时不使用币种 → 常见 dev 场景）；另 **RST** 在 CRM 仅种子 **MB**，原逻辑在 **region 为空** 时从未对 RST 调用解析（与 GST 不同，GST 有 `CA`+空 `region` 回退）。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `receipt-tax-kind-resolve.ts`：**地址/票面币种路径之后**，若票面 `code` 为 **GST/HST/PST/RST/QST** 之一则推断 **CA**（不依赖推断币种）；**CA + RST 且仍无省** 时默认 **MB** 再查 `tax_rate_standard` / RPC。  
- **验证**：无商户地址、CAD 仅推断、`currencyPrintedOnReceipt: false` 时，GST 5% + RST 7% 两行仍应写入 **`tax_kind_id`**；已存小票可 **编辑后保存** 触发 `updateReceipt` 重算。  
- **说明**：`shapeTaxBreakdownForDb` 有意不写 `rateLabel`；若 DB 中仍见 `rateLabel`，多为历史 JSON 或他路径写入；客户端 `coerceReceiptTaxBreakdownEntries` 读库时会原样带上已有键。

**关联**  
- `vouchap-app/src/shared-logic/receipt-tax-kind-resolve.ts`（`lib/` 同路径已同步）

---

### 2026-05-09（Vouchap：配额应按当前 space — 刷新用户缓存 + 配额用 active space）

**User（提示词/原意）**  
- 限额以 space 为单位；切换 space 应使用**另一套**限额；认为是严重 bug。

**Assistant（实现前说明）**  
- `get_current_user` 缓存可导致 **`saveReceipt` 仍写入旧 `users.current_space_id` 对应 space**。  
- `processReceiptInBackground` 曾用 **`getReceiptById` 行的 `space_id`** 调 `assertClientRecognitionAllowed`，未对齐用户刚切换的当前工作区。  
- CRM RPC 本身是 **`p_space_id` 维度**；偏差来自**前端选用的 space_id**。

**Assistant（实现后说明 / 本轮结论）**  
- **`saveReceipt`**：`getCurrentUser(true)`，插入 `space_id` 与 DB 当前工作区一致。  
- **`processReceiptInBackground`**：`getCurrentUser(true)` → **`activeSpaceId`**；**配额门闸与 `record_clientRecognitionSuccessIfEnforced` 均用 `activeSpaceId`**；转换后 **`receipt.spaceId` 对齐 `activeSpaceId`**；与行不一致时 **`console.warn`**。  
- **`convertGeminiResultToReceipt`**：`getCurrentUser(true)`。  
- **`reprocess-voucher-recognition`**（支出/收入）、**`inbound-processor` / `outbound-processor`**：配额与记账使用 **`getCurrentUser(true)` 的 active space**（上传路径 fallback 行上 space）。  
- **验证**：切换 space → 新拍小票应记入新 space 并走该 space 的 `get_client_recognition_quota`。

---

### 2026-05-09（Vouchap：账户识别限额 — 明确 UI 提示；与 Gemini API 区分）

**User（提示词/原意）**  
- 不是模型 API 限额；若是当前账户限额，应有**更明确的提示**。

**Assistant（实现前说明）**  
- 配额拦截时此前仅 `needs_retake`，与识别失败无区分。  
- 新增 **`receipts.recognition_notice`**（英文说明），写入「工作区/套餐/credits」限制，并明示**非 Google Gemini API 控制台用量**；识别成功或重新跑通后清空。

**Assistant（实现后说明 / 本轮结论）**  
- 迁移 **`20260511120000_receipts_recognition_notice.sql`**；**`Receipt.recognitionNotice`**；**`updateReceipt` / 列表与详情映射**。  
- **`formatRecognitionQuotaBlockedNotice`**（`client-recognition-quota.ts`）；**`receipt-processor`** / **`reprocess-voucher-recognition`** 在配额或识别失败时写入 notice；成功路径 **`recognitionNotice: null`**。  
- **`receipt-details/[id].tsx`**：`needs_retake` 且有条目时顶部 **黄色横幅**（标题 *Recognition unavailable* + 分段正文，产品文案英文）。  
- **验证**：`supabase db push` 后超限拍照 → 详情页见横幅；加 credits 后成功识别 → notice 清除。

---

### 2026-05-09（Vouchap：终端确认 — 识别被配额拦截而非未提交模型）

**User（提示词/原意）**  
- 附上 Metro 日志：`Recognition blocked by quota/billing (model NOT invoked)` + included recognitions used up。

**Assistant（实现前说明）**  
- 无代码变更；将日志与 `assertClientRecognitionAllowed` / `get_client_recognition_quota` 行为对齐说明。

**Assistant（实现后说明 / 本轮结论）**  
- **结论**：**未调用模型**是因为 **client 空间月度包含次数已用尽且 credits 余额不足**，与 Gemini 提交链路无关；Google 控制台无 input 属预期。  
- **处理**：CRM/计费侧为该 `space_id` **增加 recognition credits** 或等待次月；dev 自测需在 DB 调整额度，而非排查 proxy。

---

### 2026-05-09（Vouchap：大模型侧无 input — 非 2xx 时 `data` 为 null，未解析 Response JSON）

**User（提示词/原意）**  
- 大模型控制台无 **input** 记录；判断识别失败是因为**未成功提交到模型**。

**Assistant（实现前说明）**  
- `@supabase/functions-js`：HTTP **非 2xx** 时返回 **`data: null`**，仅 **`FunctionsHttpError`**；Edge 返回体常为 **`{ success:false, error:"..." }`**（如未配置 `GEMINI_API_KEY`）。此前若在 **`data`** 上读 `error`，永远为空；用户侧只见泛化失败，**Google 侧不会出现调用记录**。  
- **DEV**：在调用 Edge 前打一条 **`invoke generateContent`** 日志（含 inline base64 长度），便于确认客户端是否发出请求。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 **`gemini-server-sdk.ts`**：`readEdgeFunctionJsonError` 从 **`FunctionsHttpError.context`（Response）** `clone().json()` 读取 **`error`**；合并进抛出文案；**`generateContent` invoke 增加 `timeout: 180_000`**；**DEV** 打印 `inlineImageBase64Chars`。  
- 已改 **`gemini-proxy/index.ts`**：在调用 **`generateContent(contents)`** 前 **`console.info`**（便于 Supabase Functions 日志对照 Google Cloud）。需 **`supabase functions deploy gemini-proxy`** 后方生效。  
- **结论**：无 input 多见于请求未到 Gemini（鉴权 401、缺密钥 503、配额闸拦截等）；修复后 Metro / 抛错应能看到 **服务端返回的具体 `error` 字符串**。

**关联**  
- `vouchap-app/src/shared-logic/gemini-server-sdk.ts`、`vouchap-app/supabase/functions/gemini-proxy/index.ts`

---

### 2026-05-09（Vouchap：识别一直 needs_retake — gemini-proxy 错误信息丢失 + 日志）

**User（提示词/原意）**  
- 识别一直失败，多次拍摄均为 needs_retake，怀疑**没有提交到模型**。

**Assistant（实现前说明）**  
- `needs_retake` 常见来源：`assertClientRecognitionAllowed` **拦截（根本不会调模型）**；或 `recognizeReceipt` → `supabase.functions.invoke('gemini-proxy')` 失败。  
- `@supabase/supabase-js` 在 Edge 返回非 2xx 时可能仍把 `{ success:false, error }` 放在 **`data`**；原 `gemini-server-sdk` **先抛 `error.message`**，丢失服务端文案（如 `GEMINI_API_KEY is missing on server.`），Metro 只见泛化失败。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `gemini-server-sdk.ts`：**优先使用响应 JSON 的 `error`**，再回退 `invoke` 的 `error.message`。  
- 已改 `receipt-processor.ts`：**quota 拦截**与 **recognize 失败** 使用 `console.error` 并写明是否「未调模型」。  
- **自查**：Supabase Edge `gemini-proxy` 是否部署、`GEMINI_API_KEY` 是否配置；客户端空间是否 **recognition 配额用尽**（拦截时不调模型）；若设 `GEMINI_PROXY_ALLOWED_ORIGINS`，确认 Web/模拟器 Origin 未被拒。

**关联**  
- `vouchap-app/src/shared-logic/gemini-server-sdk.ts`、`receipt-processor.ts`

---

### 2026-05-09（Vouchap：重拍小票后 tax_breakdown 仍无 tax_kind_id；是否需重启 dev）

**User（提示词/原意）**  
- 重拍后 JSON 仍如票面（含 `rateLabel` 等），问是否 dev 需重启才生效。

**Assistant（实现前说明）**  
- 核对 `tsconfig`：`@/lib/*` → **`src/shared-logic/*`**，运行时**不**走仓库根目录 `lib/`；Expo 一般 **Reload** 即可，非必须重启整机。  
- 若仍无 `tax_kind_id`：更常见为 **远端 PostgREST 未暴露 `crm` schema** 或 **CRM 迁移未执行**，导致 `tax_rate_standard` / `resolve_tax_kind_registry_id` 失败（原有 `console.warn` 易被忽略）。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 `receipt-tax-kind-resolve.ts` 增加 **`__DEV__`** 下、当国别已为 CA 但仍有 GST/HST/PST/RST/QST 行缺 id 时的 **`console.warn`**，提示检查 **Exposed schemas** 与迁移。  
- **说明**：`shapeTaxBreakdownForDb` 写入的 json **不应**含 `rateLabel`；若所见仍带 `rateLabel`，需确认数据源是否为 **Table Editor 的 `tax_breakdown` 列** 或仍为识别结果/缓存。

**关联**  
- `vouchap-app/tsconfig.json`、`vouchap-app/src/shared-logic/receipt-tax-kind-resolve.ts`、`supabase/config.toml`（`api.schemas` 含 `crm`；托管项目需在 Dashboard 同步）

---

### 2026-05-09（Credit 口径与订阅 / Credit 拦截 UI — 续完）

**User（提示词/原意）**  
- 按计划完成：Firm 消耗按关联 `public.projects` 成功计数、create/confirm 双预检；`get_space_entitlements` 与类型对齐；登录后订阅到期全屏拦截；Client/Firm 各入口预检与英文 UI；`crm-order-design.md` 与 PRD-SOURCE-LOG。

**Assistant（实现前说明）**  
- 迁移 `20260513100000_firm_engagement_consumption_by_project.sql` 已在先前回合落地；本回合补：`space-entitlements.ts` 的 `included_remaining` / `pending_onboarding`；`recognition-preflight-ui` 的 Web 双步 confirm + 可选 Switch space；首页 `fetchSpaceEntitlements` 订阅门（Firm 无在服订阅拦；Client 无订阅且 included 与 credits 皆无时拦）；receipts/invoices/inbound/outbound/chat-to-log 与 firm create/confirm、tax-filing 各路径接线。

**Assistant（实现后说明 / 本轮结论）**  
- 已更新 `vouchap-app/src/shared-logic/space-entitlements.ts`、`recognition-preflight-ui.ts`；`index.tsx` 订阅 Modal + Client 识别预检；`receipts.tsx`、`invoices.tsx`、`inbound.tsx`、`outbound.tsx`、`chat-to-log.tsx`；`firm/engagements.tsx`、`firm/client/[clientSpaceId].tsx`、`firm/engagement/[id].tsx`；`tax-filing/index.tsx`、`tax-filing/order/[orderId]/index.tsx`、`tax-filing/order/[orderId]/info.tsx`、`tax-filing/project/[projectId]/index.tsx`；`vouchap-crm/sql/crm-order-design.md` §2.3 / §7。  
- **验证建议**：`supabase db push` 应用 `20260513100000_*` 后，在 Client 无订阅无 credit 时首页应出现订阅 Modal；有 credit 无订阅应可进首页但 snap 走预检；Firm 满额时 create 与 confirm 均弹英文说明；`get_space_entitlements` JSON 含 `included_remaining` 与 `pending_onboarding`。  
- **残留**：未在本环境跑全量 `tsc`；`firm_create_pending_order_for_invitee` 若未在 DB 侧调用 assert，仅依赖 App 预检与后续 confirm RPC。

**关联**  
- `vouchap-app/supabase/migrations/20260513100000_firm_engagement_consumption_by_project.sql`、`vouchap-app/src/shared-logic/firm.ts`、`firm-engagement-preflight-ui.ts`

### 2026-05-09（识别配额：入口与后台一致 + RPC 数字解析）

**User（提示词/原意）**  
- dev 仍见 `receipt-processor` quota 拦截日志；期望 credit 不足在入口拦、credit 够应正常识别。

**Assistant（实现前说明）**  
- 预检仅在开相机/选图前执行，与 `processReceiptInBackground` 之间存在时间差；`get_client_recognition_quota` 若将数字以字符串返回，原 `parseQuotaPayload` 会把 `credits_balance` 置 0 导致误判。后台应优先用凭证 `space_id` 计配额。

**Assistant（实现后说明 / 本轮结论）**  
- `client-recognition-quota.ts`：`included_per_month` / `used_this_month` / `credits_balance` / `monthly_cap` 用安全数值解析。  
- `receipt-processor`：配额用 `receipt.space_id` 回退 `activeSpaceId`；拦截日志改为 `console.warn`；入账与 `receipt.spaceId` 对齐 `quotaSpaceId`。  
- `receipts.tsx`：`processCapturedImage` 在实际上传前再次 `runClientRecognitionPreflight`；扫描失败转相册的 `confirmThen` 改为 `() => void pickImage()`。  
- `index.tsx`：`processCapturedImages` 每图在 client 下上传前再次 `preflightRecognitionOrAlert`。  
- `inbound-processor` / `outbound-processor` / `reprocess-voucher-recognition`：配额与 `record_client_recognition_success` 空间与凭证 `spaceId` 对齐。

**关联**  
- `receipt-processor.ts`、`client-recognition-quota.ts`、`receipts.tsx`、`index.tsx`

### 2026-05-09（vouchap-CRM：手动订单 + 权益查阅 + 订单编辑；DB 放宽 get_space_entitlements）

**User（提示词/原意）**  
- 在 vouchap-CRM 同步开发：手动为客户配置订单、查阅权益等能力（续作落地）。

**Assistant（实现前说明）**  
- 问题：`crm.get_space_entitlements` 仅允许 `public.user_spaces` 成员，运营账号通常不在客户空间内 → RPC 返回 FORBIDDEN；`crm-grant-orders-assignments.sql` 仅有 `SELECT, INSERT` on `space_orders`，无法 `UPDATE`。  
- 计划：在 **`20260513100000` 之后**追加迁移，完整 `CREATE OR REPLACE` `get_space_entitlements`，鉴权改为「空间成员 **或** `crm.ops_users`」且先校验 `spaces` 存在；`GRANT UPDATE ON crm.space_orders TO authenticated`；同步 **`vouchap-crm/sql/crm-grant-orders-assignments.sql`**（若尚未含 UPDATE）。  
- CRM：`SpaceOrders.tsx` 拉取 `metadata`；列展示摘要；行操作「权益」→ `supabase.schema('crm').rpc('get_space_entitlements')` 弹窗 JSON；「编辑」→ 更新 `status` / `expires_at` / `metadata`；新建订单失败展示 `error.message`。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 [`vouchap-app/supabase/migrations/20260513110000_get_space_entitlements_allow_crm_ops.sql`](vouchap-app/supabase/migrations/20260513110000_get_space_entitlements_allow_crm_ops.sql)（**必须**排在 `20260513100000_*` 之后，否则会再次被旧定义覆盖）。  
- `vouchap-crm/sql/crm-grant-orders-assignments.sql`：已为 `space_orders` 增加 **`UPDATE`** 授权说明与语句。  
- `vouchap-crm/src/pages/SpaceOrders.tsx`：权益弹窗、编辑弹窗、metadata 列、`createError`。  
- **验证**：`supabase db push`（或等价）应用 `20260513110000_*`；在 Supabase SQL 中以运营 JWT 上下文调用 `get_space_entitlements(客户 space_id)` 应 `ok: true`；CRM 订单页「权益」「编辑」可用；未跑通远端 DB 时以本地/托管迁移为准。  
- **残留**：编辑订单未改 `sku_id` / `space_id`（有意收窄范围）；`get_space_entitlements` 与 `20260513100000` 体量大段重复，后续可考虑抽私有子函数减漂移。

**关联**  
- `vouchap-crm/src/pages/SpaceOrders.tsx`、`vouchap-crm/sql/crm-grant-orders-assignments.sql`、`vouchap-app/supabase/migrations/20260513110000_get_space_entitlements_allow_crm_ops.sql`

### 2026-05-13（Vouchap：权益/识别拦截统一走 ConfirmModalHost，移除系统 Alert）

**User（提示词/原意）**  
- 权益拦截的样式一律用应用内规范浮窗组件，不用系统 `alert`。

**Assistant（实现前说明）**  
- 既有 `ConfirmModalHost` + `confirmDialog`（`showChoiceDialog` / `showConfirmDialog` / `showAlertDialog`）为统一浮窗来源；`recognition-preflight-ui` / `firm-engagement-preflight-ui` 仍用 `Alert.alert` 与 `window.confirm`。  
- TaxFiling 重试识别配额分支仍用 `window.alert` / `Alert`；订单页附件跟进失败同理。

**Assistant（实现后说明 / 本轮结论）**  
- `recognition-preflight-ui.ts`：`alertClientRecognitionQuotaBlocked` 改为 `showChoiceDialog`（Close / Switch space / Subscription and billing）。  
- `firm-engagement-preflight-ui.ts`：`engagementBlockAlert` 改为 `showConfirmDialog`（Close + Subscription and billing）。  
- `TaxFilingTodosView.tsx`：配额不通过时调用 `alertClientRecognitionQuotaBlocked` + `expo-router` 的 `router`；`processTaxFilingAttachmentAfterCreate` 失败用 `showAlertDialog`。  
- `tax-filing/order/[orderId]/index.tsx`：同上跟进失败用 `showAlertDialog`。  
- **验证**：登录后触发 Client 识别拦截、Firm engagement 拦截、税季 Todo 重试识别无配额，应出现与「合并确认」等一致的居中浮窗，且无浏览器原生 `confirm`/`alert`；需已挂载 `ConfirmModalHost`（`_layout` 已有）。

**关联**  
- `recognition-preflight-ui.ts`、`firm-engagement-preflight-ui.ts`、`TaxFilingTodosView.tsx`、`tax-filing/order/[orderId]/index.tsx`、`confirmDialog.ts`

### 2026-05-09（Vouchap：`ReceiptDetailsScreen` 修复 Hooks 顺序 — `useMemo` 不得在 early return 之后）

**User（提示词/原意）**  
- Expo 终端报：`ReceiptDetailsScreen` 中 Hooks 顺序变化 / `Rendered more hooks than during the previous render`，指向 `receipt-details/[id].tsx` 约 949 行 `useMemo`。

**Assistant（实现前说明）**  
- `recognitionNoticeParagraphs` 的 `useMemo` 写在 `if (loading && !receipt)` / `if (!receipt)` 等 **early return** 之后；首屏骨架 return 时少执行一个 hook，数据就绪后多执行 → 违反 Rules of Hooks。

**Assistant（实现后说明 / 本轮结论）**  
- 将该 `useMemo` 上移到与 `categoriesSorted` / `attributionsSorted` 同级（任意 early return 之前）；数据源与下方 `currentReceipt` 一致：`editing ? (editedReceipt ?? receipt) : receipt`；依赖 `[editing, receipt, editedReceipt]`。  
- **验证**：从加载骨架进入详情页不应再出现 Hooks 报错；`read_lints` 通过。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-details/[id].tsx`

### 2026-05-09（Vouchap：新建 space 避免重复 CRM 试用订单 — 客户端串行 + 触发器幂等）

**User（提示词/原意）**  
- 创建新 space 会生成两条相同订单，应只一条。

**Assistant（实现前说明）**  
- 试用单由 `public.spaces` 的 `AFTER INSERT` 触发器 `crm.on_space_created` 插入 `crm.space_orders`（`source=registration`）；重复多见于 **并发/双次 `createSpace`**（双连点等）产生两个 space 各一单，或极端情况下同一 space 路径被插入两次。  
- 计划：`auth.createSpace` 增加模块级 `createSpaceInFlight` + `finally` 释放，重叠调用直接返回英文错误；新迁移重写 `crm.on_space_created`，在插入前 `NOT EXISTS` 同 space 已存在的 active `registration` + `space_subscription` 试用行。

**Assistant（实现后说明 / 本轮结论）**  
- `vouchap-app/src/shared-logic/auth.ts`：`createSpaceInFlight` 守卫。  
- `vouchap-app/supabase/migrations/20260515100000_on_space_created_idempotent_trial_order.sql`：触发器幂等。  
- **验证**：快速连点「创建空间」第二次应提示 *already being created* 且不新建 space；对已存在重复单的库，新 space 不应再叠第三条；需 `supabase db push`（或等价）应用迁移。  
- **残留**：若历史数据已有同一 space 两条 registration 试用，本迁移不自动删重复，可运维 SQL 手工合并/取消一条。

**关联**  
- `auth.ts`、`20260515100000_on_space_created_idempotent_trial_order.sql`

### 2026-05-09（Vouchap：CRM 清理冗余 SKU / sku_addon — 迁移 + 设计文档白名单）

**User（提示词/原意）**  
- CRM 上版本规格 SKU 有冗余，清理之前无用的 SKU 配置。

**Assistant（实现前说明）**  
- 现行产品以 `20260512100000_*` 与 `space-orders-sku-helpers.ts` 为准：在服试用/月订/年订 + 两类 credit 包 + 两条目录策略行；历史 `VCH_*`、`CLIENT_SUB` 及旧 `sku_addon`（ENG_PACK_* 等）易残留。  
- 计划：新迁移删除指向遗留 SKU 的 `space_orders`、删除遗留 `sku_edition`、删除不在白名单且无订单引用的孤立 `sku_edition`、将 `sku_addon` 收敛为两条参考包；在 `vouchap-crm/sql/crm-order-design.md` 增加白名单表便于运营对照。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `vouchap-app/supabase/migrations/20260515110000_crm_prune_legacy_sku_catalog.sql`。  
- 更新 `vouchap-crm/sql/crm-order-design.md` §2.0。  
- **验证**：`supabase db push` 后 CRM「版本 sku_edition」列表应仅剩白名单内行（及有订单引用的自定义行）；无订单的实验 SKU 会被删。  
- **残留**：自定义 SKU 若从未下单且不在白名单会被删；需保留时应先建一单或扩展迁移白名单。

**关联**  
- `20260515110000_crm_prune_legacy_sku_catalog.sql`、`vouchap-crm/sql/crm-order-design.md`

### 2026-05-09（Vouchap：应用版本 2.6.2 / Build 52 + EAS production 全平台构建）

**User（提示词/原意）**  
- App 版本号更新为 2.6.2，构建全平台 production。

**Assistant（实现前说明）**  
- 按 `.cursorrules` 同步 `package.json`、`package-lock.json`（根与 `packages.""`）、`app.json`、`app.config.js`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`；并修正 `ios/.../project.pbxproj` 内仍停留在 2.6.0/50 的 `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION`。构建号由 51 → 52。  
- 提交信息：`发布版本号 2.6.2 (Build 52)`；`git push` 后执行 `npx eas-cli build --platform all --profile production --non-interactive`。

**Assistant（实现后说明 / 本轮结论）**  
- 已提交并推送：`a77d3c4`（分支 `AI-Tax-filing`）。  
- EAS：`eas.json` 为 `appVersionSource: remote` + `autoIncrement`；本次 Android **remote** 自 52 递增至 **53**；iOS **remote** 自 36 递增至 **37**（与仓库内 plist 52 可能不一致，以 Expo 控制台为准）。  
- 构建链接：Android `https://expo.dev/accounts/aimlink/projects/vouchap/builds/87ba91c9-8703-44c7-ba7a-531ce327755b`；iOS `https://expo.dev/accounts/aimlink/projects/vouchap/builds/f7a50539-c080-4e55-80d4-e8a1c224ff27`。CLI 在「等待构建完成」阶段可 Ctrl+C 退出，不影响云端排队。  
- **Web**：未跑 `expo export`/Pages；若需生产 Web，在 `vouchap-app` 执行 `npm run deploy:web`（或等价流水线），版本来自 `package.json` 2.6.2。

**关联**  
- `vouchap-app/package.json`、`app.json`、`app.config.js`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`、`ios/Vouchap.xcodeproj/project.pbxproj`

### 2026-05-14（Vouchap：logo2 更新后同步 iOS/Android 启动器图标与脚本）

**User（提示词/原意）**  
- 更新过应用 logo 文件 logo2.png，对应更换素材。

**Assistant（实现前说明）**  
- `app.config.js` 的 `expo.icon` / `adaptiveIcon` 指向 `./assets/logo2.png`（链到 `src/mobile-ui/assets`）；裸工程 **App Store / 桌面图标** 实际以 `ios/.../AppIcon.appiconset` 与 `android/.../mipmap-*` 的 webp 为准，仅改图不会自动进原生包。  
- 仓库根 `assets/logo2.png` 已较新，需拷入 `vouchap-app` 并自源图重生成 1024 App Icon 与各 density 的 `ic_launcher*`。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `vouchap-app/scripts/sync-native-launcher-icons-from-logo2.sh`（ImageMagick），`package.json` 脚本 `icons:sync-from-logo2`；更新 `assets/README.md`、`app.config.js` 注释。  
- 已执行：根 `logo2.png` → `vouchap-app/.../logo2.png`；`App-Icon-1024x1024@1x.png`；五档 `mipmap-*` 的 `ic_launcher` / `_round` / `_foreground`；备份 `icon.png` 与 `logo2` 一致。  
- 提交 `da392ec` 并已 `git push`。  
- **验证**：下次 EAS/本地 release 包应带新图标；可 `npm run icons:sync-from-logo2` 在仅改 `logo2.png` 后复跑。

**关联**  
- `scripts/sync-native-launcher-icons-from-logo2.sh`、`src/mobile-ui/assets/logo2.png`、`assets/logo2.png`、`ios/.../AppIcon...`、`android/.../mipmap-*`

### 2026-05-14（Vouchap：logo2 再次更新 — 重跑原生图标）

**User（提示词/原意）**  
- 再次更新了 logo2.png，重新处理素材。

**Assistant（实现前说明）**  
- 无代码逻辑变更；按 mtime 将较新的 `assets/logo2.png` 与 `vouchap-app/.../logo2.png` 对齐后执行 `scripts/sync-native-launcher-icons-from-logo2.sh`，并刷新 `icon.png`。

**Assistant（实现后说明 / 本轮结论）**  
- 源图为 **2048×2048** PNG；已重写 iOS `App-Icon-1024x1024@1x.png` 与 Android 五档 `mipmap` webp。  
- 提交 **`da3fbf1`**（`chore(brand): regenerate launcher icons from updated logo2.png (2048)`）并已 `git push`。

**关联**  
- 同上轮 logo 脚本与路径。

### 2026-05-14（Vouchap：空提交「优化logo」+ EAS production 全平台构建）

**User（提示词/原意）**  
- 再次 commit「优化logo」，并构建全平台 production。

**Assistant（实现前说明）**  
- 工作区无未提交 logo 文件变更（图标已在 `da3fbf1` 等提交中）；使用 **`git commit --allow-empty -m "优化logo"`** 满足指定提交信息并 `git push`。  
- 在 `vouchap-app` 后台执行 `npx eas-cli build --platform all --profile production --non-interactive`（日志见本机终端 / `terminals/841180.txt` 或 `/tmp/eas-build-all.log`）。

**Assistant（实现后说明 / 本轮结论）**  
- 提交 **`93933d2`**：`优化logo`（空提交），已推送 `origin/AI-Tax-filing`。  
- EAS 双端构建已触发；完成后在 Expo 控制台查看 Android/iOS 状态与产物（若 Android 再现 worker 断连可单独重试 `--platform android`）。

**关联**  
- `eas.json` production profile

### 2026-05-14（Vouchap：修复 App Store 90717 — iOS 1024 图标去 alpha）

**User（提示词/原意）**  
- `eas submit` / Transporter 后 Apple 报错：90717，大图标不能透明或含 alpha。

**Assistant（实现前说明）**  
- `sync-native-launcher-icons-from-logo2.sh` 对 iOS 使用了 `-background none`，导出 PNG 仍带 alpha → 违反 [Human Interface Guidelines / App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)。

**Assistant（实现后说明 / 本轮结论）**  
- iOS 行改为：白底 `-flatten` + `-alpha off`，1024 输出为 **TrueColor 无 alpha**（`identify` 显示 `channels=srgb` 三通道）。  
- 更新 `assets/README.md` 说明；提交 **`ba96ec4`** 并已 `git push`。  
- **验证**：重新 `eas build`（iOS）后再次 submit；90717 应消失。

**关联**  
- `scripts/sync-native-launcher-icons-from-logo2.sh`、`ios/.../App-Icon-1024x1024@1x.png`

### 2026-05-14（Vouchap：弱网打开 expense 列表不报 Failed to load）

**User（提示词/原意）**  
- 2.6.2 弱网打开 receipt 列表 toast 报错（用户描述为 failed to load data）；不应报错，加载变慢可接受。

**Assistant（实现前说明）**  
- `receipts.tsx` 的 `loadReceipts` 在 `getReceiptsForListFirstPaint` / `getAllReceipts` 抛错时一律 `showToast('Failed to load expenses', 'error')`；弱网下 Supabase 易超时/断连，属瞬时错误。

**Assistant（实现后说明 / 本轮结论）**  
- 增加 `sleep`、`isTransientReceiptLoadError`、`isAuthOrConfigReceiptLoadError`；`loadReceipts` 对瞬时错误 **最多 4 次指数退避重试**（约 450ms 起）；仅在 **非瞬时** 或 **未登录/未选空间** 时保留 error toast；瞬时失败耗尽重试后 **静默**（仅 console），结束 loading。  
- **验证**：弱网/飞行模式闪烁下进入列表不应再弹失败 toast；下拉刷新同理；未登录仍应有提示。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`

### 2026-05-16（Vouchap：移除 entity_pos_tax_code 表、RPC 与关联列）

**User（提示词/原意）**  
- 将 `entity_pos_tax_code` 相关代码与库表清理掉。

**Assistant（实现前说明）**  
- 应用层已无 `receipt-item-tax.ts` / `record_entity_pos_tax_learning` 等引用；税项改为 `receipts.tax_breakdown` + `crm.tax_kind_registry`。  
- 遗留：`20260412100000_*` 创建的 `public.entity_pos_tax_code`、`entity_pos_tax_code_learning_events`、`record_entity_pos_tax_learning_and_maybe_promote`，以及 `receipt_item_taxes.entity_pos_tax_code_id`、`receipt_items.applicable_tax_kinds`（`receipts.merchant_entity_id` 已在 `20260510160000` 删除）。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `vouchap-app/supabase/migrations/20260516120000_drop_entity_pos_tax_code.sql`：DROP RPC/触发器/两表/上述列。  
- **验证**：`supabase db push` 后 `\d entity_pos_tax_code` 应不存在；应用识别与列表无回归。  
- **未动**：`receipt_items.pos_tax_code`（OCR 存根）、`crm.tax_pos_code_rule`（全局 POS 规则，非 entity 目录）。

**关联**  
- `20260516120000_drop_entity_pos_tax_code.sql`

### 2026-05-17（Vouchap：移除行级税额拆分，仅保留小票级税种）

**User（提示词/原意）**  
- 税额拆分到 item 的业务逻辑和库表都清理掉；后续只拆分小票级的税种，而不拆分到 item。

**Assistant（实现前说明）**  
- 应用层 `receipt-item-tax.ts` 已不存在；仍遗留 `public.receipt_item_taxes`、`receipt_items.pos_tax_code`、`crm.tax_pos_code_rule` 与 `record_pos_tax_learning_and_maybe_promote`；小票级税项保留 `receipts.tax` + `receipts.tax_breakdown`（`receipt-tax-breakdown.ts` / `receipt-tax-kind-resolve.ts`）。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `vouchap-app/supabase/migrations/20260517120000_drop_receipt_line_item_tax_split.sql`：DROP `receipt_item_taxes`、行上 `pos_tax_code`、`pos_tax_code_learning_events`、学习 RPC、`crm.tax_pos_code_rule`。  
- 调整 `20260516120000`：不再 ALTER 即将删除的 `receipt_item_taxes`。  
- TS：`database.ts` 去掉 `pos_tax_code` 读写；`types` 去掉 `posTaxCode`；`receipt-tax-breakdown.ts` 删除仅服务行税引擎的 `parseReceiptTaxBreakdownToKindAmounts` / `serializeReceiptTaxBreakdownForDb`；`receipt-processor` 注释对齐。  
- **验证**：`supabase db push` 后无 `receipt_item_taxes` / `pos_tax_code`；识别多税种小票仅写 `tax_breakdown`；列表/详情/保存 item 无回归。  
- **保留**：`receipts.tax`、`receipts.tax_breakdown`、`crm.tax_kind_registry`、`crm.tax_rate_standard`。

**关联**  
- `20260517120000_drop_receipt_line_item_tax_split.sql`、`database.ts`、`receipt-tax-breakdown.ts`

### 2026-05-17（Vouchap：修复识别成功但 receipt_items 未写入）

**User（提示词/原意）**  
- AI log 显示识别 JSON 正确，但 `receipt_items` 表无数据；怀疑昨日清理行税导致严重 bug。

**Assistant（实现前说明）**  
- 拍照流程：`saveReceipt(items:[])` → `processReceiptInBackground` → `updateReceipt` 写行。`updateReceipt` 原逻辑**先删后插**，插入失败且原快照为空时会把行清空；`convertGeminiResultToReceipt` 失败时曾写 `items: []` 并仍调用 `updateReceipt`。`tax_breakdown` 解析抛错也可能阻断整次 update。

**Assistant（实现后说明 / 本轮结论）**  
- `database.ts`：`replaceReceiptItemsForReceipt` **先插后删**；空 `items` 不再清空已有行；`tax_breakdown` resolve 失败时降级写入 coerced 行。  
- `receipt-helpers.ts`：新增 `buildExpenseReceiptFallbackFromGemini`，从模型 JSON 用默认分类/属性写行。  
- `receipt-processor.ts`：转换失败时走回退，避免 `items: []` 落库。  
- **验证**：拍一张多行小票 → `receipt_items` 行数与 JSON 一致；人为制造 insert 失败时旧行不被清空（或仅有短暂重复后清理）。

**关联**  
- `database.ts`、`receipt-helpers.ts`、`receipt-processor.ts`

### 2026-05-17（Vouchap：发布 2.6.3）

**User（提示词/原意）**  
- 版本号更新为 2.6.3；commit「清理库表，构建v2.6.3」；全平台 production 构建。

**Assistant（实现后说明 / 本轮结论）**  
- 版本 2.6.3 / Build 53 已同步至 package.json、app.json、app.config.js、android、ios；与行税清理、receipt_items 写入修复一并提交；EAS production `--platform all`。

**关联**  
- 提交「清理库表，构建v2.6.3」

### 2026-05-13（Vouchap：Gemini 识别模型动态 listModels + 成本序轮询 + 503 清缓存）

**User（提示词/原意）**  
- 2.5-flash 503、1.5-flash 404 接连出现；希望随 Google 模型变化动态从满足需求的模型里按价格低到高轮询调用。

**Assistant（实现前说明）**  
- 原逻辑：`mergeGeminiModelsWithAvailable` 把 `getAvailableImageModel()` 的**单个**模型置顶 + 静态 `buildGeminiModelOrder`，仍易死盯已下线或限流的 id。  
- 计划：`gemini-proxy` 已有 `listModels`；在 `gemini-helper` 拉全量 `generateContent` 候选（过滤 embed 等），用**启发式 cost score**排序（低价优先），TTL 缓存；`resolveGeminiModelsToTryOrder` = 动态序 + 静态兜底去重；`clearModelCacheIfUnavailable` 遇 **503/429/502** 等同 404 调用 `invalidateGeminiModelTryOrderCache`；`gemini.ts` / 报税识别 / task-matcher 全部改 `await resolveGeminiModelsToTryOrder`；空 list 不写长 TTL 缓存。

**Assistant（实现后说明 / 本轮结论）**  
- `gemini-helper.ts`：`scoreGeminiModelCostHeuristic`、`resolveGeminiModelsToTryOrder`、`invalidateGeminiModelTryOrderCache`；`getAvailableImageModel` 改为取成本序首项。  
- `gemini.ts`：移除 `availableModelCache` 与逐处 `getAvailableImageModel`；404 报错文案改为引用静态兜底标签。  
- `tax-filing-recognition-run.ts`、`tax-filing-task-matcher.ts`：同上统一入口。  
- **验证**：Dev 下触发识别，日志应依次尝试 API 返回的低价模型；人为使某一模型 503 后下一请求应可重新 listModels；`read_lints` 无新增问题。  
- **残留**：成本序为启发式非官方价目；真正「轮询均衡」到多租户可再加全局起始偏移。

**关联**  
- `gemini-helper.ts`、`gemini.ts`、`tax-filing-recognition-run.ts`、`tax-filing-task-matcher.ts`

### 2026-05-13（aim-link-website：修复深链接 404，新增 Vercel SPA 重写）

**User（提示词/原意）**  
- 在 aim.link 站内点击 `https://aim.link/guide/quick-start` 正常打开，但浏览器直接访问该 URL 报 404；需定位原因并修复。

**Assistant（实现前说明）**  
- 项目结构：`/Users/macbook/aim-link-website` 是 Vite + React (`BrowserRouter`) 的纯 SPA，路由声明在 `src/App.jsx`（含 `/guide`、`/guide/:docId`）。`dist/` 仅有单一 `index.html`。  
- 复现：`curl -I https://aim.link/guide`、`/guide/quick-start` 均返回 `HTTP/2 404 server: Vercel`，说明请求在 Vercel CDN 层就被拒，没到 SPA。  
- 根因：仓库无 `vercel.json`（`Glob vercel.json` 0 命中），Vercel 未配置 SPA fallback，深链接没有对应静态文件 → 404。站内跳转走客户端路由，不发请求所以不受影响。  
- 计划：在 `aim-link-website/` 根新增 `vercel.json`，配置 `rewrites: /(.*) → /index.html`（Vercel rewrites 优先匹配真实文件，不会破坏 `dist/assets/*` 等静态资源）；同时为哈希化静态资源加 `Cache-Control: public, max-age=31536000, immutable`，`/` 与 `/index.html` 设 `max-age=0, must-revalidate` 避免发版后引用旧 chunk。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `aim-link-website/vercel.json`：含 SPA `rewrites` + 静态资源长缓存 + HTML no-cache headers。  
- 未改任何源码与构建产物；下次 Vercel 部署应用配置后，`/guide`、`/guide/quick-start` 等深链接将命中 `index.html` 由 React Router 渲染。  
- **验证建议**：合并部署后再次 `curl -I https://aim.link/guide/quick-start` 应得 `200`、`content-type: text/html`；浏览器直接访问与刷新都应正常渲染对应文档。  
- **已知限制**：本次未集成 SEO 预渲染/SSR；爬虫到达深链接拿到的仍是 SPA 壳，如后续要做 SEO 需进一步评估 prerender / SSR。

**关联**  
- `aim-link-website/vercel.json`（新增）、`aim-link-website/src/App.jsx`（仅参考路由声明，未改）

### 2026-05-13（aim-link-website：commit 后 Vercel 未自动部署 → CLI 强制上线 + 待接 Git 集成）

**User（提示词/原意）**  
- 已 `git push` `57c779f 修复子链接的直接访问404问题`，但线上仍 404，问为什么 Vercel 没自动部署。

**Assistant（实现前说明）**  
- 排查：`git log/status` 显示已推到 `origin/main`；`vercel ls` 显示历史 20+ 次部署 **Username 全部是 `adaven`（CLI 用户）**，没有任何一次 Git 触发，最近部署 8 天前，commit `57c779f` 之后**未触发新的 build**。结论：该 Vercel 项目从未连接 GitHub Git 集成（或之前被卸载），本地 `.vercel/project.json` 仅是 CLI 链接，`git push` 不会触发自动构建。  
- 计划：先 `vercel --prod --yes` 把这次 fix 推上线，让 deeplink 立刻可用；接 Git 集成需在 Vercel Dashboard `Settings → Git → Connect Git Repository`（CLI 无对应命令）。

**Assistant（实现后说明 / 本轮结论）**  
- 在 `/Users/macbook/aim-link-website` 执行 `vercel --prod --yes`，新部署 `aim-link-website-nhdb2nw18-...`，已 aliased 到 `https://aim.link`。  
- 验证：`curl -I https://aim.link/guide/quick-start` 与 `/guide`、`/pricing` 均 `HTTP/2 200`；`/assets/index-CppK8k49.js` 返回 `cache-control: public, max-age=31536000, immutable`，`/guide/*` HTML 返回 `max-age=0, must-revalidate` — `vercel.json` rewrites 与 headers 均生效。  
- **待办（用户侧操作，CLI 做不到）**：在 Vercel Dashboard 为 `james-projects-3aaa32ea/aim-link-website` 项目 `Settings → Git` 连接 GitHub 仓库 `jameszjgao/aim-link-website`、Production Branch = `main`，并确认 Vercel GitHub App 拥有该仓库权限；接入后以后 `git push` 才会自动触发部署 + PR Preview。  
- **残留风险**：构建警告 `dist/assets/index-*.js` 单 chunk 795KB（gzip 245KB），后续可考虑 `manualChunks` 或路由级 `React.lazy` 分包，本轮未处理。

**关联**  
- 部署: `https://aim-link-website-nhdb2nw18-james-projects-3aaa32ea.vercel.app` → `https://aim.link`

### 2026-05-13（vouchap-CRM：新建客户订单表单分步 + 产品/客户/SKU 联动）

**User（提示词/原意）**  
- 新建客户订单界面优化：1）先选产品（当前仅 Vouchap）；2）再选客户（范围由产品决定）；3）再选 SKU（由产品 + 客户 firm/client 决定）；4）订阅单显示到期日，增购 credit 显示数量。

**Assistant（实现前说明）**  
- `spaces` 增加 `kind` 查询；`sku_edition` 增加 `data_limits`，按 `crm-order-design.md` 的 `billing_kind` / `space_target` 过滤可下单 SKU；目录 SKU（`CLIENT_RECOGNITION_BASE`、`FIRM_CLIENT_SIGNING_BONUS`）排除。  
- 订阅类（`space_subscription` 或兼容编码）强制 `expires_at`；`recognition_credit_pack` / `engagement_credit_pack` 强制正整数写入对应 `metadata` 键且 `expires_at` 为空。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `vouchap-crm/src/pages/space-orders-sku-helpers.ts`；重写 `SpaceOrders.tsx` 新建弹窗为 1–4 步 UI，`CRM_PRODUCTS` 暂仅 Vouchap；`spacesForProduct` 预留按产品过滤；`skusForCustomer` 按 `skuMatchesSpaceKind`。  
- **验证**：`npx tsc --noEmit`（vouchap-crm）通过；在 CRM 选 Client 空间时不应出现 Firm-only SKU，反之亦然；选试用/年费等应必填到期日；选 RECOGNITION/ENGAGEMENT credit 包应必填数量且无到期日。

**关联**  
- `vouchap-crm/src/pages/SpaceOrders.tsx`、`vouchap-crm/src/pages/space-orders-sku-helpers.ts`

---

### 2026-05-22（Vouchap：Gemini 安全加固 — 过时文档与机制）

**User（提示词/原意）**  
- 过时文档中的 key 已自行删除失效内容；要求按安全分析**直接优化**代码/机制；如需重新构建 App 须明确告知。

**Assistant（实现前说明）**  
- 删除根目录误导性 Gemini/EAS 文档；统一 `EAS_SECRETS_SETUP.md`、`NETWORK_FIX.md`、`README.md` 为「仅 Supabase + gemini-proxy」；`gemini-proxy` 的 `listModels` 改为 Header 传 key；增加 pre-commit / gitleaks 防泄漏；新增 `vouchap-app/docs/GEMINI-API-SECURITY.md`。

**Assistant（实现后说明 / 本轮结论）**  
- **已删**：`DEBUG_GEMINI_API_KEY.md`、`GEMINI_API_KEY_SETUP.md`、`UPDATE_GEMINI_API_KEY.md`。  
- **已更新**：`EAS_SECRETS_SETUP.md`（仅 Supabase 两项 EAS 变量，明确勿配 `EXPO_PUBLIC_GEMINI_API_KEY`）、`NETWORK_FIX.md`、`README.md`；新增 `vouchap-app/.env.example`、`vouchap-app/docs/GEMINI-API-SECURITY.md`。  
- **Edge**：`gemini-proxy/index.ts` — `listModels` 使用 `x-goog-api-key`，避免 URL 带 `?key=`。  
- **仓库机制**：`scripts/check-staged-secrets.sh`、`.pre-commit-config.yaml`、`.gitleaks.toml`（可选 `pre-commit install`）。  
- **是否重构建 App**：**不需要**。客户端逻辑未变；仅需在 Supabase **重新部署** `gemini-proxy`（`cd vouchap-app && supabase functions deploy gemini-proxy`）。建议在 Expo Dashboard **删除**历史 `EXPO_PUBLIC_GEMINI_API_KEY`（若仍存在）。  
- **GCP 控制台**限制/轮换仍为运维侧，非本提交范围。

**关联**  
- `vouchap-app/supabase/functions/gemini-proxy/index.ts`  
- `vouchap-app/docs/GEMINI-API-SECURITY.md`  
- `scripts/check-staged-secrets.sh`、`.pre-commit-config.yaml`

---

### 2026-05-26（Vouchap Android：Recognition unavailable 与不限量权益）

**User（提示词/原意）**  
- Android 端 Expense Details 出现「Recognition unavailable」及 gemini-proxy 提示；当前 space 已配置不限量权益，询问原因。

**Assistant（实现前说明）**  
- 无代码变更；对照 `receipt-processor.ts`、`client-recognition-quota.ts`、`recognition-retry.ts` 与截图文案区分「配额拦截」与「AI 调用失败」。

**Assistant（实现后说明 / 本轮结论）**  
- 截图正文为 `Recognition failed. Please try again later.` + gemini-proxy 配置提示 → 来自 **`recognizeReceipt` 经 `gemini-proxy` 重试 5 次仍失败**，**非** CRM 工作区识别配额用尽（后者 `recognition_notice` 会含 *plan or credits* / *workspace* 等字样）。  
- 不限量权益只影响 `get_client_recognition_quota` 的 `included_per_month` / `monthly_cap`（client 默认 `monthly_cap` 为 null）；**不保证** Supabase Edge `GEMINI_API_KEY`、网络或 Google API 可用。  
- 建议排查：Supabase `gemini-proxy` 部署与密钥、Functions 日志、设备网络（截图网速极低）、收据 `space_id` 是否与当前工作区一致。

**关联**  
- `vouchap-app/src/shared-logic/receipt-processor.ts`  
- `vouchap-app/src/shared-logic/client-recognition-quota.ts`

---

### 2026-05-26（追问：Gemini API 降为 Free Tier，当日首次识别仍失败）

**User（提示词/原意）**  
- Supabase 侧 Gemini API Key 已降为 free tier；当天在 Vouchap 内尚未成功识别过，初次识别即出现 Recognition unavailable。

**Assistant（实现前说明）**  
- 无代码变更；对照 `gemini-helper` 模型链、`recognizeReceipt` 多模型重试、`runWithRecognitionRetry` 与 Google 2026 free tier 策略说明因果。

**Assistant（实现后说明 / 本轮结论）**  
- **与 Vouchap space 不限量无关**；瓶颈在 **Google 项目级** `GEMINI_API_KEY`（RPM/RPD、Pro 模型付费化、配额按 GCP 项目而非按用户/按日首次）。  
- **单次小票识别 ≠ 1 次 API 调用**：`listModels` + 多模型 `generateContent`（含 `gemini-2.5-pro` 等）+ 外层最多 5 轮重试，free tier 易在「第一次用户识别」即 429/403/404；UI 经 `getUserFacingMessage` 仍可能显示泛化 gemini-proxy 文案。  
- **建议**：Supabase `gemini-proxy` 日志查 429/RESOURCE_EXHAUSTED；设 `GEMINI_MODEL_DEFAULT=gemini-2.5-flash`（或 flash-lite）+ `GEMINI_ENFORCE_SERVER_MODEL=true`；AI Studio 查看该项目实时限额；生产用启用 billing 的 Tier 1 或独立付费 key。

**关联**  
- `vouchap-app/src/shared-logic/gemini-helper.ts`、`gemini.ts`、`recognition-retry.ts`  
- `vouchap-app/supabase/functions/gemini-proxy/index.ts`

---

### 2026-05-26（Vouchap：识别支持 DeepSeek 模型）

**User（提示词/原意）**  
- 给 vouchap 增加采用 DeepSeek 模型的能力。

**Assistant（实现前说明）**  
- 在现有 `gemini-proxy` Edge 上增加 `provider`（gemini | deepseek），密钥仅服务端；客户端 `gemini-server-sdk` 传 provider；新增 `ai-provider` / `deepseek-helper` / `ai-model-helper` 统一模型顺序；`gemini.ts` 与报税识别改走 `resolveModelsToTryOrder`。

**Assistant（实现后说明 / 本轮结论）**  
- **Edge**：`gemini-proxy/index.ts` 支持 `body.provider`、`AI_PROVIDER_DEFAULT`；DeepSeek 走 OpenAI 兼容 `chat/completions`（图片转 `image_url` data URI）；`listModels` 返回静态 DeepSeek 目录。  
- **客户端**：`ai-provider.ts`（`EXPO_PUBLIC_AI_PROVIDER` / `extra.aiProvider`）；`resolveModelsToTryOrder` 按 provider 分支；`app.config.js` 映射 `aiProvider`。  
- **文档**：`docs/AI-RECOGNITION-PROVIDERS.md`，更新 `gemini-proxy/README.md`、`GEMINI-API-SECURITY.md`、`.env.example`。  
- **启用 DeepSeek**：`supabase secrets set DEEPSEEK_API_KEY=... AI_PROVIDER_DEFAULT=deepseek` 后 `supabase functions deploy gemini-proxy`；可选客户端 `EXPO_PUBLIC_AI_PROVIDER=deepseek`。  
- **验证**：部署后 Supabase 日志应见 `[gemini-proxy] calling DeepSeek API`；识别一张小票；`listModels` 在 deepseek 下返回静态模型名。

**关联**  
- `vouchap-app/supabase/functions/gemini-proxy/`  
- `vouchap-app/src/shared-logic/ai-provider.ts`、`ai-model-helper.ts`、`deepseek-helper.ts`、`gemini-server-sdk.ts`  
- `vouchap-app/docs/AI-RECOGNITION-PROVIDERS.md`

---

### 2026-05-26（追问：已注入 DeepSeek key，旧 App 识别仍失败）

**User（提示词/原意）**  
- `supabase secrets set` 已执行并注入可用 DeepSeek key，但之前构建的 App 再次拍摄识别仍出现同样提示。

**Assistant（实现前说明）**  
- 根因：① 仅改 Secret 未 **deploy** 含 DeepSeek 分支的 `gemini-proxy`；② 旧 App 仍传 Gemini 模型名，DeepSeek API 拒收；③ 新构建若 `extra.aiProvider=gemini` 会覆盖服务端 `AI_PROVIDER_DEFAULT`。

**Assistant（实现后说明 / 本轮结论）**  
- **Edge**：`AI_PROVIDER_DEFAULT=deepseek` 时忽略 body 中缺省或 `provider:gemini`；DeepSeek 路径将 `gemini*` 模型名 remap 为 `DEEPSEEK_MODEL_DEFAULT`。  
- **客户端**：无 `EXPO_PUBLIC_AI_PROVIDER` 时不向 Edge 发送 `provider`；`app.config.js` 不再默认写入 `aiProvider: gemini`。  
- **用户操作**：必须 `supabase functions deploy gemini-proxy`；建议 `DEEPSEEK_ENFORCE_SERVER_MODEL=true`；在 Supabase 日志确认 `calling DeepSeek API`。旧 App **无需重装**（部署 Edge 后即可）。

**关联**  
- `vouchap-app/supabase/functions/gemini-proxy/index.ts`  
- `vouchap-app/src/shared-logic/ai-provider.ts`、`gemini-server-sdk.ts`、`app.config.js`

---

### 2026-05-26（DeepSeek 已调用仍失败 — 小票需视觉模型）

**User（提示词/原意）**  
- deploy 已执行，旧 App 仍同样提示；Functions 日志多次 `[gemini-proxy] calling DeepSeek API` 且 `hasInlineImage:true`。

**Assistant（实现前说明）**  
- 日志证明路由正确；根因为 DeepSeek chat API **不接受 image_url**（官方 text-only），小票识别必带图 → 400/重试后客户端仍显示 Recognition unavailable。

**Assistant（实现后说明 / 本轮结论）**  
- **Edge**：`provider=deepseek` 且含图片时，若配置 `GEMINI_API_KEY` 则自动 **Gemini vision fallback**（日志：`DeepSeek cannot accept images; Gemini vision fallback`）；无 Gemini key 时返回明确 400 文案。纯文本请求仍走 DeepSeek。  
- **用户**：小票拍照需可用 **GEMINI_API_KEY**（或改 `AI_PROVIDER_DEFAULT=gemini`）；仅 DeepSeek 无法完成收据 OCR。需再次 `supabase functions deploy gemini-proxy`。  
- **文档**：`AI-RECOGNITION-PROVIDERS.md` 补充 DeepSeek 与照片识别说明。

**关联**  
- `vouchap-app/supabase/functions/gemini-proxy/index.ts`

---

### 2026-05-26（用户问：DeepSeek 是否有可识图模型）

**User（提示词/原意）**  
- DeepSeek 是否有可选的识图模型。

**Assistant（实现后 / 本轮结论）**  
- **有视觉模型**（DeepSeek-VL2、Janus-Pro 等），但为 **开源权重 + 自建推理**，**不在** `api.deepseek.com` 的 `chat/completions` 产品线内；官方 API 仅 **deepseek-v4-flash / v4-pro / chat**（纯文本）。  
- Vouchap 当前 `DEEPSEEK_API_KEY` 路径无法用小票照片直连 VL；照片识别需 **Gemini vision fallback** 或 `AI_PROVIDER_DEFAULT=gemini`。已在 `AI-RECOGNITION-PROVIDERS.md` 补充对照表。

**关联**  
- `vouchap-app/docs/AI-RECOGNITION-PROVIDERS.md`

---

### 2026-05-26（Gemini free tier 模型优先级）

**User（提示词/原意）**  
- 恢复采用 Gemini；按 free tier limit 优先 **Gemini 3.5 Flash → 3 Flash → 2.5 Flash → 3.1 Flash Lite → 2.5 Flash Lite**，避免 0 配额模型（Pro、2 Flash 等）；已 deploy gemini-proxy。

**Assistant（实现前说明）**  
- 调整 `gemini-helper` 静态顺序、动态 listModels 过滤与打分；默认/Edge `GEMINI_MODEL_DEFAULT` 改为 `gemini-3.5-flash`；复杂场景用 `gemini-3.1-flash-lite` 替代 `gemini-2.5-pro`。

**Assistant（实现后说明 / 本轮结论）**  
- **`GEMINI_FREE_TIER_MODEL_ORDER`** + **`isGeminiModelBlockedOnFreeTier`** 屏蔽 Pro / 1.5 / 2.0 / 2 Flash 等。  
- **`GEMINI_PRIMARY_MODEL`** = `gemini-3.5-flash`；**`GEMINI_COMPLEX_FALLBACK_MODEL`** = `gemini-3.1-flash-lite`（500 RPD 档）。  
- **`gemini-proxy`** 默认 `gemini-3.5-flash`；Gemini 路径对 **非 free-tier allowlist** 的客户端模型名（如 `gemini-1.5-flash`、Pro）**remap 为 `GEMINI_MODEL_DEFAULT`**，旧 App 无需重装即可受益（需再 deploy 一次本 commit）。

**关联**  
- `vouchap-app/src/shared-logic/gemini-helper.ts`  
- `vouchap-app/supabase/functions/gemini-proxy/index.ts`

---

### 2026-05-26（gemini-proxy 日志 2.5-flash 却 404 gemini-1.5-flash）

**User（提示词/原意）**  
- Edge 日志显示 `calling Gemini API` model 为 `gemini-2.5-flash`，但报错 `gemini-1.5-flash` 404。

**Assistant（实现后说明）**  
- **根因**：`geminiGenerateContent` 误用 `isGeminiStyleModelId`（凡 `gemini*` 均替换为 `GEMINI_MODEL_DEFAULT`）；若 Secret 仍为 `gemini-1.5-flash`，实际请求 1.5 而日志打印客户端传入的 2.5。  
- **修复**：`pickAllowedGeminiModel` + 实际调用与日志均用 `resolveModelForProvider`；blocked/env 无效时强制 `gemini-3.5-flash`；remap 时打 `remapped Gemini model` 日志。  
- **运维**：`supabase secrets set GEMINI_MODEL_DEFAULT=gemini-3.5-flash` 或删除旧 secret 后 redeploy。

**关联**  
- `vouchap-app/supabase/functions/gemini-proxy/index.ts`

---

### 2026-06-03（商务：三家公司白标 + 自有 Supabase/服务器部署 Proposal 英文稿）

**User（提示词/原意）**  
- 潜在客户旗下三家公司，讨论 Vouchap 后希望定制白标版本，部署在自有服务器或自有 Supabase 云资源；需以商务专家角度编写英文 proposal。

**Assistant（实现前说明）**  
- 无代码变更；对照 PRD、官网 Features、部署文档（Supabase/Cloudflare/EAS）梳理产品能力与私有化可行项，输出英文商务 proposal（含 executive summary、方案范围、部署选项、阶段、交付物、定价框架、SLA、下一步）。

**Assistant（实现后说明 / 本轮结论）**  
- 已在对话中交付完整英文 proposal 正文；未新建仓库内独立 `.md` 文件（用户未要求落盘）。客户名、三家公司实体名、预算与工期为占位，需商务会前填入。

**关联**  
- `docs/PRD-Vouchap-Platform-And-Marketing-Site.md`  
- `vouchap-app/docs/DEPLOY-CLOUDFLARE.md`  
- `vouchap-website/components/Features.tsx`


---

### 2026-07-14（收据提交异步化：先上传建单，识别后台回写）

**User（提示词/原意）**  
- 移动端与 Web：拍照或提交文字、语音后，目前提交后只能停留界面等待。  
- 需要异步处理：立即上传文件/图片并保存，出现 receipt 记录；识别过程可异步，后续更新记录。  
- 一次提交多个文件需尽快先处理上传和产生记录；退出窗口不应影响记录产生与后续更新。

**Assistant（实现前说明）**  
- 现状：拍照路径已有 `processing` 占位，但首页仍 `await` 整段 OCR；Chat 文字/语音/附件为「先识别再建单」，且后台重试受 `mountedRef` 影响会跳过落库。  
- 计划：统一「上传/建 `processing` → 释放 UI → 后台识别 `updateReceipt`」；扩展 `receipt-processor` 支持 text/audio/document；发票对齐；多文件循环内只 await 上传+建单，识别 fire-and-forget。

**Assistant（实现后说明 / 本轮结论）**  
- 扩展 [`receipt-processor.ts`](vouchap-app/src/shared-logic/receipt-processor.ts)：`createProcessingReceipt` + text/audio/document 后台识别；失败统一 `needs_retake`（不再误写 `pending`）。  
- 新增 [`invoice-processor.ts`](vouchap-app/src/shared-logic/invoice-processor.ts) 对称异步路径。  
- 首页 [`index.tsx`](vouchap-app/src/mobile-ui/app/index.tsx)：上传+建单后 fire-and-forget 识别，多图可连续建单。  
- [`receipts.tsx`](vouchap-app/src/mobile-ui/app/receipts.tsx)、[`chat-to-log.tsx`](vouchap-app/src/mobile-ui/app/chat-to-log.tsx)：附件/文字/语音先建单并写 chat log，识别异步；unmount 仅停止 UI 刷新，不取消落库；Web blob 延后 revoke。  
- **验证建议**：首页多图拍照后立即关 Success / 回列表，应看到多条 `Processing...` 并陆续变为识别结果；Chat 连发多附件、文字、语音后立刻退出，列表/详情仍应有记录并后续更新。  
- **残留**：识别仍由客户端进程编排（杀进程后 Promise 中断）；长期可上服务端 job / 对 `processing` 孤儿补跑。inbound/outbound 文字语音路径仍为同步识别（本轮未改）。

**关联**  
- `vouchap-app/src/shared-logic/receipt-processor.ts`  
- `vouchap-app/src/shared-logic/invoice-processor.ts`  
- `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`  
- `vouchap-app/src/mobile-ui/app/index.tsx`  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`

---

### 2026-07-14（vouchap-app：发布版本号 2.6.4 Build 54，准备 Expo 构建）

**User（提示词/原意）**  
- vouchap 更新移动 app 版本号，准备推送 expo 构建。

**Assistant（实现前说明）**  
- 当前为 2.6.3 / Build 53；按 `.cursorrules` 同步 package.json、package-lock、app.json、app.config.js、android build.gradle、iOS Info.plist，升为 2.6.4 / Build 54，并 commit + push。

**Assistant（实现后说明 / 本轮结论）**  
- 已将版本统一为 **2.6.4**，构建号 **54**；提交信息：`发布版本号 2.6.4 (Build 54)` 并 push。可据此跑 EAS/Expo 构建。

**关联**  
- `vouchap-app/package.json` 等版本文件

---

### 2026-07-14（EAS：全平台 production 构建）

**User（提示词/原意）**  
- 全平台构建 production。

**Assistant（实现前说明）**  
- 在 `vouchap-app` 执行 `eas build --platform all --profile production --non-interactive`。

**Assistant（实现后说明 / 本轮结论）**  
- 已提交 EAS production：Android versionCode remote 自增 57→58；iOS buildNumber 40→41（`appVersionSource: remote` + `autoIncrement`，与本地 app.config 参考值可能不一致）。  
- Android：https://expo.dev/accounts/aimlink/projects/vouchap/builds/6cdbd6f8-d8b9-4449-939e-b6f3fda43089  
- iOS：https://expo.dev/accounts/aimlink/projects/vouchap/builds/1436a1b3-68e8-46c2-9679-f671c4bf19d5  

**关联**  
- `vouchap-app/eas.json` production profile

---

### 2026-07-14（chat-to-log：修复 blob revoke 与 inbound fallback 误路由）

**User（提示词/原意）**  
- 核实并修复：1）附件 catch 无条件 revoke blob，破坏 receipt/invoice 后台识别；2）文字/语音 recognizeFn 非 inbound/outbound 时错误 fallback 到 inbound。

**Assistant（实现前说明）**  
- 确认两处均存在；catch 与 finally 策略对齐；fallback 改为显式 throw。

**Assistant（实现后说明 / 本轮结论）**  
- catch 中对 receipt/invoice 跳过 `URL.revokeObjectURL`；文字/语音 `recognizeFn` 未知类型抛错，不再误调 inbound。

**关联**  
- `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`

---

### 2026-07-15（查询：Google Play 审核隐私政策链接）

**User（提示词/原意）**  
- Google Play 审核提示隐私权政策页面错误；询问 Vouchap 应用用的隐私权网页链接是哪个。

**Assistant（实现前说明）**  
- 无代码变更；检索 app 内 PRIVACY_URL / privacy 配置。

**Assistant（实现后说明 / 本轮结论）**  
- App 内统一为 `https://vouchap.com/privacy`（`register.tsx`、`EngagementConsentModal.tsx`）。Play Console 商店页隐私政策链接需人工对照是否同一 URL；网站 `/privacy` 若 404/构建失败会导致审核拒审。

**关联**  
- `vouchap-app/src/mobile-ui/app/register.tsx`

---

### 2026-07-15（澄清：Play 审核隐私链接 vs App 内链接）

**User（提示词/原意）**  
- 为何 Google 审核发现的是 `https://help.aim.link/docs/Privacy-Policy`，而代码里是 vouchap.com/privacy？

**Assistant（实现前说明）**  
- 无代码变更；全仓检索该 URL，并核对 Play 商店公开页与 help.aim.link 可达性。

**Assistant（实现后说明 / 本轮结论）**  
- Vouchap 代码库**不含** `help.aim.link/docs/Privacy-Policy`；App 内仍为 `https://vouchap.com/privacy`。  
- Play 公开页 `play.google.com/store/apps/details?id=com.vouchap.app` 上展示的隐私政策正是旧 aim.link 链接；该链接现 302 到 `/404`。  
- 结论：审核读的是 **Play Console「隐私权政策」商店字段**（历史填的 aim.link），不是当前 App 内嵌链接。需在 Console 改为 `https://www.vouchap.com/privacy`（或 `https://vouchap.com/privacy`）。

**关联**  
- Google Play Console → App content / Store listing Privacy policy  

---

### 2026-07-15（说明：Play Console 隐私政策字段修改位置）

**User（提示词/原意）**  
- Play 商店页隐私链接在哪里改？为何会是 Google 反馈的 aim.link 链接。

**Assistant（实现前说明）**  
- 无代码变更；说明 Console 入口与公开商店页证据。

**Assistant（实现后说明 / 本轮结论）**  
- 公开页 `play.google.com/store/apps/details?id=com.vouchap.app` 已展示 `help.aim.link/docs/Privacy-Policy`，来自 Play Console「隐私权政策」URL，与 App 包无关。修改路径：Play Console → Vouchap → 应用内容（App content）→ 隐私权政策 → 编辑 URL → 保存；部分账号也在「政策」相关声明中。改完后公开页应显示新链接，无需重打包。

**关联**  
- Google Play Console / `com.vouchap.app`

---

### 2026-07-15（Play Console：找不到「应用内容」菜单）

**User（提示词/原意）**  
- 没有找到「应用内容」菜单项。

**Assistant（实现前说明）**  
- 无代码变更；按 Google 现行文档路径说明。

**Assistant（实现后说明 / 本轮结论）**  
- 现行入口为左侧 **政策与计划（Policy and programs）→ 应用内容（App content）→ 隐私权政策**，不是一级菜单「应用内容」。也可用控制台顶部搜索 “Privacy policy” / “隐私权政策”。须先进入具体应用 Vouchap，不要停在「所有应用」列表页。

**关联**  
- https://support.google.com/googleplay/android-developer/answer/9859455

---

### 2026-07-16（Android：进入 chat-to-log 闪退）

**User（提示词/原意）**  
- 昨天新构建的 Android 版只要进 chat to log 就闪退；Web 端提交给 Eric 可正常识别。

**Assistant（实现前说明）**  
- 怀疑与异步识别改动有关：chat log 写入的 `receiptPreview`/`invoicePreview` 占位缺少 `date`/`totalAmount`，进页加载历史后 `AmountText` 对 `undefined` 调 `toFixed` 会在原生生产包直接闪退；Web 侧 ErrorBoundary/未重开面板时不易复现。拟加固金额渲染、processing 占位展示，并补全落库 stub 字段。

**Assistant（实现后说明 / 本轮结论）**  
- 已改 `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`：  
  1）`AmountText` 与行项目价格对非数字金额兜底；  
  2）`status===processing` 或缺 date/amount 时显示 spinner，不渲染完整预览卡；  
  3）异步 `saveChatLog` 的 preview stub 补齐 `date`/`totalAmount`/`items`；  
  4）历史 enrich 拉取失败时清除残缺 preview，避免再渲染崩溃路径。  
- **验证**：装含此修复的 Android 包后进入 chat-to-log（尤其此前 Web 异步提交过 Eric 的账号）；应不再闪退。若仍闪退，请抓 logcat 中 `ReactNativeJS` / fatal 栈。  
- **残留**：识别仍为客户端异步 Promise；杀进程会中断进行中的识别。

**关联**  
- `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`  
- 异步识别提交：`a3bf720`

---

### 2026-07-16（Web：进入列表页白屏）

**User（提示词/原意）**  
- Web 端进入列表页会白屏。

**Assistant（实现前说明）**  
- 费用/收入等列表桌面 Web 默认打开右侧 chat；chat-to-log 或表格 `AmountCell`/`AmountText` 对空金额 `toFixed` 抛错会拖垮整页。拟：金额兜底、chat 侧 ErrorBoundary、助理配置与 FAB context 空值防护。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `ChatPanelErrorBoundary`，包住 `_layout` 中的 `WebChatPanel`（chat 崩不影响主列表）。  
- 加固 `voucher-table-columns` `AmountCell`、receipts/invoices/inbound/outbound `AmountText`；`getAssistantInfo` 缺类型回退 Eric；`WebChatPanel`/`WebChatFab`/`_layout` 对 `useChatPanel()` 空值安全；chat clientPreview `items` 可选链。  
- **验证**：桌面 Web 登录后进 Expenses/Income 等列表，主表应可见；若右侧 chat 仍异常应显示 Retry 而非整页白屏。浏览器控制台可看 `[ChatPanelErrorBoundary]`。

**关联**  
- `ChatPanelErrorBoundary.tsx`、`_layout.tsx`、`voucher-table-columns.tsx`、`receipts.tsx` / `invoices.tsx` / `inbound.tsx` / `outbound.tsx`、`assistant-config.ts`、`WebChatPanel.tsx`、`WebChatFab.tsx`、`chat-to-log.tsx`

---

### 2026-07-16（Web：列表表格列宽计算规则优化）

**User（提示词/原意）**  
- Web 列表表格列宽需优化：1）自动列宽总和占满容器，最小宽之和大于容器则可溢出；2）金额/日期/标签按内容宽，商户列最小 30 字符、账户列 20 字符；3）刷新、开关右侧栏等重算，数据更新不重算。

**Assistant（实现前说明）**  
- 拟改 `DataTable` 分配算法（最小宽保底 + 填满/溢出）、`ResizeObserver` 监听容器宽（侧栏开关）、列定义 `minChars` / `contentMinSamples`；不依赖行数据以免 Realtime 触发重算。

**Assistant（实现后说明 / 本轮结论）**  
- `DataTable.tsx`：`distributeFlexColumnWidths` 改为先满足有效最小宽，剩余按权重填满；过窄则取最小宽并横向溢出；`ResizeObserver` + wrapper callback ref 在容器宽变化时递增 epoch 重算；测宽工具 `measureTableTextWidthPx` / `minWidthForChars` / `minWidthForContentSamples`；分配 effect 不依赖 `data`/`sections`。  
- `voucher-table-columns.tsx`：Payee/Payer/Sender/Receiver/`payee` `minChars: 30`，Account `minChars: 20`，Amount/Date/Status 等用 `contentMinSamples`。  
- **验证**：桌面 Web 开 Expenses，列宽应铺满主区；开关右侧 chat 后列宽重算；Realtime 改行数据列宽不变；缩窄窗口至小于最小宽之和时应出现横向滚动。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`  
- `vouchap-app/src/mobile-ui/components/voucher-table-columns.tsx`

---

### 2026-07-16（Web：手动拖列宽 / 改可见列不整表重算）

**User（提示词/原意）**  
- 手动调整单列列宽（改可见列）时不重算，其他列宽不变，列宽总和可以溢出或不足容器宽度。

**Assistant（实现前说明）**  
- `layoutCaptureKey` 含 `visibleIds`/`orderIds`，改可见列会触发 `distributeFlexColumnWidths` 填满容器；需改为仅换表/容器宽变化时整表重算。

**Assistant（实现后说明 / 本轮结论）**  
- `layoutCaptureKey` 去掉可见列与列序；手动 `commitColumnWidth` 只改本列；改可见列时仅给尚无宽度的新列写有效最小宽，已有列宽保留；总和可溢出或留白。  
- **验证**：拖某一列后其他列宽不变；隐藏/显示列后其余列宽不变；开右侧栏仍整表重算占满。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`

---

### 2026-07-16（Web：拖列宽时右侧列仅平移）

**User（提示词/原意）**  
- 手动减小可见列宽度时，拖动过程中仍会影响其他列宽；应拖动也不影响，其右侧各列随拖动平移。

**Assistant（实现前说明）**  
- 根因：`table-layout:fixed` 下只改当前列 DOM 宽、表总宽不变，浏览器会把空出宽度分给其他列。

**Assistant（实现后说明 / 本轮结论）**  
- 拖拽开始时冻结表头各列像素宽；拖动中同步增减 `table` 总宽与当前列宽，其他列宽不变、仅平移。  
- **验证**：缩小/拉大某一列时，相邻右侧列宽度目视不变，位置随边界移动。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`

---

### 2026-07-16（Web：列宽设计流程完整审查与仿真测试）

**User（提示词/原意）**  
- 按所有设计使用的流程完整测试；review 代码测试响应是否符合设计意图。

**Assistant（实现前说明）**  
- 无浏览器 E2E 环境时：对照 F1–F11 设计矩阵做静态审查 + Node 仿真（填满/溢出/拖动/可见列/key）；查侧栏与手动宽交互。

**Assistant（实现后说明 / 本轮结论）**  
- 仿真 24/24 通过；流程对照见 Canvas `datatable-column-width-review`。  
- **缺口已修**：容器 ResizeObserver（侧栏）原先保留 `columnWidths`，不符合「开关右侧栏整表重算」→ 现同时清空手动列宽与 intrinsic。  
- **需手测**：实机拖拽、侧栏动画、粘性表头（本环境无运行中 Web）。  
- 低风险：StatusBadge padding 未计入 samples；line-items Item 的 `maxWidth:40ch`。

**关联**  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`  
- Canvas: `datatable-column-width-review.canvas.tsx`

---

### 2026-07-16（全产品工作流清单 + 开始逐域审查）

**User（提示词/原意）**  
- 不仅表格列宽：App 与 Web 全功能流程；先列出所有工作流程，再依次测试与 review。

**Assistant（实现前说明）**  
- 从 Expo Router `app/` 全量路由 + feature flags + PRD/TESTING_GUIDE 建域级清单；静态审查优先（无登录 E2E）；先审 Auth/Space/Expenses。

**Assistant（实现后说明 / 本轮结论）**  
- 已建 10 域 / ~24 条主工作流清单与进度 Canvas `full-product-workflow-review`。  
- D1–D3 已审：P0 邀请深链（已登录 Continue→login 丢 invite；login 不读 inviteId）；P1 Replace Do not replace(save)、price/unitPrice 防护。  
- 下一轮 D4→D10；Inventory 默认 flag 关列为阻塞。未改业务代码（待用户指示是否先修 P0）。

**关联**  
- Canvas: `full-product-workflow-review.canvas.tsx`  
- 审查范围：`login`/`invite`/`receipt-details`/`chat-to-log`/`management` 等

---

### 2026-07-16（修复 D1–D3 P0/P1 + 继续 D4–D10）

**User（提示词/原意）**  
- 修复，然后继续。

**Assistant（实现前说明）**  
- 先修邀请流、receipt Do not replace(save)、price/unitPrice、设密 signOut、register 透传 inviteId；再审 Income/Settings/Tax/Firm/Chat/Web 并修清晰 P1。

**Assistant（实现后说明 / 本轮结论）**  
- **已修**：`invite/[id|token]`→`/handle-invitations`；`login` 消费 `inviteId`/pending；`receipt-details` Do not replace(save)=keep_original；price/unitPrice/`pcs`；`set-password` signOut；`register` 透传 inviteId；`invoice-details` price+英文 UI；`management` 切空间同步+事件；`_layout` details type 映射与 settings FAB；Firm QR 英文；`DataTable` section amount 防护。  
- **已审无阻断**：D6 Tax、D10 Web 壳。  
- **残留 P2**：invoices random key、order 遗留路由、详情默认关栏等。  
- **验证建议**：已登录点邀请 Continue；费用 Confirm 撞名后 Do not replace；桌面切空间侧栏刷新。

**关联**  
- `login.tsx`、`invite/*`、`receipt-details`、`invoice-details`、`chat-to-log`、`management`、`_layout`、`DataTable`、`firm/clients*`  
- Canvas: `full-product-workflow-review.canvas.tsx`


### 2026-07-16（D4–D8/D10 静态代码审查）

**User（提示词/原意）**  
- 审查 vouchap-app：D4 Income、D5 Settings、D6 Tax、D7 Firm、D8 Chat shell、D10 Web shell；找 P0/P1/P2、中文 UI、null toFixed、导航、replace-modal；跳过 Inventory；最多 20 条发现。

**Assistant（实现前说明）**  
- 无代码变更；静态 grep/读关键路径：invoice-details、invoices、chat-to-log、management、tax-filing/**、firm/**、_layout、WebSidebar、FirmPendingOverlay。

**Assistant（实现后说明 / 本轮结论）**  
- 产出最多 20 条中文 findings（见本轮对话）；无 P0；P1：invoice-details 空 price.toString/中文 UI、management 桌面切空间可关掉刷新弹窗导致侧栏/壳状态陈旧。  
- Looks OK：invoice Replace Do not replace(save)、invoices AmountText、chat-to-log invoice 金额防护、client→firm/engagement+viewerRole、FirmPendingOverlay 英文、WebSidebar firm/client 分支、tax iOS setOptions 已避让。  
- Inventory 按要求跳过。

**关联**  
- `invoice-details/[id].tsx`、`management.tsx`、`_layout.tsx`、`firm/clients.tsx`

---

### 2026-07-16（版本 2.6.5 + EAS production 全平台构建）

**User（提示词/原意）**  
- 更新版本号，然后 commit 和推送 expo 构建全平台 production。

**Assistant（实现前说明）**  
- 自 2.6.4 / Build 54 升至 2.6.5 / Build 55；同步 package.json、package-lock、app.json、app.config.js、android build.gradle、ios Info.plist；提交信息按准则；push 后 `eas build --platform all --profile production`。

**Assistant（实现后说明 / 本轮结论）**  
- 本地先 bump 为 2.6.5 / Build 55 并 commit/push（`1e8ec5a`）。  
- EAS `production` + `appVersionSource: remote` + `autoIncrement` 实际远程递增为 **Android versionCode 59**、**iOS buildNumber 42**；本地已再同步这两值。  
- 构建已提交并排队：  
  - Android: https://expo.dev/accounts/aimlink/projects/vouchap/builds/175b38c1-2596-4333-b3f2-0037fbddc6f5  
  - iOS: https://expo.dev/accounts/aimlink/projects/vouchap/builds/93517ba7-e39c-49e9-b491-b8a007d66235  

**关联**  
- `vouchap-app/package.json`、`app.json`、`app.config.js`、`android/app/build.gradle`、`ios/Vouchap/Info.plist`

---

### 2026-07-17（App 内 PDF 预览 + 误显音频按钮）

**User（提示词/原意）**  
- App 上 PDF 附件的 receipt 不能应用内预览，点占位区会下载且下载后仍无预览；部分文档附件详情出现播放音频按钮。Web 预览正常，但也有部分 PDF 记录误显音频按钮。要求实现 PDF 在 app 内直接预览。

**Assistant（实现前说明）**  
- 根因：`getChatLogsByReceiptId` / `ByInvoiceId` 把任意 `attachment_url` 映射为 `audioUrl`；原生 `FileDetailModal` 用 WebView 直接加载远程 PDF，Android/部分 iOS 会走系统下载而非内嵌预览。  
- 拟改：chat-logs 仅 `type==='audio'` 才填 `audioUrl`；详情页按 type 过滤；原生先下载再 iOS 本地 WebView / Android PDF.js 内嵌。

**Assistant（实现后说明 / 本轮结论）**  
- 已修 `chat-logs` 映射与 receipt/invoice/inbound 音频按钮条件；`FileDetailModal` 原生 PDF 下载后应用内预览；详情缩略图对 PDF/document 显示文档占位而非坏图。  
- **验证**：真机打开 PDF expense → 点缩略图应见 Loading 后内嵌预览；PDF 记录不应再出现 play 按钮（除非确为语音录入）。Web 仍走原有 object/blob 预览，且误显音频应消失。

**关联**  
- `src/shared-logic/chat-logs.ts`、`FileDetailModal.tsx`、`receipt-details/[id].tsx`、`invoice-details/[id].tsx`

---

### 2026-07-18（拍照异步识别后 receipt 主数据不刷新）

**User（提示词/原意）**  
- App 上提交拍照后，item 识别会异步进行，但 receipt 的数据没有异步更新。

**Assistant（实现前说明）**  
- 怀疑两点：`updateReceipt` 用「当前 session space」过滤，识别期间切空间会导致主表 0 行更新而 `receipt_items` 仍写入；详情页编辑态 / `isNew` 下 realtime 不覆盖 `editedReceipt`，UI 停在 Processing。

**Assistant（实现后说明 / 本轮结论）**  
- `updateReceipt` 改为按单据自身 `space_id` 更新并校验影响行数。  
- 详情页：processing / 识别完成强制同步表单；processing 期间轮询；`isNew` 识别完成后再进编辑。  
- Chat：识别完成后回写 chat log preview，并对 processing 卡片轮询刷新。  
- **验证**：拍照后留在列表/详情/Chat，应看到 Payee/金额/状态与 items 一并从 Processing 变为识别结果。

**关联**  
- `database.ts` `updateReceipt`、`receipt-details`、`invoice-details`、`chat-to-log.tsx`、`chat-logs.ts`

---

### 2026-07-18（启动本地 Web 测试服务器）

**User（提示词/原意）**  
- 运行本地测试服务器。

**Assistant（实现前说明）**  
- 无代码计划；在 `vouchap-app` 执行 `npm run web`。

**Assistant（实现后说明 / 本轮结论）**  
- 8081 已被占用，改在 **http://localhost:8082** 启动。  
- 首启因 `??` 与 `||` 混用 SyntaxError 失败，已给 receipt/invoice details 加括号修复。

**关联**  
- `receipt-details/[id].tsx`、`invoice-details/[id].tsx`

---

### 2026-07-18（Gemini 模型轮询：单模型 429 不应终止整条链路）

**User（提示词/原意）**  
- 模型调用的轮询机制还有问题：limits 还有余量的 text-out 模型还没用完，只有 3.5 Flash 超量，就不再调用而显示 API 可用量不足。（附 AI Studio Rate limits 截图）

**Assistant（实现前说明）**  
- 假设：`recognizeReceiptFromImage` / `recognizeInvoiceFromImage` 在 catch 里把 `quota`/`429` 与 API Key 错误一并 `break`，导致首模 3.5 Flash 限流后不再试 2.5 Flash / Flash Lite 等。  
- 拟改：`vouchap-app/src/shared-logic/gemini.ts` — 按模型额度错误改为 `continue`；仅 API Key/401 才中止。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `isGeminiPerModelQuotaOrRateLimitMessage` / `isGeminiAuthFailureMessage`；支出/收入图片识别循环在 429/quota/resource_exhausted 时继续下一模型；最终仅当 try-order 全部失败才抛「all tried models」额度错误。  
- **验证**：3.5 Flash RPD/RPM 已红、其它 Flash 仍有余量时，识别应落到 2.5 Flash 或 Lite；日志应出现 `quota/rate-limited, next model...`。  
- **残留**：其它识别路径（文档/文本）本就 `continue` 全错误，无需改；产品侧 Client 识别次数拦截与本问题无关。

**关联**  
- `vouchap-app/src/shared-logic/gemini.ts`

---

### 2026-07-22（vouchap-website：替换新 Logo）

**User（提示词/原意）**  
- 设计了新的 logo，给 vouchap-website 替换一下看看效果。（附 512×512 PNG）

**Assistant（实现前说明）**  
- 站点统一引用 `public/logo.png`（Navbar / Footer / Showcase / favicon / auth confirm）。  
- 新图带白底，拟做角点洪水抠白后写入 `logo.png`，旧文件备份为 `logo-prev-20260501.png`，并 bump 缓存参数。

**Assistant（实现后说明 / 本轮结论）**  
- 已替换 `vouchap-website/public/logo.png`（角点去白底、放大至 1024）；备份旧标；Navbar/Footer/Showcase/layout/auth 增加 `?v=20260722a`。  
- **验证**：本地 `npm run dev` → http://localhost:3000 看顶栏与 `/showcase`；暗色模式应无白方块。  
- **残留**：若抠白误伤纸张边缘，可用设计原图再出透明版覆盖。

**关联**  
- `vouchap-website/public/logo.png`、`Navbar.tsx`、`Footer.tsx`、`ShowcaseSlides.tsx`

---

### 2026-07-22（vouchap-website：新 Logo 显示放大约 150%）

**User（提示词/原意）**  
- 新 logo 图片过小，应 150% 左右才合适。

**Assistant（实现前说明）**  
- 无资产替换；仅放大 Navbar / Footer / Showcase / auth confirm 的显示尺寸约 ×1.5。

**Assistant（实现后说明 / 本轮结论）**  
- Navbar：48→72px；Footer：40→60px；Showcase hero/梯形标同步 ×1.5；auth 容器同步。  
- **验证**：刷新 http://localhost:3000 与 `/showcase`。

**关联**  
- `Navbar.tsx`、`Footer.tsx`、`ShowcaseSlides.tsx`、`app/auth/confirm/page.tsx`

---

### 2026-07-22（vouchap-website：压缩顶栏高度、减少 logo 上下留白）

**User（提示词/原意）**  
- 顶栏的高度压缩一点，图片上下留白减小。

**Assistant（实现前说明）**  
- Navbar 现为 `h-20` + 大 logo，透明边距也偏多。拟：`h-14`、logo 贴边；裁剪 `logo.png` 透明边；商店徽章间距略收。

**Assistant（实现后说明 / 本轮结论）**  
- 顶栏 `h-20`→`h-14`，logo `h-12`；裁剪 PNG 透明边并 bump `?v=20260722b`；Login/社交与徽章间距收紧。  
- **验证**：刷新首页顶栏，图标应更贴边、栏更矮。

**关联**  
- `Navbar.tsx`、`public/logo.png`、`StoreDownloadBadges.tsx`

---

### 2026-07-22（vouchap-website：顶栏行高回调，logo 维持 150% 尺寸）

**User（提示词/原意）**  
- 图片现在又太小了，应维持刚才的大小的基础上裁剪减小顶栏行高。且现在行高压缩太过了。

**Assistant（实现前说明）**  
- 上一轮把栏压到 `h-14`、logo 缩到 `h-12`，过紧且图偏小。拟：logo 恢复 `h-[4.5rem]`；栏用介于 `h-20` 与 `h-14` 的 `h-[4.75rem]`。

**Assistant（实现后说明 / 本轮结论）**  
- Navbar：logo `4.5rem`；行高 `4.75rem`（约 76px，略低于原 80px）；字号/右侧控件间距适度恢复。  
- **验证**：刷新首页，logo 应与放大版相当，栏略矮但不挤。

**关联**  
- `vouchap-website/components/Navbar.tsx`

---

### 2026-07-22（aim-link-website：底部友情链接 Vouchap logo 替换）

**User（提示词/原意）**  
- aim.link-website 的底部友情链接的 logo 也替换。

**Assistant（实现前说明）**  
- Footer 使用 `public/assets/partner-vouchap.png`；拟用 vouchap-website 已裁切的新 `logo.png` 覆盖，并略放大显示高度、加缓存参数。

**Assistant（实现后说明 / 本轮结论）**  
- 已替换 `partner-vouchap.png`（旧图备份 `partner-vouchap-prev.png`）；Footer 显示高度 `2.75rem`→`3.5rem`，`?v=20260722b`。  
- **验证**：本地打开 aim-link-website 看页脚 Vouchap 卡片。

**关联**  
- `aim-link-website/public/assets/partner-vouchap.png`、`src/components/Footer.jsx`

---

### 2026-07-22（vouchap-app Web：左上角 logo3 换新标 + 分辨率说明）

**User（提示词/原意）**  
- 用新 logo 替换 vouchap 应用 web 端左上角 logo；是否需要更高分辨率图片？

**Assistant（实现前说明）**  
- Web 侧栏 `WebSidebar` 用 `assets/logo3.png`，显示约 144×144。Retina 约需 ≥288px 源图；现有新标 512/1024 已够，无需更高分辨率。  
- 旧 logo3 为圆裁 + 金描边字标；新标为正方形图标，拟改圆角并去掉金描边。

**Assistant（实现后说明 / 本轮结论）**  
- 已用站上裁切版覆盖 `logo3.png`（备份 `logo3-prev.png`，1024²）；`borderRadius` 72→28；字标去掉金色描边。  
- **分辨率结论**：不需要更高分辨率；侧栏 CSS 144px，1024 源图远超 2x/3x。仅当超大 hero/打印再考虑 2K 或 SVG。  
- **验证**：`npm run web` 看左侧栏品牌区。

**关联**  
- `vouchap-app/src/mobile-ui/assets/logo3.png`、`WebSidebar.tsx`

---

### 2026-07-22（启动 vouchap-app Web 测试服务器）

**User（提示词/原意）**  
- 运行 vouchap 的 web 端测试服务器。

**Assistant（实现前说明）**  
- 无代码变更；在 `vouchap-app` 执行 `npm run web`。

**Assistant（实现后说明 / 本轮结论）**  
- 已启动 Expo Web；见终端输出的 localhost 地址。

**关联**  
- `vouchap-app` `npm run web`

---

### 2026-07-22（vouchap-app Web：侧栏 logo 缩小）

**User（提示词/原意）**  
- 左上角图片过大。

**Assistant（实现前说明）**  
- `WebSidebar` logo 现为 144×144；拟缩到约 72，并略调字标字号/间距。

**Assistant（实现后说明 / 本轮结论）**  
- `logoImage` 144→72，`borderRadius` 28→14；`brandText` 25→20。刷新 Web 即可。

**关联**  
- `WebSidebar.tsx`

---

### 2026-07-22（vouchap-app Web：侧栏 logo 改为 96px）

**User（提示词/原意）**  
- 96px

**Assistant（实现后说明 / 本轮结论）**  
- `logoImage` 设为 96×96（`borderRadius` 18）；字标略调至 22。刷新即可。

**关联**  
- `WebSidebar.tsx`

---

### 2026-07-22（vouchap-app Web：侧栏 Vouchap 字重减轻）

**User（提示词/原意）**  
- logo 下的 Vouchap 名称字体过粗。

**Assistant（实现后说明 / 本轮结论）**  
- `brandText` `fontWeight` 800→600，字距略收。刷新即可。

**关联**  
- `WebSidebar.tsx`

---

### 2026-07-22（vouchap-app Web：侧栏 logo 维持 96px 视觉）

**User（提示词/原意）**  
- web 端左上角图片又变小了，维持 96px。

**Assistant（实现前说明）**  
- `logoImage` 样式已是 96×96；新 `logo3` 画布白边过大，`contain` 下紫标视觉偏小。

**Assistant（实现后说明 / 本轮结论）**  
- 裁切 `logo3.png` 白边并铺满 1024 画布；样式保留 96 并加 `minWidth/minHeight: 96`。刷新 Web 确认。

**关联**  
- `WebSidebar.tsx`、`assets/logo3.png`

---

### 2026-07-22（vouchap-app Web：页签 favicon 对齐 website）

**User（提示词/原意）**  
- web 端浏览器页签上 logo 过小，应跟 website 一样。

**Assistant（实现前说明）**  
- Expo 将 `web.favicon` 缩成 48px `contain`；带大白边的 `logo.png` 会让页签图标过小。

**Assistant（实现后说明 / 本轮结论）**  
- 新增铺满画布的 `assets/favicon.png`（与 `logo3`/`logo.png` 同构图），`app.config.js` 指向它；同步 website `public/logo.png` 并 cache-bust `v=20260722c`；已清 `.expo` favicon 缓存。需重启 `npm run web` 并硬刷新。

**关联**  
- `app.config.js`、`assets/favicon.png`、`vouchap-website/app/layout.tsx`

---

### 2026-07-22（favicon：去掉白边并统一 website / web app）

**User（提示词/原意）**  
- vouchap-website 的 favicon 刚才很完美，现在却有白边；web 端应用 favicon 仍不一致。

**Assistant（实现前说明）**  
- 先前用不透明白底图覆盖了网站透明标；Expo 又用 `contain` 从带白边源图生成页签图标。

**Assistant（实现后说明 / 本轮结论）**  
- 从源图角点 flood-fill 重建 **RGBA 透明、铺满** 的 `logo.png`/`favicon.png`/`logo3.png`；website 与 app 同源。  
- 写入 `vouchap-app/public/favicon.ico`（Expo 优先用 public 下用户 ico，不再二次 contain）与 `vouchap-website/public/favicon.ico`；website metadata `v=20260722d`。  
- 需重启 website / `npm run web`，硬刷新页签（必要时清站点数据）。

**关联**  
- `public/favicon.ico`、`assets/favicon.png`、`vouchap-website/public/logo.png`、`layout.tsx`

---

### 2026-07-22（确认全端新 logo + 全平台 production 构建）

**User（提示词/原意）**  
- 确认 logo 已全部更换，然后构建全平台 production。

**Assistant（实现前说明）**  
- 核对 app/website/原生图标/aim-link partner；用铺满构图刷新 `logo2` 并 `icons:sync`；再 EAS iOS+Android production、`expo export -p web`、website `next build`。

**Assistant（实现后说明 / 本轮结论）**  
- Logo 确认：`logo/logo3/favicon` 同源透明新标；`logo2`/AppIcon/mipmap 已同步新税票标；website + public favicon.ico；partner 已对齐。  
- Web：`expo export` → `dist/`（含新 logo 与 favicon.ico）成功；website `next build` 成功。  
- EAS production：iOS **2.6.5 (43)** 已完成；Android **versionCode 60** 构建中/待完成。本地 buildNumber/versionCode 已对齐 43/60。  
- 链接见回复正文。

**关联**  
- EAS iOS `10461115-…` / Android `a47c2e13-…`

---

### 2026-07-22（vouchap-app：移动端 logo 全量替换为新图标）

**User（提示词/原意）**  
- 移动端 app 的 logo 也全部替换成新图标；若需更高分辨率用附图。

**Assistant（实现前说明）**  
- 附图文件名含 2048，实为 JPEG 1024×1024；`logo.png`（登录等）、`logo2.png`/`icon.png`（启动器）、`logo3.png`（Web 侧栏）仍多为旧标。拟用附图作源：1024→`logo`/`logo3`，放大 2048 不透明→`logo2`/`icon`，再跑 `sync-native-launcher-icons-from-logo2.sh`。

**Assistant（实现后说明 / 本轮结论）**  
- 已备份 `logo-prev` / `logo2-prev` / `icon-prev`；用附图生成新 `logo.png`、`logo3.png`（1024）、`logo2.png`、`icon.png`（2048 不透明）。  
- 已同步 iOS `AppIcon` 1024 与 Android 各 `mipmap-*` launcher webp。  
- 代码引用路径未改（仍 `require(.../logo.png)` 等）。桌面图标需重新安装/构建原生包才更新；登录页等热更新可见。  
- 附图并非真 2048；启动器用 Lanczos 放大至 2048。曾误用 flood-fill 伤色已回退为干净不透明 PNG。

**关联**  
- `vouchap-app/src/mobile-ui/assets/{logo,logo2,logo3,icon}.png`  
- `scripts/sync-native-launcher-icons-from-logo2.sh`  
- `ios/.../AppIcon.appiconset/`、`android/.../mipmap-*/`

---

### 2026-07-22（vouchap-website：营销截图 / logo 修图替换）

**User（提示词/原意）**  
- vouchap-website 中用到的界面截图、logo 需全部更换；根据新 logo 图片以及 web 端实现效果，直接修图实现。

**Assistant（实现前说明）**  
- 营销站 `public/logo.png` 已是新税票标；`public/logo3.png` 仍为旧标；`public/vouchap_landing_assets/*.png` 9 张产品截图侧栏/邀请页仍为旧金盾或紫盾 AI 标。  
- 拟对照 WebSidebar（logo3 +「Vouchap」字标）与 `client-join`（64 圆角标在上、firm 名在下）用 PIL 合成替换；备份旧图；bump `ASSET_V` / logo cache。

**Assistant（实现后说明 / 本轮结论）**  
- 已修图替换 7 张桌面截图侧栏旧金盾 → 新税票 logo +「Vouchap」字标；邀请页 `web_secure_portal_invite.png` 仅替换标题上方旧标区域（标题像素保持不变）。  
- `web_cody_assistant.png` 无产品标（助手头像），未改。  
- 同步 `public/logo3.png`、重生成 `favicon.ico`；`ASSET_V=20260722`；logo cache `20260722e`。  
- 旧图备份：`public/vouchap_landing_assets/_prev_20260722/`。  
- **验证**：硬刷新营销站首页 / Hero / TaxPainSolutions / Firm invite；确认侧栏与邀请页均为新标。  
- **残留**：截图整体 UI 仍为历史界面（非现网实时截屏）；仅品牌标被替换。若需与现网像素级一致，需登录 platform 重截。

**关联**  
- `vouchap-website/public/vouchap_landing_assets/`、`public/logo.png`、`public/logo3.png`、`public/favicon.ico`  
- `lib/landingAssets.ts`（`ASSET_V`）

---

### 2026-07-22（vouchap-website：撤销截图贴图覆盖）

**User（提示词/原意）**  
- 不是 p 图而是贴图覆盖，效果不行；去除这次修改，后续手动重新截图替换。

**Assistant（实现前说明）**  
- 无新实现；从 `_prev_20260722` 恢复 9 张 landing 截图；回滚 `ASSET_V` / logo cache；`logo3`/`favicon` 恢复 git HEAD；删除备份目录。

**Assistant（实现后说明 / 本轮结论）**  
- 9 张 landing 截图已从备份恢复为贴图前原件；已删 `_prev_20260722`。  
- `ASSET_V` 仍为 `20260502`；品牌 logo cache（`20260722e`）与 git HEAD 品牌提交保持一致，未回滚。  
- 用户后续自行重截并替换 `public/vouchap_landing_assets/` 后需再 bump `ASSET_V`。

**关联**  
- `vouchap-website/public/vouchap_landing_assets/`、`lib/landingAssets.ts`

---

### 2026-07-22（vouchap-website：Hero 空白恢复）

**User（提示词/原意）**  
- Hero 区内容缺失了，检查恢复。

**Assistant（实现前说明）**  
- 排查 Hero 文案/图是否被删；对照 DOM 与截屏；怀疑 framer-motion `opacity:0` + 开发服 chunk 异常。

**Assistant（实现后说明 / 本轮结论）**  
- 根因：本地 Next `.next` 与 dev server 不同步，`main-app.js` 等 chunk 404 → 客户端未水合；Hero 的 `motion.div` 初始 `opacity:0` 无法 animate，首屏空白。  
- 修复：`Hero.tsx` 初始改为可见（`opacity:1`，仅轻微位移动画）；清理 `.next` 并重启 `npm run dev -p 3000`。  
- 验证：Playwright 下 Hero 文案与邀请截图可见，`_next` chunk 无 404。硬刷新浏览器即可。

**关联**  
- `vouchap-website/components/Hero.tsx`

---

### 2026-07-22（vouchap-website：顶栏/页脚 logo 略缩小）

**User（提示词/原意）**  
- 顶栏和脚部的新 logo 太大了一点，略微缩小。

**Assistant（实现前说明）**  
- Navbar 现 `h-[4.5rem]`（约 72px），Footer `h-[3.75rem]`（约 60px）；拟各缩约一档。

**Assistant（实现后说明 / 本轮结论）**  
- Navbar：logo `3.75rem`（60px），栏高 `4.25rem`。  
- Footer：logo `h-12`（48px）。  
- 硬刷新即可看效果。

**关联**  
- `components/Navbar.tsx`、`components/Footer.tsx`

---

### 2026-07-23（vouchap-app：发布 2.6.6 全平台 production 构建）

**User（提示词/原意）**  
- vouchap 版本号更新为 2.6.6，重新全平台构建 production。

**Assistant（实现前说明）**  
- 自 2.6.5 / iOS 43 / Android 60 递增为 2.6.6 / 44 / 61；同步 package.json、lock、app.json、app.config.js、build.gradle、Info.plist；commit+push 后 `eas build --platform all --profile production`。

**Assistant（实现后说明 / 本轮结论）**  
- 版本文件已更新并 push：`发布版本号 2.6.6 (Build 44/61)`（EAS remote 亦自增至 iOS 44 / Android 61）。
- Android：https://expo.dev/accounts/aimlink/projects/vouchap/builds/1ff3d66a-d4cc-4055-a615-aef66de27020
- iOS：https://expo.dev/accounts/aimlink/projects/vouchap/builds/a106f13b-fef7-47e5-af9d-5467431f6053

**关联**  
- `vouchap-app` 版本文件、EAS production

---

### 2026-08-21（Wholestore：CLI 推送 provider catalog/orders SQL）

**User（提示词/原意）**  
- 你用 cli 推送 sql。

**Assistant（实现前说明）**  
- 仅对 Wholestore 项目 `foyecolycmxcneflpant` 执行 `030_provider_catalog_orders.sql`；不碰 Vouchap `giuacjbfsyrristkigmz`。Wholestore 缺 `supabase/.temp/project-ref`，CLI `--linked` 认不出项目，先补 ref 再 `db query`。

**Assistant（实现后说明 / 本轮结论）**  
- 已用 `supabase db query --linked --workdir apps/wholestore-app` 推送 `20260822000000_provider_catalog_orders.sql`。  
- 推送前核对 schema 仅有 `provider`/`consumer`、无 `firm`。  
- 远程已有 `provider.skus` / `orders` / `order_lines`（均 RLS）；`provider.consumers.consumer_space_id` 可空，并有 `contact_name` / `contact_email`。  
- 已 `NOTIFY pgrst, 'reload schema'`。刷新 Dealers / Orders / Catalog 即可。未 git commit。

**关联**  
- `Adaven-platform/apps/wholestore-app/supabase/migrations/20260822000000_provider_catalog_orders.sql`  
- `packages/db-platform/sql/030_provider_catalog_orders.sql`

---

### 2026-08-21（Adaven-platform：内核一升同升、发版各自独立）

**User（提示词/原意）**  
- 代码库结构要有公共基础，但应用版本发布各自独立。  
- 确认理解：第一层即可；内核一升同升、不需差分版本，只是不一定同步都发布。按这个理解配置到位。

**Assistant（实现前说明）**  
- 不拆仓、不上 Changesets / 分叉 `@adaven/*` 版本。npm workspaces 继续始终链接 HEAD。  
- 发版耦合来自 Cloudflare Git 自动构建（尤其 watch `packages/**`）。改为 Pages Direct Upload，`git push` 不部署。  
- 改 `docs/PUBLISH.md`、两套 DEPLOY 文档、ARCHITECTURE、README、wrangler 注释、Cursor 规则；Dashboard 的 Disconnect Git 需用户在控制台点一次。

**Assistant（实现后说明 / 本轮结论）**  
- 发版契约已写入 `docs/PUBLISH.md`：内核共用 HEAD；Web 只跑 `npm run vouchap:deploy:web` / `wholestore:deploy:web`。  
- 禁止把 Pages `vouchap` / `wholestore` 接到 Git；Vouchap 若仍连旧仓 `AI-Tax-filing`，需在 Dashboard **Disconnect**，否则旧仓 push 仍会覆盖线上。  
- 规则：`.cursor/rules/independent-release.mdc`。去掉无用的 `changeset` 脚本。  
- 代码仓库配不到 Cloudflare 开关；用户需在 Dashboard 断开 Vouchap 的 Git 连接。未 git commit。

**关联**  
- `Adaven-platform/docs/PUBLISH.md`、`docs/ARCHITECTURE-PLATFORM.md`、`.cursor/rules/independent-release.mdc`

---

### 2026-08-21（Wholestore：Dealer/Order 双向 + SKU Marketplace）

**User（提示词/原意）**  
- dealer 和 order 数据复用 Vouchap 应用的双向数据模式，即 factory 端的 dealer 关联另一个 space（consumer 类的 space），order 是供需双方的共同数据。sku 是 provider 数据，可发布给 consumer 在 Marketplace 查阅和选择。

**Assistant（实现前说明）**  
- 对照 Vouchap `firm.clients.client_space_id`、共享 `firm.orders`、`list_published_skus_for_client_catalog` / `client_create_onboarding_order_from_published_sku`；不抄 WBS、税务、双重确认、`order_managers`。  
- 拟加 `031` SQL（仅 Wholestore）：enrollment 回填 `orders.consumer_space_id`；SKU 已发布才对已关联 Dealer 可见；跨厂 Marketplace 用 DEFINER RPC；Factory 代建 Dealer space + admin 邀请；Dealer 下单按厂拆单。  
- 应用：Dealers 显示 Linked/No space；Consumer 侧栏 Marketplace + Orders；订单页按空间种类分视角。

**Assistant（实现后说明 / 本轮结论）**  
- SQL `packages/db-platform/sql/031_bidirectional_dealer_orders_marketplace.sql` 已用 CLI 推到 **仅** `foyecolycmxcneflpant`（无 `firm` schema）；`NOTIFY pgrst`。  
- RPC：`create_dealer_with_space`、`list_published_skus_for_marketplace`、`consumer_create_order_from_published_skus`、`claim_pending_dealer`（认领 pending 暂无独立 UI）。  
- Factory 填邮箱代建 consumer space 并发管理员邀请；不填则 pending、无 space，该 Dealer 看不到订单直到关联。  
- Marketplace 多厂选 SKU → 每厂一张共享 onboarding 订单。Consumer 只读订单，onboarding 可取消。  
- 验证：Factory 发布 SKU → Dealer Marketplace 可见并下单；双方 Orders 看到同一行。未 git commit。未部署 Web。

**关联**  
- `Adaven-platform/packages/db-platform/sql/031_bidirectional_dealer_orders_marketplace.sql`  
- `apps/wholestore-app/src/lib/consumer.ts`、`src/app/marketplace/index.tsx`

---

### 2026-08-21（Wholestore：取消代建；Factory 不可自建订单）

**User（提示词/原意）**  
- 回顾 Vouchap 已取消代建以免垃圾 space；Factory–Dealer 更不该代建。  
- 按回顾方案继续规范，并更硬一点：Factory 侧不能自建订单（Vouchap 仍保留 Firm 可建订单）。

**Assistant（实现前说明）**  
- 对齐 Vouchap `createInviteeOnly` / `createPendingOrderForInvitee`：Add dealer 只写 pending enrollment，不 `INSERT spaces`。  
- 订单唯一创建路径：Dealer Marketplace RPC。RLS 禁止 authenticated 直接 INSERT `provider.orders`。  
- 认领：邮箱匹配 pending + `claim_pending_dealer`；Marketplace 下单时自动认领。

**Assistant（实现后说明 / 本轮结论）**  
- SQL `032_no_on_behalf_dealer_factory_orders.sql` 已推到 Wholestore `foyecolycmxcneflpant`；`NOTIFY pgrst`。未动 Vouchap。  
- `create_dealer_with_space` 改为只建 pending（必填 email、不建 space）。`orders_insert` WITH CHECK false。  
- 去掉 Factory Add order / `NewOrderModal` / `createOrder`。Dealer Dashboard 可 Link 匹配邮箱的 pending。  
- Factory 仍可处理已有订单（改状态、改行项目）。未 git commit。未部署 Web。

**关联**  
- `packages/db-platform/sql/032_no_on_behalf_dealer_factory_orders.sql`  
- `apps/wholestore-app/src/app/orders/index.tsx`、`src/app/dealers/`、`src/lib/consumer.ts`

---

### 2026-08-21（启动 Adaven-platform 中 Vouchap 测试服务器）

**User（提示词/原意）**  
- 把 Adaven-platform 项目中的 Vouchap 应用的测试服务器也启动。

**Assistant（实现前说明）**  
- 无代码变更。Wholestore Web 已占用 `8081`；在 `apps/vouchap-app` 用 `expo start --web --port 8082` 另起 Vouchap，避免抢端口。`.env` 指向 Vouchap Supabase `giuacjbfsyrristkigmz`。

**Assistant（实现后说明 / 本轮结论）**  
- 已后台启动；Metro 监听 **http://localhost:8082**。未打开浏览器（`BROWSER=none`），以免覆盖 Wholestore 标签。  
- Wholestore 仍在 `http://localhost:8081`。两套测服可并行。

**关联**  
- `Adaven-platform/apps/vouchap-app` → `npm run web -- --port 8082`

---

### 2026-08-21（Wholestore：海报 Marketing + 专卖店 Marketplace + 邀请只认领）

**User（提示词/原意）**  
- 公开邀请必须选海报。  
- Marketplace 先做成专卖店：先看各厂介绍海报，再进单一供应商商品列表；预留以后多厂 SKU 平铺大市场。  
- 一厂一张默认海报、挂上全部已发布 SKU；没有 featured 时用默认海报。  
- Factory 端增加 Marketing 模块，管理海报和发布。  
- 结合此前对齐：邀请只建关系、接受不建订单；海报与商品 SKU 为独立 M:N。

**Assistant（实现前说明）**  
- SQL `034`：`provider.posters` + `poster_skus`；每厂一张 `is_system_default`、至多一张 `is_marketplace_featured`；SKU 发布/下架同步默认海报。  
- `dealer_invite_tokens` 去掉 `sku_id`，改为必填 `poster_id`；`dealer_accept_invite_token` 只认领。  
- Marketplace RPC：`list_marketplace_factory_posters` / `list_store_skus_for_factory`（featured 已发布否则默认）。  
- 应用：Factory 侧栏 Marketing；Open invite Step 1 选海报；Dealer 先厂海报再店铺下单。

**Assistant（实现后说明 / 本轮结论）**  
- SQL `034_posters_marketing_storefront.sql` 已用 CLI 推到 **仅** `foyecolycmxcneflpant`；`NOTIFY pgrst`。未动 Vouchap。  
- 已有 Factory 回填默认海报；旧 open-invite token 迁到该厂默认海报，无法映射的 token 删除。  
- Factory：Catalog 只管 SKU 主数据；Marketing 管海报、发布、Marketplace 店招、自定义海报勾选 SKU。默认海报 SKU 自动维护、不可删。  
- Open invite 必选已发布海报；Accept 只 enrollment，落地页展示海报介绍 + SKU 摘要，成功后回 Dashboard。  
- Marketplace 两步：工厂海报网格 → `/marketplace/[providerSpaceId]` 店铺 SKU + 购物车（仍走 `consumer_create_order_from_published_skus`）。原全站 SKU 平铺 RPC 保留未接 UI。  
- 验证：Factory Marketing 见默认海报；发布 SKU 后默认海报自动带上；Dealer Marketplace 先见厂海报再进店下单；Open invite 不选海报无法生成。未 git commit。未部署 Web。

**关联**  
- `Adaven-platform/packages/db-platform/sql/034_posters_marketing_storefront.sql`  
- `apps/wholestore-app/src/app/marketing/`、`src/app/marketplace/`、`src/lib/posters.ts`

---

### 2026-08-21（Wholestore：定向邀请绑海报；橱窗可看不可买）

**User（提示词/原意）**  
- 定向邀请也需要选定关联的海报。  
- Dealer Marketplace「先进店再下单」理解有误：从工厂展示海报是申请成为经销商，不是直接下单。已绑定的厂才是专卖店；未绑定只是橱窗，可看不可买。

**Assistant（实现前说明）**  
- SQL `035`：`provider.consumers.poster_id`；`create_dealer_with_space` 必填已发布海报。  
- 下单 RPC 取消自动认领/自动建 enrollment，仅 `approved` + 已绑 space 可下单。  
- 新增 `dealer_apply_to_factory`：橱窗申请（已有定向邮箱邀请则直接认领为 approved）。  
- Marketplace 海报带 `relation_status`（none/pending/enrolled）。Factory 详情对「已申请未批准」提供 Approve。

**Assistant（实现后说明 / 本轮结论）**  
- SQL 已推到 **仅** `foyecolycmxcneflpant`。Add dealer 必须选海报，右侧预览介绍 + SKU。  
- Marketplace 卡片标 Showcase / Application sent / Your store。未绑定厂页可浏览 SKU、按钮 Apply；申请后等 Factory 批准；已绑定才显示购物车下单。  
- 若 Factory 已用同一邮箱发过定向邀请，Dealer 在橱窗点 Apply 会直接认领并开通店铺。  
- 验证：Add dealer 不选海报不能保存；未绑定 Dealer 点 Place order 应被 RPC 拒绝；申请后 Factory Dealers 详情可 Approve。未 git commit。未部署 Web。

**关联**  
- `packages/db-platform/sql/035_directed_invite_poster_showcase.sql`  
- `apps/wholestore-app/src/components/FactoryAddDealerModal.tsx`、`src/app/marketplace/`

---

### 2026-08-21（Dealer 视角：无 Marketplace；供应商模块分店门与橱窗）

**User（提示词/原意）**  
- 从 dealer 的视角，现阶段不存在 marketplace。  
- 应是供应商模块展示各专卖店，其中有入口可以去寻找更多的供应商。  
- 专卖店的店门与展示的橱窗不需并列。  
- 文案上供应商也不应特指 factory。

**Assistant（实现前说明）**  
- 侧栏与主入口改为 `/suppliers` +「Suppliers」。主列表只显示 `relationStatus === enrolled` 的专卖店；「Find more suppliers」进 `/suppliers/discover` 只显示橱窗/申请中。  
- 详情 `/suppliers/[id]`：已绑定可下单，未绑定仅橱窗 + Apply。旧 `/marketplace` 做 Redirect。  
- Dealer 可见文案用 supplier / store / showcase，不写 Marketplace、不特指 factory。API/RPC 名保持 marketplace/factory。  
- Factory 端「Marketplace」作为 featured 海报标签改为 Featured，避免暗示存在 Marketplace 模块。

**Assistant（实现后说明 / 本轮结论）**  
- 新路由：`src/app/suppliers/index.tsx`（店门）、`discover.tsx`（橱窗）、`[providerSpaceId].tsx`（店或橱窗）。  
- `marketplace/*` Redirect 到 `/suppliers`。侧栏 Dealer：Suppliers。Dashboard 卡改为 Suppliers + 已绑店数。  
- dealer-join：Supplier invite；接受后去 `/suppliers`。订单表 Dealer 列「Supplier」。  
- 无新 SQL。未 git commit。未部署 Web。  
- 验证：Dealer 侧栏无 Marketplace；Suppliers 网格只有已绑店；点 Find more suppliers 才见橱窗；橱窗页不能下单；旧 `/marketplace` 会跳转。

**关联**  
- `Adaven-platform/apps/wholestore-app/src/app/suppliers/`  
- `src/bootstrap.ts`、`src/app/index.tsx`、`src/app/dealer-join.tsx`

---

### 2026-09-07（右侧栏预览：PDF 点不开 / 图片只有空框 —— 定位到真正根因）

**User（提示词/原意）**
- 「历史记录有加载，但右侧栏的预览问题仍在，图片预览出来了个框但没有成功预览，pdf 仍点不开。」

**Assistant（实现前说明）**
- 前几轮一直在改「预览浮窗挂在哪、用 RN Modal 还是 DOM 元素、尺寸怎么算」，方向错了：那些改动不可能影响「点击无反应」。
- 本轮改为从数据链路回溯：先确认历史消息还原出来的 URL 到底有没有值，再确认 URL 能不能被浏览器取到。
- 预计触碰 `chat-to-log.tsx`（`restorePromptFromLog`）、`AttachmentImagePreviewModal.tsx`、`FileDetailModal.tsx`。

**Assistant（实现后说明 / 本轮结论）**
两个问题是**互相独立的两个根因**，都不在渲染层：

1. **PDF 点不开 = 气泡处于 disabled**。`ChatLog.type` 定义为 `image | text | audio | document | attachment`，PDF/Office 上传时写入的是 `document`（无法识别类型写 `attachment`，见 `saveChatLog` 各调用点）。但 `restorePromptFromLog` 只在 `type === 'image'` 分支里赋 `documentUrl` / `imageUrl`，导致 document/attachment 记录还原后两个 URL 都是 `undefined`；气泡靠文件名正则仍然画了出来，但 `disabled={!(documentUrl || imageUrl)}` 为真，点击**完全不触发 onPress**。已改为 `image | document | attachment` 都还原 URL，且 document/attachment 一律走 `documentUrl`。
2. **图片只有空框 = 资源 403**。`tax-filing` 是私有 bucket，公共 URL 取不到，必须 `createSignedUrl`。此前只有 `FileDetailModal` 的 PDF 分支调了 `getTaxFilingViewUrl`，图片路径（`AttachmentImagePreviewModal` 与 `FileDetailModal` 的 image 分支）都在用原始 URL，`<img>` 拿到了尺寸但加载失败，所以是「有框没图」。两处均改为异步换签名 URL；`getTaxFilingViewUrl` 对非 tax-filing URL 与签名失败都返回原 URL，故对 receipts 等公共 bucket 无副作用。另给图片预览加了 `onError` 兜底文案，避免以后再出现「空框且无任何提示」。

**验证**
- `tsc --noEmit`：`src/mobile-ui` 无新增错误（余下为仓库既有的 RN 类型定义问题，如 `Image.onLongPress`）。
- `expo export -p web` 构建通过。
- 从**打包产物**中抽出 minified 的 `restorePromptFromLog` 实际执行六种日志形状：tax-filing PDF、expense PDF、无扩展名 attachment 三种从修复前的 `clickable=false` 变为 `true` 并带出 `documentUrl`；普通图片仍走 `imageUrl`；伪装成 image 的 PDF 走 `documentUrl`；语音不受影响。
- 未 git commit，未部署。签名 URL 的 403 场景需线上账号复验。

**关联**
- `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`（`restorePromptFromLog`）
- `vouchap-app/src/mobile-ui/components/AttachmentImagePreviewModal.tsx`
- `vouchap-app/src/mobile-ui/components/FileDetailModal.tsx`
- `vouchap-app/src/shared-logic/chat-logs.ts`（`ChatLog.type` 取值定义）

---

### 2026-09-07（右侧栏图片预览：临时附件已被清理导致 404）

**User（提示词/原意）**
- 「右侧栏 pdf 预览已正常，图片预览仍有问题（如图），按说跟详情页内应该是完全一样的组件和机制。」（附 Expenses 页截图，预览浮窗显示 "Preview unavailable"）

**Assistant（实现前说明）**
- 用户判断正确：组件与机制确实完全相同，所以差异只可能在**传进去的 URL**。且本次是 Expenses（`receipts` 公共 bucket），排除上一轮的私有 bucket 签名问题。
- 上一轮加的 `onError` 提示正好证明了 `<img>` 是加载失败而非渲染失败，据此往上游查 URL 来源。

**Assistant（实现后说明 / 本轮结论）**
- 根因：图片上传到 `{spaceId}/temp/{name}.{ext}` 后写入聊天日志（`requestData.imageUrl`）；识别完成时 `receipt-processor.ts` 会 `uploadReceiptImage` 转存到正式路径 `{spaceId}/receipt_{id}.{ext}` 并 **`deleteTempFile` 删除临时文件**。于是历史记录里的图片 URL 指向一个已不存在的对象 → 404 → 空白预览框；详情页正常是因为它读的是单据表的 `image_url`。
- 同一段代码里 `source.kind === 'document'` 分支只是 `finalImageUrl = source.fileUrl`，既不转存也不删除，这正好解释了「PDF 修好后正常、图片仍坏」。
- 修复：新增 `src/shared-logic/chat-attachment-urls.ts`，`resolveVoucherImageUrls(logs)` 对**附件仍指向 `/temp/`** 的日志，按 `receiptId / invoiceId / inboundId / outboundId` 批量回查 `receipts / invoices / inbound / outbound` 的 `image_url` 并覆盖。`restorePromptFromLog` 增加可选入参 `resolvedImageUrl` 优先使用。两个历史加载路径（首屏与分页）都接上，并在 await 后复检 `historyLoadSeqRef`，避免切换项目/类型时的竞态。
- 该修复对**已有历史记录同样生效**（正式图仍在单据表里），无需数据迁移。单据尚未识别完成（`image_url` 为空或仍是 temp）时不覆盖，此时临时文件还在，原 URL 可用。

**验证**
- `tsc --noEmit`：改动文件无新增错误。
- 用 mock Supabase 客户端 esbuild 打包后**实跑** `resolveVoucherImageUrls`：temp→正式替换、单据不存在/未识别完成/非 temp URL/纯文本日志均正确跳过；查询只针对 temp 日志发出，无匹配日志的表不查询。
- `expo export -p web` 构建通过，产物中确认包含新逻辑。

**关联**
- `vouchap-app/src/shared-logic/chat-attachment-urls.ts`（新增）
- `vouchap-app/src/shared-logic/receipt-processor.ts`（根因所在，未改动）
- `vouchap-app/src/mobile-ui/app/chat-to-log.tsx`

---

### 2026-09-08（Expenses items 列表只显示到 7/24：PostgREST 1000 行上限静默截断）

**User（提示词/原意）**
- 「发现明显 bug：expenses 的 items 列表模式，只列出了 7 月 24 日之前的 items。分析下原因，vouchap 和 portalflow 应同步修复。」

**Assistant（实现前说明）**
- 「只到某个日期」是典型的**行数上限截断**而非过滤条件错误：若是日期过滤 bug，边界通常落在业务含义明确的位置，而不是一个任意日期。
- 先核对 `getAllReceiptLineItemsForList` 的查询是否带分页。

**Assistant（实现后说明 / 本轮结论）**
- 根因：`getAllReceiptLineItemsForList`（`database.ts`）用 `.select(...).eq('receipts.space_id', spaceId)` 一次性取全部明细，**既没有 `.range()` 也没有 `.order()`**。PostgREST 单请求最多返回服务端 `max-rows`（Supabase 默认 **1000**）行，超出部分**静默丢弃，不报错**。由于没有排序，返回的大致是最早插入的那批，于是表现为「只列出 7/24 之前的 items」——7/24 只是第 1000 行恰好落到的位置，与业务无关。
- 明细行数是小票数的数倍，所以 records 模式看起来正常、items 模式先撞上限，这也解释了为什么只有 items 列表出问题。
- 修复：新增 `src/shared-logic/supabase-paging.ts` 的 `fetchAllPages`，`getAllReceiptLineItemsForList` 改为翻页取全并按 `id` 稳定排序。顺带修了同一页面的 `getAllReceiptsForList`（同样无分页，小票数过千后会同样静默丢数据；`created_at` 不唯一，补 `id` 次级排序保证翻页不重不漏）。
- `fetchAllPages` 只在**返回空页**时停止，而非「不足一页」——若服务端 `max-rows` 小于请求页大小，用「不足一页」判断会再次造成截断。代价是每次全量查询多一次返回空的轻量请求。
- `getReceiptsForListFirstPaint` 的 `FIRST_PAINT_LIMIT` 是有意的首屏限制，未改动。Income 的明细按单张发票查询（`.eq('invoice_id', ...)`），不受此上限影响。
- **Portalflow 已同步**：`Adaven-platform/apps/portalflow-app/src/shared-logic/` 应用了逐字符相同的改动（已用 diff 比对确认一致）。

**验证**
- 两仓库 `tsc --noEmit` 对改动文件均无错误；两仓库 `expo export -p web` 均构建通过。
- `fetchAllPages` 用模拟 PostgREST（可配置服务端 max-rows）实跑：2500 行/上限 1000 取全且无重无漏；**服务端上限 500 小于请求页大小 1000 时仍能取全**；整页倍数、不足一页、空表、错误立即中断、maxPages 防失控均通过。

**关联**
- `vouchap-app/src/shared-logic/supabase-paging.ts`（新增）
- `vouchap-app/src/shared-logic/database.ts`
- `Adaven-platform/apps/portalflow-app/src/shared-logic/`（同步）

---

### 2026-09-17（CRM 给 Portalflow space 建单：Edge Function non-2xx）

**User（提示词/原意）**  
- CRM 上给 Portalflow 的 space 创建订单，提示 `Edge Function returned a non-2xx status code`。

**Assistant（实现前说明）**  
- Hub `product-ops` 用各产品 **service_role** 写 `crm.space_orders`。Vouchap 已补过 GRANT；Portalflow 历史 SQL 只把 INSERT/UPDATE 给了 `authenticated`。  
- 前端 `functions.invoke` 遇到非 2xx 只抛这句泛化错误，需同时把函数 JSON `error` 透出。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 Portalflow 库 `xvqlqvtfogxkfeillvig` 授予 `service_role` 对 `crm.space_orders` 的 SELECT/INSERT/UPDATE（迁移 `20260917180000_grant_hub_service_role_space_orders.sql`，并写入 `schema_migrations`）。  
- CRM `hub-api.ts` 解析 Edge Function 错误体，避免只显示 non-2xx。  
- 残留：Portalflow `get_space_entitlements` 在 `auth.uid()` 为空时返回 `UNAUTHORIZED`，Hub 点「权益」可能仍看不到真实快照（与建单无关）。未 git commit。

**关联**  
- `Adaven-platform/apps/portalflow-app/supabase/migrations/20260917180000_grant_hub_service_role_space_orders.sql`  
- `Adaven-CRM/src/lib/hub-api.ts`、`sql/grant-portalflow-service-role-for-hub.sql`

---

### 2026-09-17（Portalflow 已开通订阅仍 Failed to load expenses / 不能 AI 识别）

**User（提示词/原意）**  
- 给 Portalflow 的 space 添加了订阅订单后，客户侧仍然不正常：failed to load expenses，也不能 AI 识别。

**Assistant（实现前说明）**  
- 查 live 库：space `Gao` 为 `consumer`，CRM 已写入 `CLIENT_PAID_MONTHLY`，但 SKU `space_target=client`，`_active_space_subscription_row` 要求 `space_target IN (kind)`，永远匹配不上。  
- expenses 列表 select `account_id` / `input_type` / embed `accounts`，库仍是 `payment_accounts` + `receipts.payment_account_id`。

**Assistant（实现后说明 / 本轮结论）**  
- 已推 `20260917190000_fix_subscription_space_target_and_accounts.sql` 到 **仅** `xvqlqvtfogxkfeillvig`：SKU space_target firm/client → provider/consumer；订阅匹配兼容旧词；`payment_accounts`→`accounts`，`receipts.account_id` + `input_type`。  
- 验证：`_active_space_subscription_row(Gao)` 现返回 `CLIENT_PAID_MONTHLY` 至 2030-12-31。  
- 请刷新 Portalflow 后再开 Expenses / 识别。未 git commit。未部署 Web。

**关联**  
- `Adaven-platform/apps/portalflow-app/supabase/migrations/20260917190000_fix_subscription_space_target_and_accounts.sql`

---

### 2026-09-17（Portalflow 新 Firm 的 Service Catalog preset 从哪来；名称与封面为何不对）

**User（提示词/原意）**  
- Portalflow 注册新 Firm 时，预设 Service Catalog 的 preset 数据如何从 Vouchap 库迁过来？人工看 template_items 有迁移，但 template 名词没迁正确，封面图片没有迁移。

**Assistant（实现前说明）**  
- 无代码变更。对照两边 live 库 `crm.preset_templates` / `preset_template_items`，以及新建 Firm 时 `apply_preset_skus_to_provider` 的复制路径。

**Assistant（实现后说明 / 本轮结论）**  
- **没有从 Vouchap live 库 dump 过来。** Portalflow 空库 `db push` 只重放了仓库里的 seed 迁移（`20250224230000_seed_preset_skus.sql` + `20250224250000_seed_preset_skus_en.sql`）。APPLY.md 明确不导入 Vouchap storage。  
- 新建 Firm：`create_space_with_user` → `provider.apply_preset_skus_to_provider`（客户端 `registerOnSpaceCreated` 再兜底一次）。函数把 Portalflow 自己的 `crm.preset_templates`（name/description/**image_url**）+ items 拷到 `provider.skus` / `sku_items`。源表没图、名称是 seed，新 Firm 就会一样。  
- 两边 items 条数与标题一致（zh T1 都是 22 条，含「P1: 基础准入」等），所以看起来像「items 迁过来了」——其实是同一份 seed。  
- Vouchap live 后来在库里改了名称（去掉 2025、中文名）并上传了 `marketplace` 封面；这些改动从未进迁移、也从未同步到 Portalflow。Portalflow 8 条 `image_url` 全空；Vouchap 指向 `giuacjbfsyrristkigmz.../marketplace/IMG_20260228_*.png`。  
- 已有 Firm 不会自动重套 preset（函数见已有 skus 即 return）。要对齐需：1）把 Vouchap 的 name/description 写进 Portalflow `crm.preset_templates`；2）把 8 张图拷进 Portalflow `marketplace` bucket 并写新 URL；3）新 Firm 之后才会带上；旧 Firm 要另补。

**关联**  
- `apps/portalflow-app/supabase/migrations/20250224230000_seed_preset_skus.sql`  
- `apps/portalflow-app/src/shared-logic/portalflow-space-bootstrap.ts`、`firm.ts` `applyPresetSkusToFirm`  

---

### 2026-09-17（Portalflow preset_templates 对齐 Vouchap live：名称 + 封面）

**User（提示词/原意）**  
- 直接处理好；Vouchap 上的 preset_template 已精细调整，Portalflow 需直接复用。只动 preset 数据。

**Assistant（实现前说明）**  
- 只改 Portalflow `crm.preset_templates` / `crm.preset_template_labels` 与 Storage `marketplace`，不改 `provider.skus`。按 locale + sort_order 对齐 name/description/tax + 封面 URL。

**Assistant（实现后说明 / 本轮结论）**  
- 8 张封面从 Vouchap public marketplace 下载后上传到 Portalflow `marketplace/`（同文件名，public URL 200）。  
- 已应用 `20260917200000_sync_preset_templates_from_vouchap.sql`：名称与 Vouchap live 一致（含中文名、去掉 2025）；写入 tax_country/scenario 及对应 label；`image_url` 指向 Portalflow 自己的 bucket。已记 `schema_migrations`。  
- 验证：8 行 `has_image`/`pf_img` 均为 true。现有 Firm 的 8 条 `provider.skus` 仍是 seed 名、无图（按「只动 preset」未改）。**新注册 Firm** 会带上新名称和封面。  
- 未 git commit。未部署 Web。

**关联**  
- `Adaven-platform/apps/portalflow-app/supabase/migrations/20260917200000_sync_preset_templates_from_vouchap.sql`  
- `apps/portalflow-app/supabase/APPLY.md`  

---

### 2026-10-11（Workmap：新增 Flowchart 地图）

**User（提示词/原意）**  
- workmap 增加流程图：创建按钮浮窗在 Mind map 与 Flowchart 之间选择，图标用 `flowchart-file`。交互对齐 antbim Web 的 Process Map：画布拖拽创建并定义起止时间，任务名用 `@`，连线支持 FS/FF/SS/SF 和自由工时（如 FS+3），以及排期、仅排序两种视图。

**Assistant（实现前说明）**  
- 不依赖私有库 `ant-tcn`，也不把条目写成项目任务。在 `workmap.mind_maps` 增加 `map_kind`，流程图 JSON 写入已有的 `process_map_document`。画布、排期推移和 `@` 提及做在 Workmap 自己的编辑器里。

**Assistant（实现后说明 / 本轮结论）**  
- 已加迁移 `20261011120000_workmap_mind_maps_map_kind.sql`，并 `supabase db push` 到已链接库。创建按钮弹出 Mind map / Flowchart；树和最近列表按类型换图标。  
- Flowchart 支持拖拽起止、平移拉伸、连线 FS/FF/SS/SF 与滞后、后序推移、Schedule / Order only。`@` 与思维导图共用光标和锚点逻辑。  
- 浏览器里核对：拖出条目、`@` 选中 Alex Chen、连线后把滞后改成 3，后序被推到工时 8（`FS+3`）；切到 Order only 后按依赖分成两列。未登录，因此没有在真实工作区列表里点创建浮窗。`tsc --noEmit` 通过。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  
- `/Users/macbook/Workmap/supabase/migrations/20261011120000_workmap_mind_maps_map_kind.sql`  

---

### 2026-10-11（Workmap：同一张地图切换 Mind map 与 Flowchart）

**User（提示词/原意）**  
- AI Work Map 要能创建两种地图。聊天提交按钮里选择 AI 生成 Mind map 还是 Flowchart。同一条记录要能在两种视图间切换：思维导图是父子关系，流程图是前后序关系。  
- 更正：section 仍保留。流程图里新增的条目挂到第一个 section 之下，不挂到根上。

**Assistant（实现前说明）**  
- `map_kind` 只表示当前视图。父子留在 `mind_map_document`，前后序留在 `process_map_document`，任务共用 id。切换时只补缺失任务，不把一种关系改写成另一种。空的 `{}` 思维导图不套用带示例任务的默认模板，而是根 + `Section 1`。

**Assistant（实现后说明 / 本轮结论）**  
- 对齐在 `map-view-align.ts`：section 不进流程图；流程图多出来的条目挂到第一个 section（没有 section 时先建 `Section 1`）；删任务时两边一起去掉该 id。脚本核对了空文档、已有 section、父子不生成连线、连线不生成父子。  
- 聊天提交按钮在按钮上方弹出 Mind map / Flowchart，选中后立刻生成并打开。Enter 沿用上次类型，默认 Mind map。生成思维导图后，只把 section 下的任务种成无连线、时长为 1 的流程图条目。  
- Edge Function 新增 `generate_flowchart`（条目、工时、FS/FF/SS/SF 与 lag），已部署到 `ychcuxqggqceaodhoutv`。客户端赋 id，写成流程图，并写一棵「根 + Section 1 + 全部任务」的思维导图。AI 版本快照仍写入 `mind_map_ai_versions`：`outline_text` 记条目和连线，`mind_map_document` 记带 section 的树。  
- 打开的地图标题栏可切换两种视图，写回两份 JSON 和 `map_kind`。侧栏图标跟随 `map_kind`。  
- `tsc --noEmit` 通过。浏览器打开 `/app/work-map` 被转到登录页，没有在已登录工作区里点提交浮窗和标题栏切换。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  
- `/Users/macbook/Workmap/apps/web/src/pages/WorkMapPage.tsx`  
- `/Users/macbook/Workmap/supabase/functions/workmap-ai/index.ts`  

---

### 2026-10-11（Workmap：思维导图与流程图共用起止时间）

**User（提示词/原意）**  
- 两种图的数据应是同一套，方便以后兼容。至少条目里的起止时间要共用。思维导图里只有一个时间时，那是完成时间；流程图里完成时间确定，时长默认 1。流程图里拖拉出来的条目，切回思维导图应有两个时间。

**Assistant（实现前说明）**  
- 不把父子改成前后序。时间单独对齐：思维导图的 `#` 日期和流程图的工时列用同一条时间轴，`originDate` 是工时 0 对应的日期。一个日期是完成日，时长 1；跨越多列的条目写成开始日和完成日。

**Assistant（实现后说明 / 本轮结论）**  
- 思维导图任务若只有 `#完成日`（可带时刻），流程图条目占该日 1 个工时，右端就是完成日。若有开始和完成两个日期，条目覆盖这两个日期之间的整天。  
- 流程图里拖出超过 1 个工时的条目，切回思维导图会写成两个 `#` 日期：开始日和最后一天（完成日）。只有 1 个工时、且不在第 0 列的条目，写成一个完成日。从未排期、停在第 0 列且时长为 1 的任务不自动补日期。已有时刻会留在同一天上。  
- 任务标题和 `@` 仍共用；日期只写在思维导图标签上，流程图条形用起止工时表达同一段时间。section、父子和连线规则不变。  
- 脚本核对了单日往返、跨度往返、未排期任务不造日期。`tsc --noEmit` 通过。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  

---

### 2026-10-11（Workmap：流程图排期横轴改为时间，并加横向缩放标尺）

**User（提示词/原意）**  
- 两种图的解析数据整合成同一套。Flowchart 的 Schedule 视图横向应是时间坐标。增加与思维导图一样的缩放标尺，但只缩放横向。磁吸颗粒包括时、日、周、月、季。

**Assistant（实现前说明）**  
- 起止时间改成从 `originDate` 00:00 起算的分钟，并写入 `timeScale: 'calendar'`。旧文档没有该标记时，start/end 仍按「天」读入，乘 1440。连线滞后仍是天数（FS+3 = 3 天）。标尺只改横向像素和磁吸粒度，泳道高度不变。Order only 不是时间轴，不显示标尺。

**Assistant（实现后说明 / 本轮结论）**  
- Schedule 横轴按真实时间画刻度，不再用 0、1、2 这种列号。标尺从左到右是 Quarter、Month、Week、Day、Hour；拖动或点刻度会吸到最近一档，加减号逐档切换，标签显示档名。拖拽创建、移动、拉伸都按当前粒度磁吸，最短一段是一个颗粒。  
- 思维导图只有日期时，条目占那一整天。日期带时刻时，完成时刻确定，时长 1 小时。两个纯日期仍是开始日到完成日（含完成日）。未排期、停在原点且正好一天的条目不补日期。旧的「天」数据在读入时换成分钟，保存后带 `timeScale: 'calendar'`，下次不会再乘一次。  
- 脚本核对了时刻往返、跨天往返、旧数据换算、FS+3 仍是 3 天，以及周/月/季边界。`tsc --noEmit` 通过。浏览器打开 `/app/work-map` 被转到登录页，没有在已登录画布上拖标尺。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/schedule-time.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  

---

### 2026-10-11（Workmap：一份 JSON，AI 同时生成父子和前后序）

**User（提示词/原意）**  
- JSON 数据整合成同一套，并清理数据库里的冗余表格和字段。AI 生成时不再区分两种图，而是让 AI 把父子关系和前后序关系都生成出来。

**Assistant（实现前说明）**  
- 一份 `mind_map_document` 同时放树、排期和连线。去掉 `process_map_document`。旧的 `workspace_project_maps` 草稿表先把行并进 `workmap.mind_maps`，再删表。AI 仍走 `generate_wbs`，但返回大纲加任务序号上的 FS/FF/SS/SF 连线，不再单独生成流程图。

**Assistant（实现后说明 / 本轮结论）**  
- 已执行迁移 `20261011143000_workmap_unified_map_document.sql`。`workmap.mind_maps` 只留 `mind_map_document`；`process_map_document` 已删。`public.workspace_project_maps` 已删，原草稿行以 `doc_id = draft-<id>` 进了思维导图列表。`map_kind` 仍表示上次打开的画布。  
- 聊天提交不再弹出 Mind map / Flowchart。一次生成写出 section 下的任务，以及这些任务之间的前后序；`#` 日期仍是排期。滞后仍是天数。空白创建仍可选先打开哪一块画布，写的是同一份文件。  
- 脚本核对了大纲父子、FS+3，以及打包后再读出连线和时长。`tsc --noEmit` 通过。Edge Function `workmap-ai` 已部署。未在已登录页面点过生成。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  
- `/Users/macbook/Workmap/supabase/migrations/20261011143000_workmap_unified_map_document.sql`  
- `/Users/macbook/Workmap/supabase/functions/workmap-ai/index.ts`  

---

### 2026-10-11（Workmap：流程图条目行高与时间格）

**User（提示词/原意）**  
- 流程图画布里减小条目高度，与思维导图单行条目一致。条目在行内上下居中，横隔线落在条目间距中间。减小行高，竖向间距与思维导图 100% 缩放时一样。竖隔线是区间隔线，一格表示当前比例的一个单位，并体现周末日期的底色差异。

**Assistant（实现前说明）**  
- 思维导图任务节点在 100% 时高 36px，左右布局的相邻条目竖向间距是 14px。行高改为 50px，条目在行内居中，横线画在两行交界。竖线按当前粒度的每个边界画，不再合并多格。周六和周日铺浅底。

**Assistant（实现后说明 / 本轮结论）**  
- 条目高 36px，行高 50px，上下各留 7px，横隔线在这 14px 间距的正中。字体与思维导图单行条目同为 0.8rem。  
- 时、日、周、月、季每一档都是一格一个单位，竖线落在该单位的边界上。周末按日历日铺底，日视图里整列着色，更粗的粒度里只铺周六日那一段。  
- 脚本核对了 2026-10-11 起连续 8 天的周末区间，以及日视图每格一天。`tsc --noEmit` 通过。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/lib/schedule-time.ts`  

---

### 2026-10-11（Workmap：流程图隔线改轻，时间标居中）

**User（提示词/原意）**  
- 隔线过重。时间标应放在格子的横向居中。

**Assistant（实现前说明）**  
- 横线和竖线的不透明度从 0.45 降到 0.2。时间文字改到当前格子起止时刻的中点，并用 translateX(-50%) 居中。

**Assistant（实现后说明 / 本轮结论）**  
- Schedule 与 Order only 的隔线都改为更淡的 1px。时间标按当前粒度的一整格居中，月和季按实际边界取中点。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-11（Workmap：月、季取消周末底色）

**User（提示词/原意）**  
- 取消月、季比例的周末底色。

**Assistant（实现前说明）**  
- 周末底色只在时、日、周粒度绘制。月和季一格跨很多天，不再铺周六日底。

**Assistant（实现后说明 / 本轮结论）**  
- `timeGrain` 为 month 或 quarter 时不调用 `weekendRanges`。时、日、周仍按日历日铺周末底。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-11（Workmap：时比例一屏约两天）

**User（提示词/原意）**  
- 时比例时，画布横向显示跨度应为 2 天较好。

**Assistant（实现前说明）**  
- 小时刻度原先每格 72px，一屏大约不到一天。改为按可视宽度计算，让一屏横向刚好约两天。格子仍是一小时一格；格子变窄时只保留部分时间标，避免叠字。

**Assistant（实现后说明 / 本轮结论）**  
- Hour 的每分钟像素 =（可视宽度 − 左边距）/（2 × 1440）。窗口变宽时仍保持约两天。小时格窄于 44px 时每 3 小时标一次，窄于 28px 时每 6 小时标一次，午夜日期仍显示。竖线仍按小时。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-11（Workmap：时间轴两行，无级缩放）

**User（提示词/原意）**  
- 流程图时间坐标轴有必要设计成两行：年/季，年/月，年/周n，年月/日，年月日/时。缩放需支持跟思维导图一样无级滚动缩放，在四个区间内合适的比例时切换颗粒显示。

**Assistant（实现前说明）**  
- 标尺改为对数连续缩放，滚轮与拖动手柄都无级。季、月、周、日、时五个锚点之间有四个区间，格子宽到能读时才切到更细的颗粒。坐标轴拆成上行大段、下行当前格。

**Assistant（实现后说明 / 本轮结论）**  
- 上行：季/月/周为年，日为年月，时为年月日。下行格子居中：Q1、Jan、W12、日号、小时。滚轮以指针处的时间为锚缩放，只改变横向。最右端仍约两天一屏。切到小时后窄格仍每 3 或 6 小时标一次。`timePx` 随文件保存。`tsc --noEmit` 通过。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/schedule-time.ts`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-11（Workmap：两种画布的滚轮手势）

**User（提示词/原意）**  
- 两种视图下，鼠标正常滚动等于上下平移画布，滚轮加 Shift 等于左右平移，加 Ctrl 等于缩放。触控板双指平移画布，撑捏缩放。

**Assistant（实现前说明）**  
- 思维导图原先滚动即缩放。流程图上一轮也把滚轮绑成了时间轴缩放。改为滚动平移，只有 Ctrl 或触控板撑捏才缩放。

**Assistant（实现后说明 / 本轮结论）**  
- 思维导图：`zoomOnScroll` 关闭，`panOnScroll` 开启，撑捏与 Ctrl+滚轮仍缩放。流程图 Schedule 与 Order only：普通滚动上下移，Shift 或横向双指左右移，Ctrl 与撑捏只在 Schedule 缩放时间轴。`tsc --noEmit` 通过。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-11（Workmap：去掉页面滚动条）

**User（提示词/原意）**  
- 两种视图都出现了页面滚动条。不应出现页面级滚动条，且前述滚动只在鼠标位于画布内时激活。

**Assistant（实现前说明）**  
- 应用壳只用了最小高度，画布内容会把文档撑高，窗口因此出现滚动条。滚轮绑在画布节点上，指针在画布外时不应再带动页面。

**Assistant（实现后说明 / 本轮结论）**  
- `html`、`body`、`#root` 和登录后的应用壳改为铺满视口并 `overflow: hidden`。思维导图画布容器裁切溢出。流程图滚动留在画布内部的滚动层，且 `overscroll-behavior: none`，不会串到页面。滚轮监听仍只挂在画布上。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/index.css`  
- `/Users/macbook/Workmap/apps/web/src/styles/aimlink-web-app-shell.scss`  
- `/Users/macbook/Workmap/apps/web/src/styles/aimlink-web-mindmap-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-11（Workmap：框选与流程图放置光标）

**User（提示词/原意）**  
- 思维导图画布空白处左键拖放不再拖动画布，改为框选节点。屏蔽右键菜单，右键按住拖动画布。流程图只在每一行节点高度内左键拖放创建，此时鼠标变成待放置的节点；横隔线附近左键拖放为框选，仍用十字光标。已有节点内的交互不变，光标改成和思维导图一样的黑色箭头。

**Assistant（实现前说明）**  
- 思维导图左键平移改为只响应右键，左键空白拖放走框选，并拦住右键菜单。流程图按行内 36px 条目带创建，条目带之间的间隙框选。

**Assistant（实现后说明 / 本轮结论）**  
- 思维导图 `panOnDrag` 仅右键，`selectionOnDrag` 负责左键框选，画布上取消浏览器右键菜单。流程图条目带内跟随一个虚线节点作为放置光标；间隙保持十字并框选条目。节点、缩放手柄和连线手柄改为默认箭头。框选可多选，删除会删掉选中的条目。`tsc --noEmit` 通过。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-11（Workmap：框选对齐、右键拖移、放置热区）

**User（提示词/原意）**  
- 思维导图左键框选有问题。鼠标在画布上应为十字，按住右键变为拖移手形。框选的选中范围与拖放范围不匹配。流程图也要按住右键拖移画布。点击新建的热区缩到节点高度的居中 60%。待放置光标缩短左右长度，改成更明显的浮动样式。

**Assistant（实现前说明）**  
- 框选默认要求节点完整落入矩形，根节点和清单节点的布局宽度又是 224px，而卡片实际是 296px，所以框和选中结果对不齐。改为相交即选中，并把布局宽度对齐到卡片。流程图右键滚动画布，新建热区收成条目高度的居中 60%，放置光标改短并浮起。

**Assistant（实现后说明 / 本轮结论）**  
- 思维导图画布十字光标，右键拖移时为抓取手形。框选改为碰到节点即选中，框选期间写回选中集合。根节点和清单节点的布局宽度改为 296px，与卡片一致。流程图右键拖移滚动层并屏蔽右键菜单；新建热区为节点高度居中的 60%；放置光标宽 80px，居中并带浮起阴影。`tsc --noEmit` 通过。未在已登录画布上目视（`/app/work-map` 会转到登录页）。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/aimlink-web-mindmap-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-11（Workmap：框选命中、节点上右键拖移、流程图横线与待放样式）

**User（提示词/原意）**  
- 思维导图框选范围仍不对，很容易全选。在节点范围内按住右键也要能拖动画布。流程图在天和时的颗粒下横隔线也要保留。节点高度 60% 热区内的待放焦点应在行内居中，不要浮移。待放节点和拖移落地的新节点用同一种样式，并区别于已有节点。

**Assistant（实现前说明）**  
- 库内置框选会把尚未量到尺寸的节点全部算进选区，所以一小下就全选。节点带有禁止平移的标记，右键落在节点上拖不动。横隔线改成逐行元素，避免天、时比例下大画布背景画不出来。待放光标取消上浮，并和拖出的新节点共用同一样式。

**Assistant（实现后说明 / 本轮结论）**  
- 框选改为用屏幕上的节点矩形和拖出的框做相交，不再走会全选的内置命中。右键在空白处和节点上都会拖移画布，光标为抓取手形。流程图每一行都画横线，盖在周末底色之上，天和时同样保留。待放光标锁在行内居中，不再上浮；它和拖移中的新节点都是虚线浅底，和已有白底节点区分开。`tsc --noEmit` 通过。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/aimlink-web-mindmap-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-11（Workmap：空白点击取消选中、短条目可点选）

**User（提示词/原意）**  
- 思维导图已有节点选中时，在空白处点击且没有拖移，应视为框选空集，取消已选节点。流程图时间颗粒很大时，时长短或只有截止时间的节点点不中，也没有黑箭头焦点。有前后序的节点一点选就向左跳。

**Assistant（实现前说明）**  
- 空白点击因为没超过拖移阈值，不会改选中集合。短条目在粗颗粒下只有几像素，指针进不了节点，光标也就不会变成箭头。点击被当成拖移，起点被吸到上一格，有前后序、时间不在格线上的节点就会向左跳。

**Assistant（实现后说明 / 本轮结论）**  
- 思维导图空白处轻点会把选中集合清成空集。流程图条目最窄 36px，短时长和只有截止时间的条目可以点到，悬停是默认箭头。指针移动不足 4px 只选中、不改时间，避免一点就吸到上一格。`tsc --noEmit` 通过。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-11（Workmap：多选删除不跳回根节点）

**User（提示词/原意）**  
- 思维导图选中多个节点时无法一次全部删除。删除后视图总是跳到根节点。

**Assistant（实现前说明）**  
- 删除只处理当前主选中的一个节点。自动整理在删除后会重排，并顺带把镜头对准根节点。

**Assistant（实现后说明 / 本轮结论）**  
- Delete / Backspace 会删掉所有选中节点及其子树，根节点保留。删除后的重排不再移动镜头。`tsc --noEmit` 通过。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  

---

### 2026-10-11（Workmap：快捷新建节点不拉视图）

**User（提示词/原意）**  
- 批量删除已经可以，删除后也不再拉视图。但键盘快捷创建新节点时又出现拉视图。

**Assistant（实现前说明）**  
- Enter 建同级、Tab 建子节点仍会触发自动整理，整理完成后镜头被对准根节点。删除那次已经跳过这次对焦，新建还没有。

**Assistant（实现后说明 / 本轮结论）**  
- Enter 和 Tab 新建节点后仍会重排，但不再移动镜头。`tsc --noEmit` 通过。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  

---

### 2026-10-11（Workmap：新建节点后的测高不再拉视图）

**User（提示词/原意）**  
- Enter / Tab 创建新节点仍然会拉视图。

**Assistant（实现前说明）**  
- 新建当时跳过了一次对焦，但新节点测高会再次增加整理版本，那一次仍把镜头移到根节点。

**Assistant（实现后说明 / 本轮结论）**  
- 自动整理只在首次打开或切换方向时移动镜头。增删节点和测高重排不再移动视口。`tsc --noEmit` 通过。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  

---

### 2026-10-11（Workmap：流程图单击新建截止时间节点）

**User（提示词/原意）**  
- 流程图处于拖放新建节点的状态时，只点选、不拖移，也应新增节点。该节点只有截止时间，没有时长。

**Assistant（实现前说明）**  
- 单击不足 8px 会被丢掉。截止时间在数据里用一小时长的结束时刻表示，不写成一段起止区间。

**Assistant（实现后说明 / 本轮结论）**  
- 在行内新建热区单击，会在当前时间格的结束处放一个只有截止时间的节点，并进入编辑。拖移仍按拖过的区间创建有时长的节点。颗粒很粗时，这个节点的右边缘对齐截止时间。`tsc --noEmit` 通过。未在已登录画布上目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-11（Workmap：流程图节点手柄、无时长宽度与悬停全文）

**User（提示词/原意）**  
- 已有节点两端都要能拖起止时间。无时长节点的显示长度是当前颗粒的一单位，时颗粒为 2 小时。待放焦点提示为 “Add new”。内容被缩略时，悬停浮窗显示全文，样式与思维导图节点一致，不含起止时间。

**Assistant（实现前说明）**  
- 手柄还在 DOM 里，但没有可见样式，右端还缩进并被文字盖住。无时长仍按一小时或最小 36px 绘制。悬停全文做成思维导图任务卡（标题、@、#），不另画日程区间。存储的一小时截止编码不改，只改绘制宽度。

**Assistant（实现后说明 / 本轮结论）**  
- 时间视图节点左右两端恢复可见的拖拽手柄，拖动可改长短。无时长节点右缘仍对齐截止时间，宽度为当前一格；时颗粒为 2 小时。待放焦点文案为 “Add new”。名称被省略时悬停显示全文浮窗。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-11（Workmap：流程图拖长短手柄改为悬停光标）

**User（提示词/原意）**  
- 拖长短的手柄不需常显，鼠标摸到相应热区时更换焦点样式即可。

**Assistant（实现前说明）**  
- 两端热区仍在，但上面画了常显的紫色竖条。去掉竖条，热区保留左右拖拽光标。

**Assistant（实现后说明 / 本轮结论）**  
- 节点两端不再画出手柄。鼠标进入左端或右端热区时，光标变为左右拖拽，仍可拖改起止时间。仅改样式，未跑类型检查。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-11（Workmap：新建节点输入框去掉滚动条灰块）

**User（提示词/原意）**  
- 新建节点待输入时，提示语右侧有一块黑/灰块，应去掉。提示语过长时裁剪显示即可，不需缩略。

**Assistant（实现前说明）**  
- 那块是输入框在提示语换行后出现的滚动条。提示语改为单行裁切，不显示省略号，并藏掉滚动条。

**Assistant（实现后说明 / 本轮结论）**  
- 新建节点的名称输入改为单行，超出部分直接裁掉，不再出现右侧灰块，也不用省略号。仅改样式。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-11（Workmap：重跑本地测试服务器）

**User（提示词/原意）**  
- 重跑测试服务器。

**Assistant（实现前说明）**  
- 本机没有已在监听的 Vite。在 Workmap 根目录执行 `npm run dev`。

**Assistant（实现后说明 / 本轮结论）**  
- 开发服务器已启动：http://localhost:5173/ 。无代码变更。未 commit。

**关联**  
- `/Users/macbook/Workmap`  

---

### 2026-10-11（Workmap：流程图聊天框与最小化浮层图标）

**User（提示词/原意）**  
- 流程图也要有和思维导图完全一致的右下角聊天输入框。两边都在右上角加最小化，可收成附图那个浮层图标。

**Assistant（实现前说明）**  
- 复用思维导图的悬浮输入框。右上角加最小化，收起后用附图裁成的圆形图标。流程图的发送和历史走同一套地图助手。

**Assistant（实现后说明 / 本轮结论）**  
- 思维导图和流程图的聊天框样式一致，右上角可最小化成浮层图标，再点开恢复。流程图可发送修订并打开历史。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/mind-map/MindMapAiFloatingComposer.tsx`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/aimlink-web-mindmap-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/assets/workmap-icons/ai-assistant.png`  

---

### 2026-10-11（Workmap：流程图父子任务展开）

**User（提示词/原意）**  
- 流程图要支持父子任务展开，展开固定为上-下。父任务左下角用思维导图同款子任务数。收起后，子任务的前后序仍连在各自的时间位置，看起来会接在父任务中部。父任务在图上的起止是自身和全部子任务的最早开始到最迟完成。

**Assistant（实现前说明）**  
- 父子和收起状态沿用思维导图节点。展开时子任务排在父任务下一行。图上宽度用时间合集，不改各自保存的起止。收起后子任务不画出，连线的横坐标仍是子任务自己的起止时刻，纵坐标落在父任务条的中线。

**Assistant（实现后说明 / 本轮结论）**  
- 有子任务的节点左下角显示数量，可展开或收起。展开为上-下排列。父任务条覆盖最早开始到最迟完成。收起后子任务连线仍落在原时间位置。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-11（Workmap：剔除父子前后序，流程图紧凑成行）

**User（提示词/原意）**  
- 父子任务之间如有前后序关联，应剔除并不生效。排布要紧凑，不要空行；时间不冲突的任务可以排在同一行，避免竖向行数太多。

**Assistant（实现前说明）**  
- 一条连线的两端若在流程图任务树上互为祖先，就从文档里删掉，排程和绘制都不再使用。行号改为按画出的时间区间做首个可放入的行：子任务严格在父任务下一行起排，其余不重叠的任务共用一行。不再按旧的 lane 空档留白行，也不再允许上下拖动改行。

**Assistant（实现后说明 / 本轮结论）**  
- 父子（含隔代）前后序会被去掉，新建时提示不能连接。已有连线在打开或后续保存时剔除，不再推动时间；已经被推后的时间不会自动拨回。任务按时间是否重叠挤到尽量少的行，子任务仍在父任务下方。画布高度跟紧凑后的行数走，不再按旧行号撑出空行。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-11（Workmap：展开套框，拖移与空白处新建）

**User（提示词/原意）**  
- 父任务展开后要加淡化套框，把子任务包成一个整体。子任务应靠在父任务之下，展开时把靠近的节点推挤下移。移动父任务时，套框和子任务一起移动。紧凑排布只是自动排布的原则，仍要允许用户把节点拖开，也要允许在任意空白处新建。

**Assistant（实现前说明）**  
- 行号改回按节点自己的 lane 绘制，上下拖动会写回 lane。展开时把可见子任务紧凑排到父任务正下方，并把更下面的其他节点下移让出空位；收起时把这块高度收回。拖父任务时，其子任务的行和时间一起平移。新建和待放置焦点跟指针所在行，只有该行时间冲突才往下让。套框用父任务和可见子任务的外框。

**Assistant（实现后说明 / 本轮结论）**  
- 展开后父任务和子任务外包一层淡色框。子任务贴在父任务下方，旁边更低的节点被下移。拖动父任务时整组一起动；单独拖某个节点可以离开这组。空白行可以新建，焦点停在指针那一行。每个地图第一次打开时会把当前自动紧凑行写进 lane，之后的拖动会保留。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-12（Workmap：收紧流程图展开套框）

**User（提示词/原意）**  
- 套框尺寸调小。上部与父任务自身边缘重叠，下部与最下行子任务底部边缘重叠，两端与父任务两端对齐。

**Assistant（实现前说明）**  
- 去掉四周留白。套框左、右、上沿改用父任务条的边缘，下沿改用可见子任务里最底下那一行的底边。

**Assistant（实现后说明 / 本轮结论）**  
- 套框宽度与父任务条一致，上沿贴住父任务上沿，下沿贴住最底下一行子任务的底边，不再向外扩一圈。圆角改为与任务条一致。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-12（Workmap：前后序连线热区与浮窗）

**User（提示词/原意）**  
- 前后序连线不要常显 FS 标记，摸到再显示。沿线加大触摸热区，更容易点中。点开后的浮窗只留两行：第一行四个类型加删除图标，第二行 Lag 和输入框。

**Assistant（实现前说明）**  
- 类型标记默认隐藏，指针进入连线才显示。可见线条旁边加一条更宽的透明描边负责点选。浮窗去掉预览和关闭按钮，改成一行五个按钮，下一行是 Lag 输入。

**Assistant（实现后说明 / 本轮结论）**  
- FS 等标记只在摸到连线时出现。沿线热区加宽，点中后浮窗只有类型、删除和 Lag。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-12（Workmap：Lag 单位可选）

**User（提示词/原意）**  
- Lag 行的单位还要保留，并且可选月、周、日、时，放在输入框之后。

**Assistant（实现前说明）**  
- 数字仍是 Lag 的数量。单位单独保存，缺省按日，和原来的天数一致。时按 60 分钟，周按 7 天，月按 30 天，换算进前后序推动。

**Assistant（实现后说明 / 本轮结论）**  
- Lag 行是「Lag」、输入框、单位下拉。单位为 Month、Week、Day、Hour，放在输入框后面。摸到连线时，非零 Lag 会带上 h、d、w、mo。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  

---

### 2026-10-12（Workmap：子任务拖出父任务显示范围）

**User（提示词/原意）**  
- 子任务拖移应支持超出父任务的当前显示时间范围，超出后反算父任务的显示周期。

**Assistant（实现前说明）**  
- 子任务可以拖到父任务显示条之外。拖动和改长短的过程中，沿祖先把各任务自己的时间重新取最早开始和最迟完成，只改显示，不改父任务自己保存的起止。松手后仍按同一套合集重算。

**Assistant（实现后说明 / 本轮结论）**  
- 拖子任务或拖它的边缘超出父任务当前显示范围时，父任务条和套框会跟着伸缩。父任务自己的时间定义不变。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-12（Workmap：父任务按整组参与前后序）

**User（提示词/原意）**  
- 前后序会连带把后序往后推，也会限制后序往前移，但后序如果是父任务就不生效。父任务应作为含子任务的整体一起连带或限制。显示周期由父任务自己的数据和子任务算出，并直接当作该父任务的实际排期来计算。需要连带调整时，子任务整体跟着动，同时更新父任务自己的时间数据。

**Assistant（实现前说明）**  
- 排程改用父任务与全部子任务的最早开始、最迟完成，不再只用父任务自己保存的起止。算出要后移的量后，父任务和子任务加上同一段时间，父任务自己的起止也加上这段时间。

**Assistant（实现后说明 / 本轮结论）**  
- 父任务作为前序或后序时，都按整组的显示周期计算。后序是父任务时，会被后推，往前拖也会被挡回；子任务一起移动，父任务自己的时间同步加上同一偏移。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  

---

### 2026-10-12（Workmap：拖移父任务后按图写回时间）

**User（提示词/原意）**  
- 父任务自身被拖移时，其自身的时间数据也更新与图显一致。父任务周期与子任务冲突时仍反算显示；一旦该父任务在图上产生调整，则按图更新其数据消除冲突。

**Assistant（实现前说明）**  
- 仅有冲突时继续只改显示，不回写。父任务被拖移，或因前后序整组后移时，子任务仍一起平移，再把该父任务（及一起移动的下层父任务）保存的起止改成图上的整段周期。只拖子任务不回写祖先。

**Assistant（实现后说明 / 本轮结论）**  
- 松手后父任务自己的起止等于图上显示的最早开始到最迟完成，冲突被写回消除。前后序把父任务整组后推时同样按新的图上周期回写。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-12（Workmap：同行时间重叠则下移一行）

**User（提示词/原意）**  
- 避免同一行显示的任务有时间重叠。拖移到一行发生重叠时，放到再下一行；被重叠的若是展开了子任务的父任务，则放到最后一行子任务的下一行。

**Assistant（实现前说明）**  
- 拖移预览和松手用同一套落点。目标行上按图上显示的时间判断重叠，端点相接不算重叠。整组一起下移。展开父任务的阻挡范围算到其当前可见子任务的最下一行。未改行、未改时间的拖移不主动重排。

**Assistant（实现后说明 / 本轮结论）**  
- 日程视图中，拖到会重叠的一行时自动改落到下一空行；挡住的是展开父任务时，落到它最下面一行子任务之下。子任务仍跟着父任务一起动。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-12（Workmap：重叠行拖动可经过，松手再落位）

**User（提示词/原意）**  
- 拖移时冲突位置需可以经过，只是释放时如重叠则按上一则办法优化落地位置。

**Assistant（实现前说明）**  
- 拖动预览跟着手指，允许穿过时间重叠的行。松手时若仍重叠，再落到下一行；展开父任务则落到其最下一行子任务的下一行。

**Assistant（实现后说明 / 本轮结论）**  
- 预览不再因重叠改行。松手后的落点规则不变。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-12（Workmap：展开时只挪会碰到套框的任务）

**User（提示词/原意）**  
- 展开父任务的子任务时，只调整将与该父任务的套框有重叠可能的其他任务的行位置，不会重叠的不需调整。

**Assistant（实现前说明）**  
- 子任务仍从父任务下一行起排布。套框覆盖父任务显示时间、以及父任务行到最下一行子任务。只有落在这些行里且时间和套框相交的其他任务，才移到套框下一行；时间不相交或在套框行之外的保持原行。收起不再把下方任务整段上拉。

**Assistant（实现后说明 / 本轮结论）**  
- 展开时只下移会与套框时间重叠的任务，其余不动。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-12（Workmap：被推移的展开父任务整组下移）

**User（提示词/原意）**  
- 展开父任务时，如果其他展开的父任务被推移，应该其套框和子任务整体推移。

**Assistant（实现前说明）**  
- 被套框挤开的若是已展开父任务，不只改它自己的行。它和全部子任务加上同一行偏移，套框随位置一起下移。嵌套在里面的展开父任务跟着外层走，不再单独落位。

**Assistant（实现后说明 / 本轮结论）**  
- 展开时，被推移的展开父任务带着子任务和套框整体下移，组内相对行距不变。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-12（Workmap：AI 前后序提示词补全反向依赖）

**User（提示词/原意）**  
- AI 规划的 WBS 已完整合理，但任务前后序依赖有缺漏。需优化提示词，增强流程关系的完整定义。生成顺序是 WBS，尤其当业务上先生成的任务依赖于后生成的任务时，应有则补全，不遗漏。

**Assistant（实现前说明）**  
- 只改 `generate_wbs` 的服务端提示词。大纲写完后要求再扫一遍依赖。明确 `from` 可以大于 `to`：先写在大纲里的任务若要等后面的任务，必须连上，不能按书写顺序漏掉。父子缩进仍不写成前后序。

**Assistant（实现后说明 / 本轮结论）**  
- 提示词已改为 WBS 之后的第二遍依赖检查，并在示例里放了后生成任务作为前序的连线。需重新部署 `workmap-ai` 后，新的规划才会用到这段提示词。未改解析逻辑。未 commit。

**关联**  
- `/Users/macbook/Workmap/supabase/functions/workmap-ai/index.ts`  

---

### 2026-10-12（Workmap：提交并部署 workmap-ai）

**User（提示词/原意）**  
- 提交部署 workmap-ai。

**Assistant（实现前说明）**  
- 只提交 `supabase/functions/workmap-ai/index.ts`。流程图等其余未提交改动不纳入本次提交。部署到 Supabase 项目 `ychcuxqggqceaodhoutv`。

**Assistant（实现后说明 / 本轮结论）**  
- 本地提交 `51680bf`：补全 AI 规划里先写任务对后写任务的前后序依赖。`supabase functions deploy workmap-ai` 已成功。未 push 远程 git。流程图相关改动仍留在工作区。

**关联**  
- `/Users/macbook/Workmap/supabase/functions/workmap-ai/index.ts`  

---

### 2026-10-12（Workmap：AI 首次生成按整组排布避免套框重叠）

**User（提示词/原意）**  
- 单个推移避免重叠的规则符合预期，但从 AI 生成数据首次生成整个画布时，还有很多套框重叠，或父子任务不整体。

**Assistant（实现前说明）**  
- 生成后原先按大纲逐行占一行，首次紧凑排布又会把别的任务插进套框行。改为生成后整组落位：展开父任务与子任务保持相对行距一起移动；时间与套框相交的其他组整组下移，不相交的可以同行。

**Assistant（实现后说明 / 本轮结论）**  
- `documentsFromGeneratedOutline` 在排程后调用 `arrangeScheduleLanes`。日程视图的一次性自动排布也改用同一套。已有地图不会自动重排，需要重新生成。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-12（Workmap：流程图顶栏对齐思维导图并增加整理画布）

**User（提示词/原意）**  
- 画布上方的标题和按钮，flowchart 也设计成跟 mindmap 一样的布局和样式，可复用的功能复用，加一个整理画布功能，用于一键优化排布整个画布的排列。

**Assistant（实现前说明）**  
- 流程图顶栏改用思维导图同一套工具栏样式：标题、分段按钮、右侧操作。全屏沿用同一套浏览器全屏。整理画布调用已有的整组排布。操作说明改到标题栏下方的提示行。

**Assistant（实现后说明 / 本轮结论）**  
- 流程图顶栏为地图标题、时间比例、Schedule/Order、Tidy canvas、Delete 和全屏。Tidy canvas 按当前视图把整张画布重新排成不重叠的整组。`tsc --noEmit` 通过。未登录画布会跳到登录页，未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/pages/WorkMapPage.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-12（Workmap：流程图顶栏搜索下载，视图更名为 WBS map / Flow map）

**User（提示词/原意）**  
- delete 按钮去除，同样增加搜索和下载按钮，整理画布左移靠近缩放比例尺。Mindmap 和 Flowchart 全局更名为 WBS map 和 Flow map。

**Assistant（实现前说明）**  
- 流程图顶栏去掉 Delete，搜索和下载沿用思维导图的图标按钮、弹层样式和快捷键。Tidy canvas 放到时间比例尺右侧。界面文案里的 Mind map / Flowchart 改为 WBS map / Flow map，内部类型名不动。

**Assistant（实现后说明 / 本轮结论）**  
- 流程图顶栏顺序为标题、时间比例、Tidy canvas、Schedule/Order，右侧为搜索、下载、全屏。搜索选中条目并滚入视口，收起的父任务会展开。下载导出当前 flow 文档 JSON。新建菜单、视图切换、缺省标题和相关提示已改名。`tsc --noEmit` 通过。未登录无法目视画布。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/pages/WorkMapPage.tsx`  

---

### 2026-10-12（Workmap：流程图操作说明移到底栏并注明 React Flow）

**User（提示词/原意）**  
- 画布顶部的操作说明文字，同样放在画布底部，采用一样的样式，右端注明 React Flow。

**Assistant（实现前说明）**  
- 把流程图操作说明从顶栏下方移到画布底部，复用思维导图底栏样式，右端放 React Flow 链接。聊天浮层仍盖在画布上，不压住底栏。

**Assistant（实现后说明 / 本轮结论）**  
- 流程图底栏为原操作说明，右端是 React Flow 链接，样式与思维导图底栏相同。`tsc --noEmit` 通过。未登录无法目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

---

### 2026-10-12（Workmap：流程图 Order 按钮改为 Sequence）

**User（提示词/原意）**  
- 按建议把 Order 改为 Sequence。

**Assistant（实现前说明）**  
- 只改流程图视图按钮文案和悬停说明。内部 `viewMode: 'order'` 不动。Schedule 保持原名。

**Assistant（实现后说明 / 本轮结论）**  
- 按钮为 Sequence，悬停为 “What must come first. Dates stay saved, but hidden.” 未目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-12（Workmap：WBS 改时间后 Flow map 按新数据重绘）

**User（提示词/原意）**  
- WBS map 中修改父任务时间后，切换 Flow map 时又被恢复了。修改或删除 node 的起止时间后，Flow map 应按新数据重绘，重叠则自动调整。

**Assistant（实现前说明）**  
- 父任务条子此前按「自身 + 全部子任务」的合集绘制，所以 WBS 里改过的区间一切到 Flow 就被旧范围盖住。没有日期的任务也不会清掉旧条子。改为以 WBS 上的起止时间为这条任务自己的绘制数据；时间有变化时按现有整组规则重排，避开同一行重叠。

**Assistant（实现后说明 / 本轮结论）**  
- `applyMindSchedule` 对每个任务写入新区间，删掉日期则回到未排期的一日条子。区间变化后调用 `arrangeScheduleLanes`。Flow 条子按任务自身起止绘制，不再用子任务把父任务拉回旧范围。`tsc --noEmit` 通过。未登录无法目视。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  

---

### 2026-10-12（Workmap：父任务删时间后按子任务反算）

**User（提示词/原意）**  
- 父任务的时间在 WBS map 中删除后，Flow map 应根据子任务反算。要求登录页面自查。

**Assistant（实现前说明）**  
- 上一轮把「没有日期」一律画成起点处的一日条子，父任务删掉日期后不再包住子任务。改为：任务自己写了日期就用自己的；没写日期时，从已排期的直接子任务取最早开始和最晚结束（子任务先算好，再向上汇总）。既无日期也无已排期子孙的任务仍是一日未排期条子，避免空任务把父任务拉回起点。

**Assistant（实现后说明 / 本轮结论）**  
- `applyMindSchedule` 按深度从深到浅汇总。已用测试账号登录 `http://localhost:5173`，在地图 gdfgdfg 写入 Parent（无日期）、Child A `#2026/11/03 #2026/11/20`、Child B `#2026/12/01 #2026/12/05`。切到 Flow map Schedule 后实测：Parent 与 Child A 同左（11 月 3 日），右端与 Child B 对齐（12 月 5 日结束，宽 2376px = 33 天 × 72px）；无日期的 Task 2 仍是起点处一日条子，没有把 Parent 拉回去。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  

---

### 2026-10-12（Workmap：父任务显示反算与数据回写分开）

**User（提示词/原意）**  
- Flow map 里父任务盖不住子任务（含父任务没写时间）时，显示区间按子任务最早开始到最晚完成反算，但不立刻改父任务的时间数据。拖改父任务时间，松手时再校验，冲突则反算显示。在 Flow map 里改过这一组之后，才按显示区间更新数据。再次打开 Flow map 时，只有数据变了的条目重绘重排。

**Assistant（实现前说明）**  
- 上一轮把反算结果直接写进父任务的 start/end。改为绘制用 `scheduleDisplaySpans`（盖得住就用自己的区间，盖不住才用子任务跨度），WBS 对齐只写入各自日期、缺日期则清成未排期。松手或拖动该组时 `matchMovedParentSpans` 才把显示区间写回数据。再次打开只对起止或显示跨度变了的条目调用 `reflowChangedScheduleLanes`。

**Assistant（实现后说明 / 本轮结论）**  
- 登录后在 gdfgdfg 核对：删掉 Parent 日期再进 Flow map，条子仍包住子任务，回到 WBS 后 Parent 仍无日期。拖动该组松手后，Parent 写上与显示一致的日期。子任务伸出父任务时，条子拉长但 WBS 日期不变；把父任务右端拖短，拖动中变短，松手弹回子任务跨度，并因此把数据写成该显示区间。无改动再打开，四条位置不变；只改 Child A 时 Task 2 与 Child B 不动，Child A 因重叠换行。`tsc --noEmit` 通过。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-12（Workmap：父任务反算包含自身时间）

**User（提示词/原意）**  
- 父应包子。最早开始到最晚完成的反算要带上父任务自己的时间：父任务开始得比所有子任务更早，开始时间就用父任务自己的。

**Assistant（实现前说明）**  
- 冲突时显示跨度此前只用子任务，父任务更早的开始被丢掉。改为父任务自己有时间时，取父任务与已排期子任务里更早的开始、更晚的结束。父任务没有时间时仍只用子任务，避免未排期的一日占位把整组拉回起点。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 gdfgdfg 核对：Parent `#2026/11/01 #2026/11/10`，Child A `#2026/11/03 #2026/11/20`，Child B `#2026/12/01 #2026/12/05`。Flow map 上 Parent 比 Child A 早 2 天开始（左端差 144px），右端与 Child B 对齐（12 月 5 日，宽 2520px = 35 天）。回到 WBS 后 Parent 仍是 11 月 1 日到 11 月 10 日，没有被反算写回。`tsc --noEmit` 通过。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  

---

### 2026-10-12（Workmap：套框颜色与框内新建挂到父任务）

**User（提示词/原意）**  
- 展开的父任务套框换一种颜色，现在和周末底色太接近。在套框内新建 node，WBS 上也要放进该父任务。

**Assistant（实现前说明）**  
- 套框是很淡的靛蓝，叠在灰色周末条上几乎看不出来。框内新建的流程图条目在对齐时一律挂到第一个 section。改为暖琥珀色套框；按下位置落在套框内时，把新节点插到该父任务的子节点末尾，嵌套时取最内层套框。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 gdfgdfg 的 Flow map 核对：套框为琥珀色，周末底色仍是灰蓝，两者可分开。在 Parent 套框内空行点出新条目后，WBS 大纲里它排在 Parent 的子任务下（与 Child A、Child B 同级），Parent 子节点数变为 3。`tsc --noEmit` 通过。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

---

### 2026-10-12（Workmap：Flow map 的 Enter / Tab）

**User（提示词/原意）**  
- WBS 的 Enter 建同级、Tab 建子级在 Flow map 上复用。Enter 的同级开始时间紧接当前条目的完成时间，并连上前后序。Tab 建子级并展开，子级开始时间与当前条目一致。

**Assistant（实现前说明）**  
- Flow map 此前只有点按和拖拽新建。选中一条且不在输入框里时，Enter 在其后插入同级：起点等于当前结束时刻，时长相同，并加一条 FS 连线。Tab 把父任务展开，子级起点和时长与当前条目相同，挂到该父任务下。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 gdfgdfg 核对。对 Child A（11 月 3 日–11 月 20 日）按 Enter：新同级从 11 月 21 日画到 12 月 8 日，左端紧接 Child A 右端，前后序连线从 0 增到 1，WBS 里排在 Child A 后面、同属 Parent。对 Parent 按 Tab：新子级为 11 月 1 日–11 月 10 日，与 Parent 自身起止一致，并出现在 Parent 之下。`tsc --noEmit` 通过。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-12（Workmap：Flow map 的方向键）

**User（提示词/原意）**  
- 上下左右箭头键导航也需复用，交互规则跟 WBS map 保持一致。

**Assistant（实现前说明）**  
- WBS 按节点中心找该方向上最近的可见节点：主轴位移须大于 0.5px，分数为距离乘以方向偏离，直接父子只在分数相同时作最后比较，然后把节点滚进视口并留 48px 边距。Flow map 对当前看得见的条子用同一套。未选中、正在输入或正在改名时不移动选中。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 gdfgdfg 核对。Schedule 下从 Child B 按左落到 11 月 21 日那条同级，上回到 Child B，下再回到该同级；再按左落到 Parent，滚动为 left 1416（条左缘减 48）、top 3（条顶减 48）。从 Parent 按下落到 Child A。搜索框和改名框里按方向键不改变选中。Sequence 下从 Child A 按右落到下一列的同级卡。核对时一次合成指针把 Child B 挪到了 11 月 30 日–12 月 4 日，已在 WBS 改回 12 月 1 日–12 月 5 日，Flow 条左缘回到 3624。`tsc --noEmit` 通过。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-12（Workmap：左栏滚动条贴边）

**User（提示词/原意）**  
- 左侧栏文件过多时出现滚动条，占了横向位置，导致横向也出现滚动条。竖向滚动条应右移到左栏边缘，不占文件名称和操作图标的位置。

**Assistant（实现前说明）**  
- 左栏本身不滚动，却用了 `scrollbar-gutter: stable`，先空出约 15px。文件列表再在内部画出竖向滚动条，行宽仍固定 220px，于是内容比可视区宽，底部出现横向滚动条，操作图标也被挤进滚动条里。

**Assistant（实现后说明 / 本轮结论）**  
- 取消左栏的稳定槽位，列表铺满栏宽，竖向滚动条落在左栏右缘；行宽改为 100%，横向溢出关掉。已在页面上核对：有竖向滚动、没有横向滚动，滚动条右缘与栏右缘对齐，操作图标在滚动条左侧。回收站列表用同一套行宽。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/styles/aimlink-web-work-map-port.scss`  

### 2026-10-12（Workmap：WBS 左右 / 右左连线）

**User（提示词/原意）**  
- WBS map 的左右、右左模式下，根节点和 section 节点的连线位置有误，线没有连到 node 上。

**Assistant（实现前说明）**  
- 根节点和清单节点的样式宽度是 224px，布局和连线却按任务节点的 296px 计算。左右、右左从盒子左右缘出线，端点会落在可见节点外面。

**Assistant（实现后说明 / 本轮结论）**  
- 根与清单的布局宽度改为 224px，与样式一致。在 gdfgdfg 的左右布局上核对：根到 section、section 到任务的线端都落在节点左右缘中点（偏差为 0）。右左是同一套宽度的镜像。核对后已切回文字模式。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  

### 2026-10-12（Workmap：Flow map 展开父任务的套框）

**User（提示词/原意）**  
- Flow map 上展开的父任务需要略有区别：套框需前置，父任务本身加一点背景色。

**Assistant（实现前说明）**  
- 套框原先在网格和周末底色下面。展开的父任务条和普通条目一样是白底。把套框抬到网格前面，父任务条加一层浅暖色，子任务条保持白色。

**Assistant（实现后说明 / 本轮结论）**  
- 套框叠在网格和周末底色之上，条目和连线仍盖在套框上。展开的父任务条背景为浅暖色。已在 gdfgdfg 的 Flow map 上看过：Parent 为暖色条，套框盖住周末底色，Child A 仍是白条。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-12（Workmap：Flow map 套框边线与父任务底色）

**User（提示词/原意）**  
- 父任务的背景色过深，只需轻微区分。套框边缘应放在次顶层，顶层是各任务的连线小圈。

**Assistant（实现前说明）**  
- 父任务条用了较深的暖色。套框整块和任务条同一层，边线会被条盖住，连线小圈又包在任务条里，抬边线会把小圈盖住。底色改淡；套框拆成底层填色和上层边线，连线小圈单独画在边线上面。

**Assistant（实现后说明 / 本轮结论）**  
- 父任务底色改为约 6% 的琥珀色。套框填色仍在任务条下面，边线在任务条上面，连线小圈在边线上面。已在 gdfgdfg 的 Flow map 上点到父任务右端小圈，命中的是连线按钮而不是套框。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-12（Workmap：Flow map 父任务底色再减淡）

**User（提示词/原意）**  
- 展开父任务的底色加得更深了，应该大幅减淡。

**Assistant（实现前说明）**  
- 父任务条是 20% 透明琥珀，套框填色会透上来，叠在一起比白条深很多。改成不透明的极浅暖色，套框不再透过任务条。

**Assistant（实现后说明 / 本轮结论）**  
- 展开父任务条背景改为 `#fffdf8`。已在 gdfgdfg 的 Flow map 上核对：父任务条为 rgb(255, 253, 248)，子任务条仍是纯白。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

### 2026-10-12（Workmap：Flow map 套框后移、子任务数字标前置）

**User（提示词/原意）**  
- 套框后移，子任务数字标应该前置。

**Assistant（实现前说明）**  
- 套框边线叠在任务条上，数字标包在任务条里，会被边线压住。边线退到任务条后面，数字标拿到画布上、放在连线小圈下面。

**Assistant（实现后说明 / 本轮结论）**  
- 套框边线降到任务条后面。子任务数字标单独画在套框之上、连线小圈之下。已在 gdfgdfg 的 Flow map 上点到 Parent 角上的 5，命中的是折叠按钮。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-12（Workmap：Flow map 套框边线盖住任务边线）

**User（提示词/原意）**  
- 套框边线后置过多，应该覆盖 node 的边线，父子任务套框才显得整体。

**Assistant（实现前说明）**  
- 套框边线在任务条后面，父子任务各有自己的边，套在一起不连成一块。边线抬到任务边线之上，数字标和连线小圈仍留在更上面。

**Assistant（实现后说明 / 本轮结论）**  
- 套框边线盖住任务条边线，填色仍在条后面。数字标在边线之上，连线小圈在最上层。已在 gdfgdfg 的 Flow map 上看过：Parent 的上沿和左沿是套框边线，角上的 5 仍在前面。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

### 2026-10-12（Workmap：Flow map 父任务底色略加重）

**User（提示词/原意）**  
- 父任务的底色再加重一点。

**Assistant（实现前说明）**  
- 当前 `#fffdf8` 几乎看不出暖色。改成稍深的不透明暖色，套框填色仍不透过任务条。

**Assistant（实现后说明 / 本轮结论）**  
- 展开父任务条背景改为 `#fff6ee`。已在 gdfgdfg 的 Flow map 上核对：父任务条为 rgb(255, 246, 238)，子任务条仍是纯白。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

### 2026-10-12（Workmap：Flow map 拖动时父任务与套框按全组反算）

**User（提示词/原意）**  
- 拖动调整子任务时间时，父任务和套框的反算有 bug，要按所有子任务以及父任务本身的时间，不能只看当前正在调整的那条。

**Assistant（实现前说明）**  
- 拖子任务时父条已按全组取并集，但拖到和父条重合的边缘时，动的是父条自己的显示区间，套框会跟着收进去，其它子任务露在外面。拖动预览改为：正在拖的那条用新时间，父条和套框按父任务自身时间加上全部子任务的当前时间取并集。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 gdfgdfg 的 Flow map 上看过：把父条右端往里拖，套框仍停在最晚的子任务上；把最晚的子任务缩短到 Child B 左边，父条和套框停在 Child B；把与父任务同起点的子任务往后拖，父条左端仍停在父任务自己的开始时间。松手后数据未改。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-12（Workmap：Flow map Enter 同级从完成时刻开始）

**User（提示词/原意）**  
- Enter 创建同级时，新任务的开始时间应等于当前节点的完成时间。刚测试是完成时间再加 1 小时。

**Assistant（实现前说明）**  
- 跨天的任务，新同级的起点已经等于当前条的结束时刻。1 小时长的节点只把完成时刻写在标签上，再复制同样长度，新标签就会落在完成时刻之后 1 小时。这种同级改为从完成时刻起、长度为 1 天，标签上的开始时间就是该完成时刻。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 gdfgdfg 上看过：Child A 结束于 11 月 20 日，Enter 同级从 11 月 21 日 0 点开始，两条相接。`#2026/11/05 00:00` 这种 1 小时节点，Enter 同级的标签是 `#2026/11/05`，起点就是该完成时刻，不再是 01:00。测试条目已删。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-13（Workmap：Flow map 新建时长）

**User（提示词/原意）**  
- Enter/Tab 创建新 node，默认时长应该跟当前节点一样。点击空白处新建（未拖移），默认时长为当前视图的颗粒长度。

**Assistant（实现前说明）**  
- Enter/Tab 已按当前条的起止差复制时长；此前 1 小时节点的同级被改成 1 天，这次改回与当前节点相同。空白单击原先固定为 1 小时，改为占满指针所在的那一格（小时/天/周等当前刻度）。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 的 Flow map（日刻度）上看过：Enter 同级与 Tab 子级都是 5760 分钟，与当前条一致；空白单击新建为 1440 分钟，即一天。测试条目已删。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-13（Workmap：推送 Cloudflare Pages）

**User（提示词/原意）**  
- 推送 Cloudflare 构建发布。

**Assistant（实现前说明）**  
- 无新的代码改动。核对 `main` 与 `origin/main`，再看 GitHub 上 Cloudflare Pages 的检查结果。

**Assistant（实现后说明 / 本轮结论）**  
- `git push` 为 Everything up-to-date。提交 `a6d9641`（flow map精细优化）已在远程。Cloudflare Pages 检查为 Deploy successful，预览地址 https://17aa4a66.aim-link-v2.pages.dev 。

**关联**  
- https://github.com/jamesgao27/Workmap/commit/a6d9641  

### 2026-10-18（Workmap：Flow map Sequence 分列）

**User（提示词/原意）**  
- Schedule 先保持。Sequence 显示凌乱。横向分列要交错：宽列放任务，窄列放连线。父子套框跟 Schedule 一样，不能互相重叠，可以包含。任务顺序跟有时间线时一样：时间早的靠左，前序任务靠左。

**Assistant（实现前说明）**  
- Sequence 原先只按依赖深度分列，行还用 Schedule 的泳道，套框会叠住。改为按显示开始时间从左到右分列，前序再把后序推到右边；宽 200、窄 64 交替。行按套框重排，只在画面上算，不改 Schedule 已保存的泳道。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 的 Sequence 上看过：相邻列间距 264，任务宽 200、连线列宽 64。展开后 23 张卡、8 个套框，卡不重叠，套框只有包含关系。开始时间从左到右不回头，15 条连线的前序都在后序左边。核对后已收回展开并回到 Schedule。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  

### 2026-10-18（Workmap：Sequence 只按流程排布）

**User（提示词/原意）**  
- 连线列不必加不同底色，间距只是为了任务不重叠。并行连线要把后序任务分到不同行，避免连线叠在一起分不清起终点。去掉时间排期：没有依赖的任务在左侧往下排。Sequence 只体现任务之间的流程关系。

**Assistant（实现前说明）**  
- 去掉宽列/窄列的底色。列不再按开始时间排，只按前后序：没有前序的任务都在最左列，从上往下排。同一个任务的多个后序分到不同行。Schedule 的泳道仍不改写。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 的 Sequence 上看过：没有连线列底色，任务之间留空。展开后 15 条连线的前序都在左边，同一任务的后序不在同一行。没有前序的任务在最左列往下排。核对后已收回展开并回到 Schedule。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

### 2026-10-18（Workmap：Sequence 空行与子任务左对齐）

**User（提示词/原意）**  
- 自己测一下，Sequence 现在有很多空行。子任务仍要跟着父任务。流程里的第一个子任务（不一定是 WBS 的第一个）应与父任务左端对齐。

**Assistant（实现前说明）**  
- 空行来自全局分列：没有连线的子任务被放到第 0 列，套框再把别的任务往下推，中间行号空着。改为按父任务成组排：子任务的列是父任务列加上兄弟之间的流程波次，最早那一波与父任务左对齐；行在组内压紧，组与组上下相接，不留空行。不写回 Schedule 泳道。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 展开后的 Sequence 上看过：23 张卡、13 行连续（0 到 12），空行 0。8 组父子里，流程最早的子任务都与父任务同一左端，更靠后的子任务在右边。同一任务的并行后序不在同一行。套框只有包含、没有交叉。核对后已收回展开并回到 Schedule。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-18（Workmap：Sequence 套框不再叠成一块）

**User（提示词/原意）**  
- 层层叠叠，乱七八糟。

**Assistant（实现前说明）**  
- 子任务和后序兄弟挤在同一片矩形里，外框把旁边的任务和空白一起罩住，叠色变成一整块橙色。改为每个子任务块只占自己的列：后序只右移一列，前一个任务若有子任务，后序改到该块下方。套框按每一行有任务的范围描边，空白格子不再铺色。Schedule 套框仍是整块矩形。不写回泳道。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 展开后的 Sequence 上看过：23 张卡落在 6 列、15 行（0 到 14），没有空行。流程最早的子任务与父任务左端对齐，444 就在「阿时代方式地方」正下方。套框顺着任务走，下方空白不再被橙色盖住，套框之间没有交叉。核对后已收回展开并回到 Schedule。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

### 2026-10-18（Workmap：Sequence 圆角套框与流程图规则）

**User（提示词/原意）**  
- 套框样式不要改，仍应是圆角矩形，跟 Schedule 一样。Flow map 是从左上到右下的流程图：前序靠左，后序靠右；没有前后序关系的，WBS 靠前的靠上。父任务展开后是一张小流程图，子任务在套框里仍按这套规则排。节点不能重叠，展开的父任务套框也不能互相重叠，但可以包含子任务再展开的套框。Schedule 按时间轴算左右；Sequence 没有时间轴，只看前后序。

**Assistant（实现前说明）**  
- 去掉按行拼接的折线套框，恢复和 Schedule 相同的圆角矩形。Sequence 改为：每个展开的父任务是一块小流程图，前序整块在左、后序整块在右，没有连线关系的按 WBS 从上往下。块与块的矩形不交叉，子块落在父块里面。不写回 Schedule 泳道。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 展开后的 Sequence 上看过：套框是圆角矩形（圆角 8px），没有折线描边。23 张卡互不重叠。15 条连线的前序都在后序左边。8 个套框只有包含、没有交叉。没有前序的子任务与父任务左端对齐。核对后已收回展开并回到 Schedule。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

### 2026-10-18（Workmap：Sequence 连线转角加大）

**User（提示词/原意）**  
- 连线的转角半径需加大，以便更明确连线方向，尤其是连线重叠的地方。

**Assistant（实现前说明）**  
- Sequence 折线原来是直角。在任务列之间的空隙里把转角做成圆角，半径 28，并按横竖两段的长度收住，避免拐出节点。同一行的连线仍是直线。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 展开后的 Sequence 上看过：15 条连线里，3 条折线都带圆角，没有剩直角；从同一侧出发的两条线能看出各自往下再向右。核对后已收回展开并回到 Schedule。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-18（Workmap：Sequence 拖动与紧左紧上）

**User（提示词/原意）**  
- Sequence 模式下也要能拖动节点。拖动父任务时，套框整体移动。自动优化布局时，在不重叠的基础上紧左紧上排列。

**Assistant（实现前说明）**  
- 拖动只改 Sequence 的格子，不改 Schedule 的泳道。父任务拖动时，子任务跟着同一位移。松手时若会叠住别的任务或套框，就近挪到空位。整理画布从当前排布往上、再往左收，后序仍在前序右边。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 的 Sequence 上拖过「时代方式分」：它和子任务一起右移一列、下移两行，其他任务不动，Schedule 泳道未改，卡片没有重叠。整理画布后范围从 13 列 7 行收到 12 列 4 行，仍从左上角排起，套框没有交叉。测试位移已清掉，并回到 Schedule。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  

### 2026-10-18（Workmap：Sequence 缩放与 WBS 一致）

**User（提示词/原意）**  
- Sequence 模式增加缩放，跟 WBS map 的缩放效果和交互用同一套。

**Assistant（实现前说明）**  
- 工具栏放同一套缩放尺：60% 到 150%，档位 60、80、100、125、150。点加减或刻度用 220ms 过渡，拖滑块即时缩放，Ctrl/双指滚轮绕指针缩放。画布按比例缩放，滚轮仍是平移。Schedule 的时间比例尺不动。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 的 Sequence 上看过：默认 100%。点放大到 125%，卡片视觉宽度从 200 变为 250。Ctrl+滚轮收到 150% 上限。放大后仍能点中任务。切回 Schedule 后时间比例尺还在，缩放尺收起。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/styles/flowchart-editor.scss`  

### 2026-10-18（Workmap：Sequence 点击创建落在指针处）

**User（提示词/原意）**  
- Sequence 模式下，鼠标点击创建新 node，也应该点在哪儿创建在哪儿。只有 Tidy 画布时再自动调整位置。

**Assistant（实现前说明）**  
- 新建不再交给流程算法重排。指针所在格子就是新任务的位置，已有任务先按当前画面记下格子，避免被挤走。整理画布仍是唯一会重新紧左紧上的操作。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 的 Sequence 上点过第 1 列第 0 行的空位：新任务出现在该格，原有 6 张可见卡都没动。测试任务已删掉，并回到 Schedule。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-18（Workmap：父任务条与套框宽度不一致）

**User（提示词/原意）**  
- 检查「尊界666汽车全面测评项目WBS」这张 Schedule 图，为何有的父任务长度和套框不一致。

**Assistant（实现前说明）**  
- 无代码变更。对照父任务存档时间、子任务时间和画面上的条宽、套框宽。

**Assistant（实现后说明 / 本轮结论）**  
- 周视图下一天大约 19 像素，短任务最短画成 36 像素。父任务条按真实起止（含子任务最早到最晚）画，套框按画出来的色块外缘包，所以右边普遍长出约 17–18 像素。左边都对齐。例如工艺评价条宽 56、套框 73；功能实测条宽 93、套框 110。未改代码。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  

### 2026-10-18（Workmap：父任务条与套框按反算时间对齐）

**User（提示词/原意）**  
- 父任务长度应和套框保持一致。显示按反算的起止时间来。父任务的数据只在拖动其排期时更新。

**Assistant（实现前说明）**  
- 短任务不再被加到 36 像素。套框左右边改用父任务反算后的起止时间，和父任务条同一段。拖动某个父任务时，只把这一条的存档改成当时的显示区间；子任务和其他父任务的存档不动。

**Assistant（实现后说明 / 本轮结论）**  
- 已在「尊界666汽车全面测评项目WBS」的 Schedule 上看过：20 个展开的父任务，条的左右端都和自己的套框对齐。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  

### 2026-10-22（Workmap：Flow map 时间轴可无限拖移）

**User（提示词/原意）**  
- 以时为颗粒时，空画布没有以当前时刻为中心，甚至拖不到当前时间。其他颗粒以当前为中心，但两头有边界，不能拖出去。空画布应以当前时间为中心，左右可无限拖移。有内容的画布记住上次退出时的画布中心。

**Assistant（实现前说明）**  
- 时间轴不再停在当天 0 点后固定十几个颗粒。空画布打开时把当前时刻放在视口中间，左右接近边缘就继续加时间。有任务的图记下视口中心，下次打开回到那里。

**Assistant（实现后说明 / 本轮结论）**  
- 已在「尊界666」的小时视图上看过：画布比视口宽，拖到左边缘时左侧时间会加长，拖到右边缘时右侧时间会加长，不会停在固定边界。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/schedule-time.ts`  

### 2026-10-22（Workmap：小时格子断开与点击落点）

**User（提示词/原意）**  
- 仍有问题：格子不连续，点击和拖放创建新节点也不知道到哪儿去了。

**Assistant（实现前说明）**  
- 左侧留白用了 padding，刻度和色块仍按 0 点坐标画，视口跨过留白时格子会断开，点击换算的时间也对不上。改成同一个时间原点：刻度、格子、色块、点击都用「原点分钟 + 像素」。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 的小时视图上看过：竖线间距连续，相邻大约 7–8 像素。在格子上点击新建，新任务左端离点击点约 4 像素（吸到该小时起点）。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-document.ts`  
- `/Users/macbook/Workmap/apps/web/src/lib/map-view-align.ts`  

### 2026-10-22（Workmap：小时颗粒按一小时画）

**User（提示词/原意）**  
- 小时颗粒时，点击或拖放创建的节点时间总比预期迟一小时，也无法拖放调整成一小时长度，似乎最短是 2 小时。

**Assistant（实现前说明）**  
- 正好一小时的任务被当成截止点，在小时视图里画成两小时，右端对齐到下一个整点。色块因此多占一小时，拖短也会停在两小时。

**Assistant（实现后说明 / 本轮结论）**  
- 小时视图里这条色块改为一小时宽，和指针下的那一格一致。最短可以拖成一小时。已在 v543 的小时视图上看过：新任务设定宽度等于相邻竖线的间距。测试任务已删除。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/flowchart-layout.ts`  

### 2026-10-22（Workmap：底栏说明与小时比例）

**User（提示词/原意）**  
- 参考 WBS map，精简底部操作说明，只留主要操作。没写在底栏上的，同样放进操作说明浮窗。小时颗粒的比例再放大一倍。

**Assistant（实现前说明）**  
- 底栏改成短句，工具栏加 Shortcuts。拖移、缩放、点击新建和拖改时间放进浮窗。小时档最大比例从大约两天铺满视口改为大约一天。

**Assistant（实现后说明 / 本轮结论）**  
- 底栏只留 Double-click、Enter、Tab、Delete、Arrows 和 @。Shortcuts 浮窗能打开，里面是其余操作。v543 小时视图竖线间距从约 7 像素变为约 15 像素。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  
- `/Users/macbook/Workmap/apps/web/src/lib/schedule-time.ts`  

### 2026-10-22（Workmap：画布内屏蔽浏览器前进后退）

**User（提示词/原意）**  
- 焦点在两种画布内时，需要屏蔽左右滚动（双指滑动）触发浏览器的前进后退导航。

**Assistant（实现前说明）**  
- 指针进入或焦点留在 WBS map、Flow map 画布时，取消横向滚轮的默认行为，并暂时禁止页面横向回弹。离开画布后恢复。画布平移仍使用这次滚动。

**Assistant（实现后说明 / 本轮结论）**  
- 已在 v543 的两块画布上看过：画布内横向滚轮会被拦住，侧栏上的不会。未 commit。

**关联**  
- `/Users/macbook/Workmap/apps/web/src/lib/block-history-swipe.ts`  
- `/Users/macbook/Workmap/apps/web/src/pages/mind-map/MindMapEditorPage.tsx`  
- `/Users/macbook/Workmap/apps/web/src/components/flowchart/FlowchartEditor.tsx`  


### 2026-10-27（Vouchap：Expenses 同名 Payee 拆成两组）

**User（提示词/原意）**  
- vouchap 项目中，web 端同样的 entity，expenses 列表上出现了两组 payee。注：这个 space 的所有 costco 都 merge 成同一个 entity 了。截图：两个 “Costco Wholesale” 分组（75 / 3 receipts）。

**Assistant（实现前说明）**  
- Payee 分组键是 `getCanonicalEntityId`，不是显示名。怀疑列表加载 merge 解析后仍把部分小票留在子 entity id 上：`database.ts` 映射 raw join 时只读 `mergedIntoId`（漏 `merged_into_id`），且未把 `entity.id` / `entityId` 写成 resolve 后的 root；`getEntityMergeMap` 未翻页可能截断。拟在 `entities.ts` 增加 join/resolve 辅助，并修 receipts / inbound / outbound / invoices 列表映射。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `mapJoinedEntityRow`、`pickResolvedEntityForList`：列表行始终暴露 canonical root id。  
- `getEntityMergeMap` 改为 `fetchAllPages`，避免 PostgREST ~1000 行静默截断导致部分 merge 未解析。  
- `getReceiptsForListFirstPaint` / `getAllReceiptsForList` / `getAllReceipts` 及 inbound/outbound/invoices 列表同步改为 resolve 后写回 `entityId` + canonical `entity`。  
- 验证：硬刷新 Expenses，按 Payee 分组并搜 cost，应只剩一组 Costco Wholesale（75+3）。若仍拆两组，再到 Entities 确认是否仍有两个未 merge 的根。未 commit。

**关联**  
- `vouchap-app/src/shared-logic/entities.ts`  
- `vouchap-app/src/shared-logic/database.ts`  
- `vouchap-app/src/shared-logic/inbound.ts` / `outbound.ts` / `invoices.ts`  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`（分组消费 `getCanonicalEntityId`）

### 2026-10-27（Adaven-CRM：Wholestore Edge Function 非 2xx 复现）

**User（提示词/原意）**  
- CRM 中访问 wholestore，提示 Edge Function returned a non-2xx status code；其他应用正常。

**Assistant（实现前说明）**  
- 与 2026-10-03 同症状：Hub `product-ops` 对 Wholestore 调 `crm.space_orders` / `sku_edition`。先查 `authenticator.pgrst.db_schemas` 与 REST `Accept-Profile: crm`。

**Assistant（实现后说明 / 本轮结论）**  
- 实测 Wholestore REST：`spaces` 200；`crm.*` 返回 **PGRST106 Invalid schema: crm**，hint 仅 `public, graphql_public, provider, consumer`。  
- `pg_roles.authenticator.rolconfig` 当时**没有** `pgrst.db_schemas`（迁移 `20261004034500` 仍标 applied，配置被平台重置清掉）。Portalflow 仍含 `crm`，故其他产品正常。  
- 已现场重跑 GRANT + `ALTER ROLE authenticator SET pgrst.db_schemas = '... crm'` + NOTIFY；复查 orders/sku 200。  
- 新增并 `db push`：`apps/wholestore-app/supabase/migrations/20261027210000_reassert_crm_postgrest_schemas.sql`；更新 APPLY.md / `038_expose_crm_postgrest.sql` 注释。刷新 CRM 选 Wholestore 即可。未改 CRM 前端，未 commit。

**关联**  
- `Adaven-platform/apps/wholestore-app/supabase/migrations/20261027210000_reassert_crm_postgrest_schemas.sql`  
- `Adaven-platform/packages/db-platform/sql/038_expose_crm_postgrest.sql`  
- `Adaven-CRM/supabase/functions/product-ops/index.ts`

---

### 2026-10-27（Vouchap Web：Expenses Items 分组合计）

**User（提示词/原意）**  
- Vouchap Web 的 expenses items 列表，分组也要加上小组金额合计，跟 expenses 列表一样。

**Assistant（实现前说明）**  
- Expenses 分组头已把 `totalAmount` / `currency` 交给 `DataTable`（组内最多币种，汇率折算，紫色金额）。Items 分组只有条数。拟在 `receipt-items.tsx` 对每个小组用行金额 `price` 做同样合计。未分组仍是平铺表，不加 “All” 头。

**Assistant（实现后说明 / 本轮结论）**  
- `receipt-items.tsx` 加载汇率，分组标题增加折算后的金额合计（与 Expenses 相同的主币种规则和紫色）。`DataTable` 已有展示，合计为 0 时不显示。  
- 未在浏览器走通登录后的 Items 页（本机没有在跑的 Web 服务）。请在 Web 打开 Expenses → Items，任选一种 Group，确认每组标题右侧有条数和金额。未 commit。

**关联**  
- `vouchap-app/src/mobile-ui/app/receipt-items.tsx`  
- `vouchap-app/src/mobile-ui/components/DataTable.tsx`（分组头已支持 `totalAmount`）

---

### 2026-10-27（Vouchap：Record Date 筛选改为日期区间）

**User（提示词/原意）**  
- Expenses 列表筛选项里的 Record date 应采用自定义日期区间，而不是逐日勾选。其他列表也一样。

**Assistant（实现前说明）**  
- 现有 Record Date 筛选是勾选已出现的单个记录日。Expenses、Income、Inbound、Outbound 四处相同（Web 浮层和移动端底栏都有）。拟抽共用 From / To 组件，按 createdAt 的本地日历日做含首尾区间；只填一端则另一端不限；起止填反时自动对调。分组方式不变。

**Assistant（实现后说明 / 本轮结论）**  
- 新增 `RecordDateRangeFilter`。四个列表的 Record Date 子菜单改为 From / To。Web 用日期输入框，iOS / Android 用系统日期选择器。筛选按钮计数在设置了区间时记 1。Clear 会清掉区间。  
- 区间判断用本地日历日核对过：区间内、同一天、开区间、起止颠倒、未设区间均符合预期。未在登录后的页面上点过筛选（本机没有在跑的 Web 服务）。未 commit。

**关联**  
- `vouchap-app/src/mobile-ui/components/RecordDateRangeFilter.tsx`  
- `vouchap-app/src/mobile-ui/app/receipts.tsx`、`invoices.tsx`、`inbound.tsx`、`outbound.tsx`

---

### 2026-11-03（Adaven-CRM：Portalflow 与 Wholestore Edge Function 非 2xx）

**User（提示词/原意）**  
- adaven-CRM 上 portalflow 和 wholestore 两个应用又出现报错：Edge Function returned a non-2xx status code。

**Assistant（实现前说明）**  
- 与 10-03 / 10-27 相同路径：Hub `product-ops` 读各产品 `crm.space_orders` / `sku_edition`。先用 service role 打 REST `Accept-Profile: crm`，对照 `authenticator.pgrst.db_schemas`。不改 CRM 前端。

**Assistant（实现后说明 / 本轮结论）**  
- Portalflow REST hint 只剩 `public, graphql_public`（`crm` / `provider` / `consumer` 都没了）。Wholestore hint 为 `public, graphql_public, provider, consumer`，又没有 `crm`。`spaces` 仍是 200，所以前端整页显示 Edge Function 非 2xx。Vouchap 的 `crm` 正常。  
- 已在两个生产库重跑 GRANT + `ALTER ROLE authenticator SET pgrst.db_schemas` + NOTIFY，并把迁移标为 applied：Portalflow `20261104020000_reassert_postgrest_schemas.sql`（含 provider/consumer），Wholestore `20261104020000_reassert_crm_postgrest_schemas.sql`。复查 `crm.space_orders` / `sku_edition` / `sku_addon` 以及 provider、consumer 均为 200。  
- Wholestore `config.toml` 补了 `[api].schemas`，避免以后 config push 再丢掉 `crm`。未改 CRM 前端，未 commit。刷新 CRM 再选这两个产品即可。平台仍可能再次清掉 `authenticator` 角色配置；若复发，按各自 `supabase/APPLY.md` 重跑对应 SQL。

**关联**  
- `Adaven-platform/apps/portalflow-app/supabase/migrations/20261104020000_reassert_postgrest_schemas.sql`  
- `Adaven-platform/apps/wholestore-app/supabase/migrations/20261104020000_reassert_crm_postgrest_schemas.sql`  
- `Adaven-CRM/supabase/functions/product-ops/index.ts`

---

### 2026-11-08（Receiptap 与 Portalflow 拆开）

**User（提示词/原意）**  
- 按已确认计划拆开：Receiptap 回到 Vouchap 代码和库 `giuacjbfsyrristkigmz`，仓库改名为 Receiptap，新商店包名 `com.receiptap.app`，版本从 1.0.0 起。已上架的 Vouchap（`com.vouchap.app`）回退到 2026 年 11 月之前的版本并停更，名称和版本说明恢复成当时的 Vouchap。Portalflow 只保留事务所 CRM 和客户门户，不再用它构建 Receiptap。迁移后写在 Portalflow 库的记账补回原库。这次不做 engagement 调用 Receiptap。

**Assistant（实现前说明）**  
- 沿用 Expo 项目 `f98c5cea-fd51-41e3-9c9c-1512c6b1a8e7`。改 `vouchap-app` 的名称、包名、scheme、图标和版本；Android 只改 applicationId，namespace 保持 `com.vouchap.app`。把 Portalflow 库里 11 月 4 日之后新增或改过的 entities / receipts / invoices 及明细 upsert 回 Vouchap 库。EAS production 环境指回原库。Portalflow 去掉 Receiptap 的 EAS profile 和 Pages 部署。商店能用 Play API 做的先做，需要人工点确认的单独交代。

**Assistant（实现后说明 / 本轮结论）**  
- GitHub 仓库已改为 `jamesgao27/Receiptap`，本地 remote 已更新。应用标识改为 Receiptap / `com.receiptap.app` / scheme `receiptap` / 1.0.0（构建号 1）。EAS 版本源改为本地，避免沿用 Vouchap 的远程 2.6.7 计数。启动图标换成收据标。  
- 记账已补回：四张 11 月 4 日之后的新收据在原库中。EAS production 的 Supabase URL 已指回 `giuacjbfsyrristkigmz`。  
- Play：商店标题和简介已改回 Vouchap。11 月的包不能直接降回 versionCode 61，所以用 7 月 24 日的 2.6.6 源码打了 versionCode 70，并已提交到 `com.vouchap.app` 生产轨道（已完成）。新 Receiptap Android 1.0.0（versionCode 1）已构建完成，商店商品尚未建立，所以还没提交。  
- App Store Connect 没有本机 API 密钥，2.6.7（build 51）是否已对用户开放无法在这里改。  
- Receiptap Web 已导出，Wrangler 本机登录失效，还没传到 Pages `receiptap`。  
- 未做两个库之间的 engagement 读取。

**关联**  
- `vouchap-app/app.config.js`、`android/app/build.gradle`、`wrangler.toml`  
- `Adaven-platform` 的 Portalflow 部署配置

---

### 2026-11-08（Receiptap iOS 证书登录）

**User（提示词/原意）**  
- 已经登录 Apple，继续做 iOS 构建。

**Assistant（实现前说明）**  
- 无代码变更。用已有 EAS 账号为 `com.receiptap.app` 走交互式 iOS 证书。网页登录和 Developer Portal 密码不是同一次会话。

**Assistant（实现后说明 / 本轮结论）**  
- EAS 仍要求 Apple ID 密码。自动应答把预填的 Apple ID 当成了另一次确认，密码框收到了错误内容。Apple 返回账号 `james.aim.link@gmail.com` 因安全原因被锁定（错误 -20209）。没有重试，没有打出 iOS 包。需要先在 https://iforgot.apple.com 解锁，再用 App 专用密码登录。
- 随后按用户要求，在本机「终端」窗口重新执行 `eas build --platform ios --profile production`，密码由用户自己输入。证书已就绪，iOS 1.0.0 已上传并排队：`5459f67b-6dc2-40b2-bcc1-6be269e5d722`。

---

### 2026-11-08（App Store 上现有应用名称）

**User（提示词/原意）**  
- App Store Connect 里现有应用还显示 Receiptap，是否要手动改回 Vouchap。

**Assistant（实现前说明）**  
- 无代码变更。现有商品是 Apple ID `6758536342` 的旧 Vouchap，本月只改了商店名称。新包 `com.receiptap.app` 还没有对应商品。

**Assistant（实现后说明 / 本轮结论）**  
- 要手动把这条旧商品的名称和本月的 What's New 改回 11 月之前的 Vouchap。不要改它的 Bundle ID。新的 Receiptap 需要另建一条商品。
- 用户确认打 `2.6.8` 回退。已用 7 月 24 日源码构建并提交 iOS `2.6.8`（构建号 52）到旧应用 `6758536342`。
- 用户要求把 Receiptap 新包交到新建的 Apple 和 Google 商品。iOS `1.0.0`（构建号 1）已传到新应用 `6832428828`。用户给提交账号加了新应用权限后，Android `1.0.0`（versionCode 1）已交到 `com.receiptap.app` 的内部测试轨道。提交 `8aee8e2c-4eea-4557-88fc-ad66cb9aeb02`。

---

### 2026-11-09（Receiptap Web 回到原站点，Portalflow 只留事务所）

**User（提示词/原意）**  
- Web 恢复用原来的 Vouchap 网页，名称改为 Receiptap。Portalflow 发布的 Receiptap 作废，包括代码和已创建的 Cloudflare 项目。Portalflow 只留事务所功能，Web 不再切换到客户类型的 space。

**Assistant（实现前说明）**  
- 原网页在 Pages 项目 `vouchap`。Portalflow 建的项目是 `receiptap`。事务所端把可选空间收成 Firm，登录后若当前空间不是事务所就改到事务所空间。

**Assistant（实现后说明 / 本轮结论）**  
- 已删除 Pages 项目 `receiptap`，并把原 Vouchap 网页以名称 Receiptap 发到项目 `vouchap`（`vouchap.pages.dev` 标题为 Receiptap）。`receiptap.aim.link` 已在该项目登记，DNS 仍缺指向 `vouchap.pages.dev` 的 CNAME。  
- Portalflow 不再构建 Receiptap。Web 空间列表和新建空间只有 Firm。  
- 客户邀请页仍在，但事务所登录后的 Web 不会进入客户空间。

---

### 2026-11-09（Pages 项目名改为 receiptap）

**User（提示词/原意）**  
- Cloudflare 的项目名称和默认 URL 要从 vouchap 改成 receiptap。

**Assistant（实现前说明）**  
- Pages 的 `*.pages.dev` 不能在原项目上改名。新建项目 `receiptap`，把站点发上去，再删掉旧项目 `vouchap`。

**Assistant（实现后说明 / 本轮结论）**  
- 项目名是 `receiptap`，默认地址 https://receiptap.pages.dev 标题为 Receiptap。`receiptap.aim.link` 已指向它。旧项目 `vouchap` 已删除。`vouchap.aim.link` 和 `platform.vouchap.com` 的 CNAME 还没改到 `receiptap.pages.dev`。

---

### 2026-11-09（Receiptap 标志用到记账项目各处）

**User（提示词/原意）**  
- 把之前给 Portalflow 的 Receiptap 新标志用到现在 Receiptap 项目的网页、App 等各处露出。

**Assistant（实现前说明）**  
- 新标志是紫底收据加绿色对勾。登录、侧栏等还在用旧的 tax 标志。

**Assistant（实现后说明 / 本轮结论）**  
- 登录、注册、设密码、建空间和 Web 侧栏改用新标志。浏览器图标和 iOS/Android 启动图标已从同一张图重新生成。网页已发到 `receiptap.pages.dev`。已上架的安装包要等下一次构建才会带上新启动图标。
