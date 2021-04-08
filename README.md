# transplayer

## Setup

```sh
./setup.sh
```

```sh
nvm install node
```

```sh
sudo npm i pm2 -g
```

```sh
npm i
```

## Run

```sh
node sub-process.js
./play.sh
```

## Note

- 加快速度所使用的方法

目前採用導入 `User Profile` 的方式來 cache 訪問過的頁面以及加快啟動速度

```js
options.addArguments([
  "--user-data-dir=path-of-user-profile/{user-profile-name}",
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

- [ ] Google 搜尋服務改變，須適度調適語碼。
