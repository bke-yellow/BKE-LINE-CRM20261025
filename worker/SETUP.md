# AI 摘要後端部署

網站前台已加入 AI 摘要操作頁面；後端程式是 worker/index.js，但尚未部署。

1. 在 Cloudflare Workers 建立 Worker，使用 worker/index.js。
2. 在 Worker 的加密環境變數中設定 OPENAI_API_KEY 與 BKE_ACCESS_TOKEN。
3. 部署後，複製 Worker HTTPS 網址。
4. 到 BKE 網站「客戶對話摘要」輸入網址及存取密碼，即可依客戶和日期送出最多 200 則訊息。
5. 核對 AI 判斷與引用的原始訊息後再保存摘要。

限制：API 另外收費；只限測試用途；尚未具備正式多人登入、細緻權限、使用量限制及雲端同步。請先以非敏感測試對話驗證，勿將任何密鑰提交到 GitHub。
