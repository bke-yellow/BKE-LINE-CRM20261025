# BKE 客戶 LINE 智慧管理系統

前端試用版 V1.1，使用紅色、莫蘭迪色與蒂芬藍。網站入口為根目錄 index.html。

## GitHub Pages 啟用步驟
1. 開啟本儲存庫的 Settings → Pages
2. Build and deployment：Source 選 Deploy from a branch
3. Branch 選 main，Folder 選 /(root)，按 Save
4. 等待 GitHub 顯示部署完成後開啟 https://bke-yellow.github.io/BKE-LINE-CRM20261025/

## 試用功能
- 首頁：每日重要事項、案件、報價與訂單概況
- LINE TXT：選擇多個檔案；規則式解析常見日期、時間與發言人格式；去重
- 客戶、產品案件、工作進度、新增／編輯
- 報價、訂單及已交貨數量記錄
- P0–P3 優先事項排序
- 日報、彙總報表、CSV 匯出、列印成 PDF
- JSON 備份與還原

## 使用限制與保護
這是**僅供單一瀏覽器試用**的前端版；資料儲存在該瀏覽器 localStorage，沒有伺服器資料庫、跨裝置同步、公司帳號權限或 AI API。每個工作者看到的是各自的本地資料。請勿將真實客戶個資、商業機密或未公開配方放進公開 GitHub 原始碼或 Issues。正式多人版需建置登入及私有資料庫，並確認資料保護需求。

目前 TXT 分析為規則式，不具備 AI 語意判斷能力；匯入的資料需人工確認。週報目前為既有資料彙總，尚無嚴格歷史週別快照。
