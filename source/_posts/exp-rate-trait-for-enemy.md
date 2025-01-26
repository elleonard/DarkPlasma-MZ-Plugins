---
title: 敵キャラ用 経験値倍率特徴
category:
  - プラグイン解説
date: 2024-12-29 15:38:10
tags:
  - 敵キャラ
  - 特徴
description: 敵が倒された場合に、その敵から獲得できる経験値報酬に倍率をかける特徴を提供します。
---

# 概要

敵が倒された場合に、その敵から獲得できる経験値報酬に倍率をかける特徴を提供します。

# 設定例

![設定例](exp-rate.png "設定例")

[戦闘不能になっても消えないステートプラグイン](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_StateWithDeath.js)で指定したステートに対し、特徴を追加しています。
このステートにかかった状態の敵を倒すと、その敵から獲得できる経験値報酬が1.5倍になります。

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_ExpRateTraitForEnemy.js)
ダウンロード方法については {% post_link about %} を参照してください。

## 前提プラグイン

### 独自の特徴IDを確保する

独自の特徴を追加するため、利用には本プラグインが必要になります。

- [GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_AllocateUniqueTraitId.js)
