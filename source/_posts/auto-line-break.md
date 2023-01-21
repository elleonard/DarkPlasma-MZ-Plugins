---
title: ウィンドウ幅を超えるテキストを自動で折り返す
category:
  - プラグイン解説
date: 2021-12-29 22:53:35
tags:
  - テキスト
  - MV版あり
---

# 概要

ウィンドウ幅を超えるようなテキストを自動で改行します。

# 使用例

![使用例](auto-line-break.png "使用例")

# 意図せず改行される場合

本プラグインを導入すると、他プラグインによって追加されたウィンドウでも自動改行され、意図しない改行が発生する可能性があります。
その場合は、対象プラグインのウィンドウクラス名を自動改行無効ウィンドウ設定に追加してください。

## よく問題になるプラグインとクラス名

|プラグイン名|バージョン（※）|ウィンドウクラス名|
|:---------|---------:|:----------------|
|[通知メッセージプラグイン - 鳥小屋](https://torigoya-plugin.rutan.dev/map/notifyMessage/)|1.3.0|Window_NotifyMessage|

（※）筆者が確認したバージョン。

# ダウンロードリンク

[GitHub(MZ版)](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_AutoLineBreak.js)
[GitHub(MV版)](https://github.com/elleonard/DarkPlasma-MV-Plugins/blob/release/DarkPlasma_AutoLineBreak.js)
Rawボタンを右クリックして対象をファイルに保存してください。
