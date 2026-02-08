# アーキテクチャ

## 採用技術
- HTML / CSS / JavaScript（単一 `index.html`）
- `localStorage`（設定・スコア保存）

## ファイル構成
```
/
  index.html
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
  - `POSITIONS`（UTG, MP, LJ, HJ, CO, BTN, SB, BB）
- 状態:
  - `state = { mode, currentQuiz, currentHand, currentPos, opponentPos, stats, rangePaint }`

## 主要関数
- `getRequiredRank(position, mode)`
- `judgeOpenRaise(hand, position, mode)`
- `judgeActionDecision(hand, heroPos, oppPos, mode)`
- `applyBBException(handRank, oppPos, mode)`
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
  - `yoko-range-trainer:rangePaint:lastSelection:tour`
  - `yoko-range-trainer:rangePaint:lastSelection:ring`

## 判定ロジック要点
- Open Raise: `handRank >= requiredRank`
- Action Decision:
  - `Y <= X` → FOLD
  - `Y == X + 1` → CALL
  - `Y >= X + 2` → 3-BET
- **BB特例**:
  - BB Defenseライン以上は常に CALL
  - 相手がBTNなら `Lv1(Tour) / Lv2(Ring)` 以上で CALL
