---
title: 装備絞り込み機能
category:
  - プラグイン解説
date: 2025-08-23 10:13:14
tags:
  - 装備
  - 特徴
description: 装備画面で装備選択をする際に、特徴によって絞り込みできるようになります。
thumbnail: filter-equip1.png
---

# 概要

装備画面で装備選択をする際に、特徴によって絞り込みできるようになります。
大量の装備を使い分けるゲームにオススメです。

# 使用例

![使用例1](filter-equip1.png "使用例 絞り込みなしの状態")

絞り込みなしの状態です。
装備選択で特定のキーを押すと、絞り込みウィンドウが開きます。

![使用例2](filter-equip2.png "使用例 属性有効度の特徴のみに絞り込み")

属性有効度の特徴を持つ装備のみに絞り込みました。
特徴の名前はプラグインパラメータで指定できます。

![使用例3](filter-equip3.png "使用例 特殊能力値の特徴のみに絞り込み")

特殊能力値の特徴を持つ装備のみに絞り込みました。
特殊能力値の表記については、特殊能力値、追加能力値表記テキスト設定プラグインで設定できます。

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_FilterEquip.js)
ダウンロード方法については {% post_link about %} を参照してください。

## 前提プラグイン

### 特殊能力値、追加能力値表記テキスト設定

特殊能力値、追加能力値のテキスト表記を設定するプラグインです。

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_ParameterText.js)

### ウィンドウのハンドラにカスタムキーを追加する

絞り込みウィンドウを開く操作のために必要です。

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_CustomKeyHandler.js)

### 独自の特徴IDを確保する

独自特徴の名前を表示するために必要です。

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_AllocateUniqueTraitId.js)

# 関連プラグイン

- [最近入手した装備を絞り込む](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_FilterEquip_RecentlyGained.js)
