---
title: 敵味方に応じてステートを変更
category:
  - プラグイン解説
date: 2022-03-11 11:47:00
tags:
  - ステート
---

# 概要

対象が敵であるか味方であるかに応じて、付与されるステートを変更します。

# 使用例

![設定例1](setting1.png "設定例1")
![設定例2](setting2.png "設定例2")

ステートID4の味方毒を敵キャラに付与しようとすると、ステートID34の敵毒になります。
逆に、ステートID34の敵毒をアクターに付与しようとすると、ステートID4の味方毒になります。

成功判定においては、付与しようとした元々のステートの有効度、無効フラグが用いられることに注意してください。

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_StateAliasBySide.js)
ダウンロード方法については {% post_link about %} を参照してください。
