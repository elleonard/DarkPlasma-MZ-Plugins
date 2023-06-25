---
title: 敵キャラ図鑑
category:
  - プラグイン解説
date: 2022-01-01 15:37:44
tags:
  - データベース
  - 敵キャラ
  - MV版あり
---

# 概要

遭遇時に敵キャラを登録する図鑑シーンを提供します。

# 使用例

![使用例](enemy-book.png "使用例")

## 図鑑を開く方法

マップ上であれば、プラグインコマンドで開くことができます。

## 特徴

本プラグインには、下記機能があります。

- {% post_link order-id-alias DarkPlasma_OrderIdAlias %}で表示順を設定できる

# ダウンロードページへのリンク

[GitHub(MZ版)](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_EnemyBook.js)
[GitHub(MV版)](https://github.com/elleonard/DarkPlasma-MV-Plugins/blob/release/DarkPlasma_EnemyBook.js)
ダウンロード方法については {% post_link about %} を参照してください。

## 前提プラグイン

### システムのタイプや弱体にアイコンを設定する (MZ版のみ)

MZ版v5.0.0以降、本プラグインが必要になります。
図鑑上に表示する属性や弱体のアイコンは、本プラグインで設定します。

[GitHub(MZ版)](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_SystemTypeIcon.js)

## 追加プラグイン

### 戦闘中に敵キャラ図鑑を開く (MZ版のみ)

MZ版v5.0.0以降、本体から戦闘中に開く機能を分離しました。
本追加プラグインには、以下の機能があります。

- 戦闘中に開いた場合、出現している敵について
  - 強調表示できる（目次での色を変える）
  - ページ切り替えキーで行き来できる
  - 最上部にまとめて表示できる

[GitHub(MZ版)](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_EnemyBookInBattle.js)

# 類似プラグイン

- [ABMZ_EnemyBook](https://github.com/ebinonote/ABMZ_EnemyBook)
- [NUUN_EnemyBook](https://github.com/nuun888/MZ/blob/master/README/EnemyBook.md)
