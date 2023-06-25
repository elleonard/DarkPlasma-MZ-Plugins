---
title: 能力値を固定する特徴
category:
  - プラグイン解説
date: 2022-08-21 22:22:17
tags:
  - アクター
  - 職業
  - 装備
  - ステート
  - 能力値
  - MV版あり
---

# 概要

アクター/職業/装備/ステートのメモ欄に指定の記述を行うことで、指定の能力値または追加能力値を固定する特徴を追加します。
この特徴による能力値の固定は、他の装備や特徴による能力値の増減を無視して適用されます。

# 使用例

![設定例](setting.png "設定例")

# ダウンロードページへのリンク

[GitHub(MZ版)](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_FixParameterTrait.js)
[GitHub(MV版)](https://github.com/elleonard/DarkPlasma-MV-Plugins/blob/release/DarkPlasma_FixParameterTrait.js)
ダウンロード方法については {% post_link about %} を参照してください。

# 前提プラグイン

## 独自の特徴IDを確保する

能力値を固定する特徴プラグインを利用するには本プラグインが必要になります。

[GitHub(MZ版)](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_AllocateUniqueTraitId.js)
[GitHub(MV版)](https://github.com/elleonard/DarkPlasma-MV-Plugins/blob/release/DarkPlasma_AllocateUniqueTraitId.js)
