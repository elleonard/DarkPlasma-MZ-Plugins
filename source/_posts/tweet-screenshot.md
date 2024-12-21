---
title: ゲーム画面のキャプチャをツイートする
category:
  - プラグイン解説
date: 2023-03-05 19:31:00
tags:
  - システム
---

# 概要

ゲーム画面のキャプチャをツイートする機能を提供します。
imgurにゲーム画面のキャプチャをアップロードし、そのURLをツイートする画面をブラウザで表示します。

# 使用例

![使用例](tweet.png "使用例")
![使用例](tweet-screenshot.png "使用例")

# 利用の前提

本プラグインの利用のためには、imgurのクライアントIDが必要となります。

1. [imgur](https://imgur.com/)にアカウントを作成する
2. [Register an Application](https://api.imgur.com/oauth2/addclient)からアプリケーションを作成する

![アプリケーションの作成](register-an-application.png "アプリケーションの作成")
ゲームごとにアプリケーションを作成し、そのクライアントIDをプラグインパラメータに設定してください。

本プラグインはブラウザプレイに対応しません。

# ダウンロードページへのリンク

[GitHub](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_TweetScreenshot.js)
ダウンロード方法については {% post_link about %} を参照してください。

# 関連プラグイン

- [スクリーンショットの設定を変更する](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_ChangeScreenshotSetting.js)
