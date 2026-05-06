---
title: 食いしばり特徴
category:
  - プラグイン解説
date: 2026-05-06 18:49:44
tags:
  - 特徴
description: 特徴「食いしばり」を提供します。
thumbnail: setting.png
---

# 概要

食いしばり特徴を持つバトラーは、戦闘中にHPが0になる際に戦闘不能になる代わりにHPを1にし、食いしばり回数を1消費します。

食いしばり回数は以下のタイミングで特徴に応じて獲得します。

- 戦闘開始時(装備などですでに得ていた特徴)
- ステート付加(ステートの特徴)

ステートの持つ食いしばり回数は個別に管理されます。
残り回数の少ないステートの持つ回数を優先して消費します。

# 使用例

![設定例](setting.png "設定例")

このステートが付加されているバトラーのHPが0になる際に、戦闘不能にならずHPを1にします。
ステートに設定された食いしばり回数は1のため、消費されて0になり、ステートが解除されます。

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_GutsTrait.js)
ダウンロード方法については {% post_link about %} を参照してください。

## 前提プラグイン

### 値付きステート

- [GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_StateWithValue.js)
