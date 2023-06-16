---
title: HP再生値 MP再生値特徴
category:
  - プラグイン解説
date: 2023-06-16 12:57:07
tags:
  - アクター
  - 職業
  - 装備
  - ステート
  - 敵キャラ
---

# 概要

HP再生値、MP再生値特徴を定義します。
再生値特徴は再生率と異なり、HPやMPの上限値に対する割合ではなく、値によってターン経過時に回復・スリップダメージを受けます。

# 設定例

![設定例](setting1.png "設定例")

アクター「リード」に、毎ターンHPが10回復する特徴を追加します。

# ダウンロードリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_RegenerateByValueTrait.js)
Rawボタンを右クリックして対象をファイルに保存してください。

## 前提プラグイン

### 独自の特徴IDを確保する

独自の特徴を追加するため、利用には本プラグインが必要になります。

- [GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_AllocateUniqueTraitId.js)


## カスタムIDサンプルプラグイン

特徴による回復量を動的に変動させたい場合は、カスタムIDを定義した上で追加のプラグインを書いてください。

[サンプルプラグイン](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_RegenerateByValueTraitCustomSample.js)

![設定例2](setting2.png "設定例2")

サンプルプラグインのパラメータで指定した変数の値分だけ毎ターンHPを回復する特徴を武器「ロングソード」に追加します。

# 類似プラグイン

## [RegenerationFixed.js](https://github.com/triacontane/RPGMakerMV/blob/mz_master/RegenerationFixed.js)(トリアコンタンさん)

HP再生値、MP再生値、TP再生値を設定できます。
これらの固定値を倍率指定で変動させる設定もできます。
