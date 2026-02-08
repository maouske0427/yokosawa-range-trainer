# アーキテクチャ

## 採用技術
- HTML / CSS / JavaScript（単一ファイル構成）
- `localStorage`（設定・スコア保存）

## ファイル構成
```
/
  index.html
  script.js
  styles.css
  /docs
    requirement.md
    architecture.md
    rules.md
    task.md
```

## 画面構成（HTML想定）
- ヘッダー: タイトル + モード切替トグル
- タブ/セクション: Open Raise / Action Decision / Range Painting
- 問題エリア: 位置・ハンド表示、選択ボタン
- スコアエリア: 連続正解数・正解率・ハイスコア
- グリッドエリア: 13x13レンジ表（Range Painting）

## データ構造（JS）
- 定数:
  - `HAND_RANKS`（仕様に記載のJSON）
  - `POSITIONS_6`（UTG, HJ, CO, BTN, SB, BB）
  - `POSITIONS_9`（UTG, UTG+1, UTG+2, LJ, HJ, CO, BTN, SB, BB）
- 状態:
  - `state = { mode, quiz, open, action, paint... }`

## 主要関数
- `getRequiredRank(position, mode, tableSize)`
- `judgeOpenRaise(hand, position, mode, tableSize)`
- `judgeActionDecision(hand, heroPos, oppPos, mode)`
- `judgeBBDefense(hand, oppPos, mode, tableSize)`
- `buildRangeGrid()` / `toggleRangeCell(hand)`
- `calculateRangeScore()`（正解率・過不足）

## 保存設計（localStorage）
- キープレフィックス: `yoko-range-trainer:`
- 例:
  - `yoko-range-trainer:mode`
  - `yoko-range-trainer:highscore:openRaise:tour`
  - `yoko-range-trainer:highscore:openRaise:ring`
  - `yoko-range-trainer:highscore:actionDecision:tour`
  - `yoko-range-trainer:highscore:actionDecision:ring`
  - `yoko-range-trainer:rangePaint:selection:tour:t6:UTG`

## 判定ロジック要点
- **Open Raise**: `handRank >= requiredRank`（BBはオープンレイズしない）
- **Action Decision**（BBディフェンスを含む）:
  - BB特例（横沢ルール）:
    - 白（Lv3）以上は常にCALL
    - BTN/SBからのレイズ → Lv1（ピンク）までCALL可
    - COからのレイズ → Lv2（紫枠）までCALL可
    - 2ランク以上上 → 3-BET
  - 通常ロジック:
    - `Y <= X` → FOLD
    - `Y == X + 1` → CALL
    - `Y >= X + 2` → 3-BET

