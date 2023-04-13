---
title: イベントの位置と向きを記録する
category:
  - プラグイン解説
date: 2023-04-13 10:45:28
tags:
  - イベント
  - MV版有り
---

# 概要

RPGツクールMZ（MV）においては、以下の状況でマップのロードが発生し、イベントの位置が初期化されます。

- ゲームデータを更新した後にセーブデータをロードする
- 別のマップから移動してくる

本プラグインではイベントの位置と向きを記録し、マップをロードした際に復元します。

# 使用例

![設定例](event.png "設定例")

# ダウンロードリンク

[GitHub(MZ版)](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_SaveEventLocations.js)
[GitHub(MV版)](https://github.com/elleonard/DarkPlasma-MV-Plugins/blob/master/src/codes/SaveEventLocations/DarkPlasma_SaveEventLocations.js)
Rawボタンを右クリックして対象をファイルに保存してください。
