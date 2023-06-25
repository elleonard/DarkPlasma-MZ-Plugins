---
title: フキダシアイコンを15個を超えて増やす
category:
  - プラグイン解説
date: 2022-06-19 14:23:16
tags:
  - イベント
---

# 概要

フキダシID16以降をパラメータで定義し、表示するためのプラグインコマンドを提供します。

# 使用例

## デフォルト設定

![設定例](setting1.png "設定例1")

元々ツクールMZに含まれるフキダシアイコン設定と等価な設定です。
ID1～15までを、 system/Balloon.png に割り当てています。
同じ画像には85個までのフキダシを設定できます。
85個のフキダシを1画像に割り当てる場合、終了IDを開始ID+84にします。

## 別画像での追加フキダシ

![設定例](setting2.png "設定例2")
![設定例](setting3.png "設定例3")

Balloon.pngをコピーして色相をいじった BalloonAnother.png を作りました。
この画像にはID16～30のフキダシを割り当てました。

24番の紫色になった電球アナザーフキダシを表示するには、以下のように指定します。

![設定例](setting4.png "設定例4")
![使用例](showBalloon.png "使用例")

## 名前でフキダシを選択する

追加プラグイン生成設定をONにした状態でテストプレイを起動すると、パラメータの設定に応じた内容の追加プラグイン DarkPlasma_NamedExtraBalloon.js がプラグインフォルダ内に生成されます。
そのプラグインを利用することで、IDの数字を入力するのではなく、設定した名前を選択してフキダシを表示できます。

![設定例](setting5.png "設定例5")

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_ExtraBalloon.js)
ダウンロード方法については {% post_link about %} を参照してください。
