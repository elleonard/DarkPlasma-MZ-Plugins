---
title: 並び替えシーン
category:
  - プラグイン解説
date: 2022-01-01 16:13:22
tags:
  - パーティ
  - 並び替え
description: パーティメンバーを並び替えるシーンを提供します。
thumbnail: formation.png
---

# 概要

パーティメンバーを並び替えるシーンを提供します。

# 使用例

![使用例](formation.png "使用例")
![イベント例](formation-event.png "イベント例")

本プラグイン単体では、メニュー画面から並び替えシーンを開くことができません。
以下の方法でメニュー画面から並び替えシーンを開くことができます。
- メニュー拡張系のプラグインを利用して `Scene_Formation` を呼び出すよう設定する
- [メニューの並び替えでシーンを呼び出す](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_FormationInMenu.js)プラグインを利用する

また、戦闘中に並び替えシーンを開くためには[戦闘中に並び替えを行う](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_FormationInBattle.js)プラグインが必要です。

## 紹介動画

<iframe width="560" height="315" src="https://www.youtube.com/embed/bahj4ogR46Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_Formation.js)
ダウンロード方法については {% post_link about %} を参照してください。

# 関連プラグイン

- [メニューの並び替えでシーンを呼び出す](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_FormationInMenu.js)
- [戦闘中に並び替えを行う](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_FormationInBattle.js)
