---
title: レベルが特定数値の倍数の対象にのみ有効なステート付加効果
category:
  - プラグイン解説
date: 2023-09-17 18:14:06
tags:
  - アイテム
  - スキル
  - ステート
---

# 概要

レベルが特定数値の倍数の対象にのみ有効なステート付加を行う使用効果を提供します。

# 使用例

![使用例](setting.png "使用例")

レベルが5の倍数の対象に戦闘不能を付与する設定です。

# 敵キャラへの適用について

本プラグインで提供する効果は、レベルを持たない対象に効果を発揮しません。
RPGツクールMZデフォルトでは敵キャラはレベルを持ちません。

敵キャラにレベルを追加するプラグインを使用することにより、本プラグインで提供する効果を敵キャラに対しても発揮できるようになります。

- [DarkPlasma_EnemyLevel](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_EnemyLevel.js)
- [NRP_EnemyPercentParams](https://newrpg.seesaa.net/article/484538732.html)
- [KRD_MZ_EnemyLevel](https://github.com/kuroudo119/RPGMZ-Plugin/blob/master/KRD_MZ_EnemyLevel.js)

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_LevelXState.js)
ダウンロード方法については {% post_link about %} を参照してください。

## 前提プラグイン

### 独自の効果コードIDを確保する

独自の使用効果を追加するため、利用には本プラグインが必要になります。

- [GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_AllocateUniqueEffectCode.js)
