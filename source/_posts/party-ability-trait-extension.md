---
title: パーティ能力特徴
category:
  - プラグイン解説
date: 2022-01-24 22:29:11
tags:
  - パーティ
  - 装備
  - 職業
  - アクター
  - ステート
  - 特徴
description: パーティ全体に効果を及ぼす特徴を設定可能にします。
---

# 概要

アクター、職業、装備、ステートに、パーティ全体に効果を及ぼす特徴を設定可能にします。

# 使用例

![設定例](party-ability-trait-extension.png "設定例")
パーティ全体の床ダメージ率を0％乗算します。

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_PartyAbilityTraitExtension.js)
ダウンロード方法については {% post_link about %} を参照してください。

# 関連プラグイン

## [パーティ能力特徴をキャッシュする](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_CachePartyAbilityTraits.js)

不要なパーティ能力特徴の再計算を避けるためにキャッシュするプラグインです。

パーティ能力特徴は、一人のアクターが持つ特徴でパーティ全体に影響を及ぼします。
そのため、アクターのパラメーター参照が多い場面においてゲームパフォーマンスの低下が発生することがあります。
特徴の変化がないケースにおいては、パーティ能力特徴をいちいち都度計算するのは無駄なので、キャッシュしてパフォーマンスの低下を避けます。
