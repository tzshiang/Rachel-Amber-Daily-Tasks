# Claude Code → GitHub → Vercel → Supabase 標準開發流程

這份手冊把「安安樂樂打卡 App」實際走過的流程，整理成可以重複套用在**任何新 App** 的標準作業程序（SOP）。
每次開新專案，照著「Phase 1 → 4」跑一次，並用第 6 節的總檢查清單逐項確認，就能避開這次踩過的坑。

另見：[案例學習手冊](./dev-guide.md) —— 這份 SOP 對應到的真實開發過程與每一步的完整記錄。

## 總覽：四個階段在做什麼

| 階段 | 目的 | 主要產出 | 最容易出錯的地方 |
|---|---|---|---|
| 1 · 需求訪談 | 把想法講清楚，讓 Claude Code 一次做對 | 功能清單、視覺風格、資料需求 | 需求太模糊，改動範圍抓不準 |
| 2 · GitHub 版控 | 保存程式碼歷史、作為部署來源 | repo、branch、commit、PR | 全新 repo 沒有初始 commit，PR 開不起來 |
| 3 · Vercel 部署 | 把程式碼變成大家看得到的網址 | 正式網址、自動化部署 | Production Branch 設定錯，正式網址不會自動更新 |
| 4 · Supabase 資料 | 資料跨裝置保存、即時讀寫 | 資料表、RLS 規則、API 金鑰 | 忘記開 RLS，或環境變數加了沒重新部署 |

## 01 · 需求訪談：跟 Claude Code 談需求

開口之前，把下面五件事想清楚，一次講給 Claude Code 聽，可以省掉很多來回修改：

- **功能清單** —— 這個 App 要做哪些具體的事（例如：每天有哪些任務要打卡）
- **使用者是誰** —— 誰會用、用在什麼裝置上（手機／平板／電腦），會不會有「小孩用」跟「家長看」兩種身分
- **視覺風格** —— 有沒有指定顏色、氛圍、參考對象（例如「7 歲小女孩喜歡的風格」）
- **資料要不要跨裝置** —— 如果只有一台裝置用，localStorage 就夠；如果要多裝置看到同一份資料，一開始就講清楚，直接規劃走 Phase 4 的雲端資料庫，不用等做完才回頭改
- **要不要有後台** —— 有沒有「管理者」視角需要跟一般使用者不一樣

> **建議：** 把這五點當成每次開新 App 的固定開場白模板，即使你只是隨口講，Claude Code 也會主動追問缺的部分。

## 02 · GitHub 版本控管 SOP

### 新 repo 第一步驟（一定要做，順序不能顛倒）

- [ ] **先確認 repo 不是全新空的** —— 全新的 repo 必須先有一個 default branch（`main`）上帶著至少一個 commit，之後開的功能分支才有地方可以合併回去
- [ ] **建立功能分支** —— 命名建議 `claude/<功能簡述>`，跟 `main` 分開改動
- [ ] **每個階段性修改都獨立 commit** —— commit message 說清楚「為什麼」而不只是「做了什麼」
- [ ] **推上 GitHub 後開 PR** —— 即使是自己一個人開發，PR 也能當作「這批修改」的清楚邊界，方便回頭看部署紀錄

> **這次踩過的坑：** repo 建立時完全是空的（連 `main` 都沒有），導致 PR 開不起來。解法是先建一個空的 `main` 分支塞一個初始 commit，再把功能分支的歷史接上去。**下次開新專案，第一件事就是確認 default branch 上有沒有東西**，沒有的話先補一個最小可行的初始 commit。

### 分支策略：兩種模式，看規模選一種

**推薦・個人小專案：直接在 main 上快速迭代**
沒有其他協作者需要 review 時，做完一個小改動就直接合併回 `main`，不要讓功能分支活太久。最大好處：**完全避開 Production Branch 混淆的問題**，因為 Vercel 永遠只看 `main`。

**適合・需要審核的專案：Feature Branch + PR**
改動先留在功能分支上，讓 Vercel 產生 Preview 網址測試沒問題後，再合併進 `main`。好處是正式網址在測試完成前不會被未完成的功能影響，代價是要多一道「合併」的手續才會上線。

## 03 · Vercel 部署 SOP

### 連接專案時要設定的三件事

- [ ] **Settings → Git → Production Branch** —— 確認設成 `main`（或你真正持續在用的那條分支）。這一步決定了「哪個分支的 push 會自動更新正式網址」
- [ ] **Framework Preset** —— Vite / Next.js 等專案通常會自動偵測，確認 Build Command 和 Output Directory 沒有跑掉
- [ ] **Environment Variables** —— 每一筆都要選正確的 Scope（至少勾 Production；如果還會用到 Preview 網址測試，Preview 也要勾）

> **這次踩過的坑：** 功能分支不是 Production Branch，導致每次 push 只產生 Preview 網址，正式網址要手動 Promote 才會更新，一度誤以為「沒有自動部署」。**只要確保開發用的分支最終都會合併進 Production Branch，就不會再遇到這個問題。**

### 環境變數的鐵律

前端框架（Vite / Next.js）的環境變數是在**建置當下**就寫死進程式碼，不是網站執行時才讀取。所以只要新增或修改了環境變數，一定要：

- [ ] 回到 Deployments 分頁，手動觸發一次 **Redeploy**（或直接 push 一個新 commit）
- [ ] 確認新的部署狀態是 **Production** 而不是 **Preview**

## 04 · Supabase 資料庫 SOP

### 建立專案與資料表

- [ ] 建立專案，Region 選離使用者最近的（例如台灣 / 東南亞使用者選 Singapore 或 Northeast Asia）
- [ ] 資料表結構先想清楚「誰擁有這筆資料」，設計對應的 primary key（例如 `使用者 id + 日期 + 項目` 的複合主鍵）
- [ ] 把建表語法存成 `supabase/schema.sql` 放進 repo 一起版控，之後開新環境（例如測試用專案）可以直接重跑

### 安全設定：每張表都要做

- [ ] **開啟 RLS**（Row Level Security）—— 沒有登入系統的小工具可以設「任何人都能讀寫」，但一定要**明確設定**，不要留預設值
- [ ] 需要保護隱私的資料，RLS 規則要綁使用者身分（搭配 Supabase Auth），不能只靠「網址沒人知道」當作防護

> **提醒：** RLS 沒開的表，即使用了「公開安全」的 anon key，任何人都能無限制讀寫整張表 —— 這是最容易忽略但影響最大的一步。

### App 端串接

- [ ] 裝 `@supabase/supabase-js`，用環境變數存 Project URL 跟 anon / publishable key
- [ ] App 啟動時先讀一次資料（init），並處理「還沒連上」「連線失敗」兩種畫面，不要讓使用者卡在空白畫面猜發生什麼事
- [ ] 寫入操作採用「先更新畫面、再送出請求，失敗就復原」（optimistic update），操作起來才會跟本機儲存一樣即時

## 06 · 總檢查清單：每次開新 App 都跑一次

1. **[Phase 1]** 把功能清單、使用者、視覺風格、跨裝置需求、後台需求五件事講清楚
2. **[Phase 2]** 確認 GitHub repo 的 default branch 上有初始 commit
3. **[Phase 2]** 功能分支命名、commit message 交代清楚改動原因
4. **[Phase 2]** 小專案直接快速合併回 main；需要審核才走 PR 流程
5. **[Phase 3]** Vercel Settings → Git → Production Branch 設成你實際部署用的分支
6. **[Phase 3]** 環境變數逐一確認 Scope，新增或修改後手動 Redeploy 一次
7. **[Phase 3]** 部署完成後檢查 Deployments 分頁的標籤是 Production
8. **[Phase 4]** Supabase 建表語法存進 repo 版控
9. **[Phase 4]** 每張表都明確設定 RLS 規則，不留預設值
10. **[Phase 4]** App 端環境變數對應 Supabase Project URL / anon key，並處理連線中／失敗畫面

## 07 · 快速故障排除表

| 症狀 | 最可能的原因 | 怎麼查 |
|---|---|---|
| PR 開不起來 / 找不到可合併的分支 | default branch 是空的，沒有共同歷史 | 檢查 `main` 是否有任何 commit |
| 推送了新 commit，正式網址卻沒變 | 推送的分支不是 Production Branch | Vercel → Deployments，看最新部署標籤是 Production 還是 Preview |
| App 畫面顯示「尚未連接雲端資料庫」 | 環境變數沒設，或設了但沒有重新部署 | Vercel → Settings → Environment Variables 確認存在，再手動 Redeploy 一次 |
| 操作後畫面沒反應，重新整理才看得到結果 | 前端狀態更新邏輯沒有正確訂閱資料變化 | 檢查該畫面的資料來源是不是「呼叫一次性函式」而不是「訂閱狀態」 |
| 資料讀不到，或寫入被拒絕 | RLS 規則沒開，或規則寫得太嚴格 | Supabase → Table Editor → 該表的 Policies 分頁 |

## 08 · 金鑰安全速查表

| 金鑰 | 能不能寫進前端程式碼 | 用途 |
|---|---|---|
| Supabase `anon` / `publishable` key | ✅ 可以公開 | 瀏覽器端讀寫，靠 RLS 規則把關 |
| Supabase `service_role` key | 🚫 絕不能公開 | 後端管理用，繞過所有 RLS 規則 |
| Supabase 資料庫密碼 | 🚫 絕不能公開 | 直連資料庫用，只在建立專案時自己保管 |
| Vercel 環境變數（`VITE_` / `NEXT_PUBLIC_` 開頭） | ✅ 會被打包進前端 | 設計上就是給瀏覽器讀的，不要放真正的機密 |
| 其他沒有前綴的環境變數 | 🚫 只留在伺服器端 | 用於伺服器端 API / serverless function |

---

這份 SOP 會隨著開發更多 App 持續補充。下次遇到新的坑，可以請 Claude Code 把新學到的教訓加進對應的階段。
