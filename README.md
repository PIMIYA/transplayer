# transplayer

## Setup

```sh
npm install
# or
yarn install
```

## Run

```sh
npm start
# or
yarn start
```

## Note

- 加快速度所使用的方法

目前採用導入 `User Profile` 的方式來 cache 訪問過的頁面以及加快啟動速度

```js
options.addArguments([
  "--user-data-dir=path-of-user-profile/{user-profile-name}"
]);
```

- 隱藏視窗上方被控制的訊息欄位

利用 `Options` 提供的方法來避免顯示

```js
options.excludeSwitches(["enable-automation"]);
```

但因為此方法會造成 `Chrome` 啟動後跳出警告視窗，目前找到的方法是開始實驗性項目 `chrome://flags/#extensions-toolbar-menu`

來避免警告視窗跳出，但 Node.js 版本沒有相關可以設定實驗性項目的 API 所以要先從 `User Profile` 設定。

## Know Issue

- [*] 瀏覽器視窗的 layer 順序
- [*] 廣告問題 安裝 extension 和新增 profile for webdriver
- [*] 更改瀏覽內容比例 可動態或是由 profile 設定
- [*] 背景視窗 scroll 圖片搜尋 但前方影片視窗繼續播影片
- [*] google search 影片 點最多人點閱 並且跳到連接撥放影片 in wide mode
- [*] youtube search 的改進 年度最多點閱與歷史最多點閱?
- [*] 圖片搜尋後 開始滑動面至最下層是否可以自動 fetch 更多(目前時間是夠的),視情況是否增加
