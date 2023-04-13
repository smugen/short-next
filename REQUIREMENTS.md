---
tags: HR
---

# 2023 年 2 月全端工程師 專案實作

請自行實作一個專案，是可以建立[短網址](https://en.wikipedia.org/wiki/URL_shortening)的服務，需求如下：

## 必要需求

- [x] 專案需要使用 [Git](https://git-scm.com/) 管理專案，並公開至 [GitHub](https://github.com/)
- [x] Git commit 訊息需符合 [Conventional Commits](https://www.conventionalcommits.org/zh-hant/v1.0.0/)，並使用英文撰寫
- [x] 專案須包含 [`README.md`](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/about-readmes)，其中描述專案的安裝、建置、使用，包含的功能與操作方式
- [x] 前端使用 [React.js](https://zh-hant.reactjs.org/) 16 以上實作整個頁面與元件
- [x] 後端使用 [Node.js](https://nodejs.org/en/) 14 以上
- [x] 使用者可以填入一段網址，會產生一段短網址
- [x] 使用者可以瀏覽短網址，服務會將短網址重新導向到原始網址

## 專案需符合以下==至少兩項==需求

- [x] 使用 [TypeScript](https://www.typescriptlang.org/) 4.3 以上實作
- [x] 後端使用任一套 [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) 搭配任一套 [RDBMS](https://en.wikipedia.org/wiki/Relational_database)
- [x] 整個 React App 使用 [Functional Component](https://reactjs.org/docs/components-and-props.html#function-and-class-components)
- [x] 使用套件檢查程式碼風格 (例如：[JavaScript Standard](https://standardjs.com/)、[ESLint](https://eslint.org/))
- [x] 專案需要能被公開瀏覽使用 (例如使用 [Heroku](https://www.heroku.com/))
- [x] [單元測試](https://en.wikipedia.org/wiki/Unit_testing)
- [x] [E2E 測試](https://www.browserstack.com/guide/end-to-end-testing)
- [x] 開發時全程使用 [TDD](https://en.wikipedia.org/wiki/Test-driven_development)
- [ ] 整合 [CI/CD](https://en.wikipedia.org/wiki/CI/CD) 流程

## 需挑選以下==至少兩項==功能實作

- [x] 需要驗證網址有效
- [x] 使用者可以使用密碼註冊、登入、登出
- [x] 使用者可以新增、建立、更新、刪除多個短網址
  - [x] 新增、建立、刪除
  - [ ] 更新
- [x] 短網址重新導向的過程使用快取 (可暫時避免向資料庫查詢)
- [x] 使用者可以知道短網址瀏覽次數
  - [x] 獨立紀錄每次瀏覽的時間，且保留可紀錄更多參數欄位，後續可做資料視覺化
- [ ] 服務會避免短網址重複重導向到相同網址
- [x] 從短網址拿到原始網址的 [Open Graph Metadata](https://ogp.me/) （標題、描述、圖片）
- [ ] 使用者可以自訂 [Open Graph Metadata](https://ogp.me/)（標題、描述、圖片）

## 其他

- [ ] 歡迎實作您覺得喜歡的功能，可以讓專案更有創意！
