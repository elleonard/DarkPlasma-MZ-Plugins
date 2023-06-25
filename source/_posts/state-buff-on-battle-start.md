---
title: 戦闘開始時にステート/強化/弱体にかかる
category:
  - プラグイン解説
date: 2023-06-03 11:17:45
tags:
  - ステート
  - 強化・弱体
---

# 概要

アクター、職業、装備、ステート、敵キャラのメモ欄に指定のタグを記述することで、戦闘開始時にステート/強化/弱体にかかる特徴を追加します。

# 設定例

![設定例](setting1.png "設定例")
![設定例](setting2.png "設定例")

戦闘開始時にID41,42のステートにかかります。

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_StateBuffOnBattleStart.js)
ダウンロード方法については {% post_link about %} を参照してください。

## 前提プラグイン

### 独自の特徴IDを確保する

独自の特徴を追加するため、利用には本プラグインが必要になります。

- [GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_AllocateUniqueTraitId.js)
