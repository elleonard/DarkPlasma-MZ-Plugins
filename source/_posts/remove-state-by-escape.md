---
title: 逃走行動によってステート・強化・弱体解除
category:
  - プラグイン解説
date: 2022-08-13 09:03:14
tags:
  - 戦闘
  - ステート
  - 強化・弱体
---

# 概要

逃走行動によってステート・強化・弱体を解除するかどうかを設定します。

# 解説

逃走行動によって戦闘を離脱したバトラーは、その時点ですべてのステートが解除されます。
強化・弱体は解除されず、戦闘終了後にも残り続けてしまいます。
そのため、本プラグインはステートや強化・弱体に逃走行動によって解除するかどうかを設定します。

詳しくは[【RPGツクールMV/MZ】行動による逃走とその仕様](https://elleonard.github.io/nplus_doc/2022/08/13/engineering/rmmz/escape-by-action/)にて解説しています。

# 使用例

![使用例](setting.png "使用例")

逃走行動によって暗闇ステートを解除しない設定です。

# ダウンロードリンク

[GitHub(MZ版)](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_RemoveStateBuffByEscapeAction.js)
[GitHub(MV版)](https://github.com/elleonard/DarkPlasma-MV-Plugins/blob/release/DarkPlasma_RemoveStateBuffByEscapeAction.js)
Rawボタンを右クリックして対象をファイルに保存してください。
