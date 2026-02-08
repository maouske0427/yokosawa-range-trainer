# 開発ルール（ベストプラクティス）

## HTML
- `meta viewport` を必ず設定し、モバイルで正しいレイアウトを保証する。
- 見出し・セクションなどはセマンティックな要素を使い可読性を高める。

## CSS
- 色は CSS 変数で一元管理し、配色変更を簡単にする。
- レイアウトは `flex` / `grid` を基本とし、画面幅に応じて崩れない設計にする。
- タップしやすいボタンサイズ（最小44px程度）を確保する。

## JavaScript
- イベントは `addEventListener` で登録し、グリッドはイベント委譲を使う。
- DOM更新は最小限にして不要な再描画を避ける。
- クリック・タップ系は `passive` 付与が不要な場面に限定する（スクロール妨害がないなら `passive: true` を検討）。

## localStorage
- `localStorage` は同期APIなので、保存データを小さく保ち、書き込み頻度を抑える。
- JSONは `JSON.stringify / JSON.parse` で保存し、例外処理を入れる。
- キーはアプリ固有プレフィックスを必ず付与する。

## 参考（Web）
- Responsive Web Design (MDN): https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design
- Viewport meta (MDN): https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element
- Web Storage API (MDN): https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
- Storage quotas (MDN): https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- addEventListener (MDN): https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
