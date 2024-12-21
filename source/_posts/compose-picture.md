---
title: 画像を合成してピクチャとして扱う
category:
  - プラグイン解説
date: 2024-04-13 15:53:56
tags:
  - ピクチャ
description: 複数の画像ファイルを合成して1枚のピクチャとして扱います。
thumbnail: event.png
---

# 概要

複数の画像ファイルを合成して1枚のピクチャとして扱います。

# 使用例

![使用例](event.png "使用例")

ベースピクチャを予め表示しておき、その後にプラグインコマンドで合成する画像を指定します。
ピクチャの表示イベントでベース画像を指定する際、不透明度は0でも問題なく合成可能です。

![使用例](compose-picture1.png "使用例")

ピクチャの表示を行った時点ではのっぺらぼうです。

![使用例](compose-picture2.png "使用例")

表情1を選択すると、表情1の差分画像が合成されます。

![使用例](compose-picture3.png "使用例")

表情2も同様。

![使用例](compose-picture4.png "使用例")

差分画像のファイル名には制御文字を使用することも可能です。

![使用例](compose-picture5.png "使用例")

変数を操作すると、自動的に制御文字を評価して対象のファイルを表示します。

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_ComposePicture.js)
ダウンロード方法については {% post_link about %} を参照してください。
