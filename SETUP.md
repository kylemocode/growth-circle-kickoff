# Setup

## 本機開發

```bash
npm install
npm run dev
```

需要 `.env.local`（已 gitignore），格式：

```
VITE_FB_API_KEY=...
VITE_FB_AUTH_DOMAIN=...
VITE_FB_PROJECT_ID=...
VITE_FB_STORAGE_BUCKET=...
VITE_FB_MESSAGING_SENDER_ID=...
VITE_FB_APP_ID=...
```

→ 從 Firebase Console → 專案設定 → 您的應用程式 拿到。

## Vercel 部署

在 Vercel project Settings → Environment Variables 加入上面 6 個變數，
然後 redeploy 一次。

## Hidden routes

- `/#/wall-of-fame` — Admin 合照牆（不在首頁顯示入口）

## Firebase 設定提醒

- Firestore：collection `photos`
- Storage：path `photos/{id}.jpg`
- 測試模式 30 天後鎖死，活動完即可關閉 project
