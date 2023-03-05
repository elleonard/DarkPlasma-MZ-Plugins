// DarkPlasma_TweetScreenshot 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/03/05 1.0.0 公開
 */

/*:
 * @plugindesc ゲーム画面のキャプチャをツイートする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param clientId
 * @desc imgurのアップロードAPIを利用するためのクライアントIDを設定してください。
 * @text imgurクライアントID
 * @type string
 *
 * @param tweetText
 * @text ツイート
 * @type multiline_string
 * @default 今日はこのRPGをやってるよ！
#RPGツクールMZ

 *
 * @command tweetScreenshot
 * @text スクリーンショットをツイートする
 *
 * @help
 * version: 1.0.0
 * ゲーム画面のキャプチャをimgurに匿名でアップロードし、
 * そのURLを付与したツイート画面を開きます。
 *
 * 利用にはimgurの登録、及びクライアントIDの発行が必要です。
 *
 * ブラウザプレイには対応していません。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    clientId: String(pluginParameters.clientId || ``),
    tweetText: String(
      pluginParameters.tweetText ||
        `今日はこのRPGをやってるよ！
#RPGツクールMZ
`
    ),
  };

  const IMAGE_UPLOAD_API_URL = 'https://api.imgur.com/3/image';
  function SceneManager_TweetScreenshotMixIn(sceneManager) {
    sceneManager.tweetScreenshot = function () {
      this.tweetImage(this.snap().canvas.toDataURL('image/jpeg', 1).replace(/^.*,/, ''));
    };
    sceneManager.tweetImage = function (base64Image) {
      const formData = new FormData();
      formData.append('image', base64Image);
      formData.append('type', 'base64');
      fetch(IMAGE_UPLOAD_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${settings.clientId}`,
        },
        body: formData,
      })
        .then((response) => {
          response
            .json()
            .then((json) => {
              if (json.status === 200) {
                const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText(
                  json.data.link.replace('.jpg', '')
                )}`;
                const exec = require('child_process').exec;
                if (process.platform === 'win32') {
                  exec(`rundll32.exe url.dll,FileProtocolHandler "${tweetUrl}"`);
                } else {
                  exec(`open "${tweetUrl}"`);
                }
              } else {
                throw new Error(`画像アップロードに失敗しました。 status: ${json.status} error: ${json.data.error}`);
              }
            })
            .catch((e) => {
              this.notifyTweetScreenshotError(e);
            });
        })
        .catch((e) => {
          this.notifyTweetScreenshotError(e);
        });
    };
    sceneManager.notifyTweetScreenshotError = function (error) {
      console.log(error);
    };
  }
  SceneManager_TweetScreenshotMixIn(SceneManager);
  PluginManager.registerCommand(pluginName, 'tweetScreenshot', function () {
    SceneManager.tweetScreenshot();
  });
  function tweetText(imageUrl) {
    return encodeURIComponent(`${settings.tweetText}
${imageUrl}`);
  }
})();
