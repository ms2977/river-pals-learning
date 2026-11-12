# 小怪獸探險隊 River Pals Club

[立即試玩](https://ms2977.github.io/river-pals-learning/) · [GitHub 專案](https://github.com/ms2977/river-pals-learning)

適合幼稚園大班與大人一起玩的繁體中文網頁遊戲。三位夥伴：耶穌蜥蜴波波、友善小殭屍蹦蹦、鱷魚咔咔。

## 玩法

選夥伴、練習方式與學習小步驟 → 聽音與選卡 → 五題完成 → 收藏貼紙。三個步驟可自由切換，不強制解鎖。

- 英文第一步：s、a、t、p、i、n 字母音 → sat、sit、pin、pan、tap、nap 逐音拼讀。字母名字與字母音分開試聽。
- 注音第一步：ㄚ、ㄧ、ㄨ、ㄠ、ㄡ、ㄢ 韻母 → 沙／他、雞／七、豬／書、貓／包、狗／手、山／三韻腳配對。詞語與注音有分開標示的播放按鈕。
- 第二步：英文新增 m、d、g、o、b、f 與 map、mat、man、dog、dig、dot、bag、fan；注音新增 ㄜ、ㄞ、ㄟ、ㄣ、ㄤ、ㄥ 與車／喝、白／來、杯／飛、門／盆、湯／方、燈／風。
- 第三步：保留生活單字與入門聲符，再用已教符號拼第一聲的媽、八、他、包、刀、貓。注音拆音使用原有錄音，拼起來的完整音節使用例字朗讀。
- 一起學：先看學習卡、三選一。自己試：直接聽音三選一，拼讀題先聽完整單字／音節。小挑戰：四選一，拼讀題優先加入字形相近選項。隨時可以重聽、再看學習卡、回地圖改玩法；不自動升級。
- 這是入門範圍，尚未涵蓋完整自然發音規則、聲調辨識、結合韻與完整注音拼讀。
- 每回合題目不重複，選項隨機排列；答錯可重試、重聽、看提示。
- 無計時、扣分、排行榜；每完成一回合獲得 5 顆星。
- 3 位夥伴 × 2 種課程，共 6 枚收藏貼紙。
- 注音使用教育部《國語注音符號手冊》（2017）CC BY 4.0 獨立錄音，原樣收錄於 public/audio/zhuyin。Phonics sounds: Phonicademy (phonicademy.com)，十二個字母音依其音訊授權內嵌於 public/audio/phonics。各目錄 ATTRIBUTION.md 及遊戲「給大人的話」列有來源與授權。
- 完整單字、字母名字、中文詞語與鼓勵語使用 Web Speech API。Phonics 設定 en-GB，原有生活單字 en-US，中文 zh-TW；實際語音依裝置而定。音檔播放失敗不以國字朗讀替代注音符號。
- 進度與自動語音偏好儲存在 localStorage，不收集姓名，不跨裝置同步。保留原有 v1 星星、回合數、六枚貼紙，並新增各單元已玩回合數。

## 試玩方式

開啟上方網址即可遊玩，不需註冊或登入。首次遊玩可請大人陪同，點喇叭聽聲音。手機與電腦都能操作；詞語朗讀依裝置可用語音而定。

星星、貼紙與進度只存在目前瀏覽器，不收集孩子姓名；不同裝置或不同網站網址的進度不會自動同步。清除瀏覽器資料會清除紀錄。

## 開發與更新

這是可獨立部署的 Vite + React 靜態版，沒有伺服器登入、資料庫或秘密金鑰。

需要 Node.js 22.13 以上版本：

```sh
npm ci
npm test
npm run dev
```

開發網址會包含 `/river-pals-learning/`。正式建置及預覽：

```sh
npm run build
npm run preview
```

推送到 `main` 後，GitHub Actions 會安裝固定版本套件、執行測試、建立靜態網站並發布到 GitHub Pages。Pages 的部署來源需設定為 **GitHub Actions**。`vite.config.ts` 會依 `GITHUB_REPOSITORY` 設定儲存庫子路徑，音檔也會使用同一個路徑。

## 素材來源

Phonics sounds: Phonicademy (phonicademy.com)。注音錄音來自教育部《國語注音符號手冊》，依 CC BY 4.0 使用。詳細來源與使用限制見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)；音檔內嵌於完整遊戲，不作為獨立素材包提供。
