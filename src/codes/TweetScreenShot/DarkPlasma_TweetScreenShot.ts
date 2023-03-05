/// <reference path="./TweetScreenShot.d.ts" />

import { pluginName } from '../../common/pluginName';
import { settings } from './_build/DarkPlasma_TweetScreenShot_parameters';

const IMAGE_UPLOAD_API_URL = "https://api.imgur.com/3/image";

function SceneManager_TweetScreenShotMixIn(sceneManager: typeof SceneManager) {
  sceneManager.tweetScreenShot = function () {
    this.tweetImage(this.snap().canvas.toDataURL("image/jpeg", 1).replace(/^.*,/, ''));
  };

  sceneManager.tweetImage = function (base64Image) {
    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('type', 'base64');
    fetch(IMAGE_UPLOAD_API_URL, {
      method: "POST",
      headers: {
        'Authorization': `Client-ID ${settings.clientId}`,
      },
      body: formData,
    }).then(response => {
      response.json().then(json => {
        if (json.status === 200) {
          const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText(json.data.link.replace('.jpg', ''))}`;
          const exec = require('child_process').exec;
          if (process.platform === 'win32') {
            exec(`rundll32.exe url.dll,FileProtocolHandler "${tweetUrl}"`);
          } else {
            exec(`open "${tweetUrl}"`);
          }
        } else {
          throw new Error(`画像アップロードに失敗しました。 status: ${json.status} error: ${json.data.error}`);
        }
      }).catch(e => {
        this.notifyTweetScreenShotError(e);
      });
    }).catch(e => {
      this.notifyTweetScreenShotError(e);
    });
  };

  sceneManager.notifyTweetScreenShotError = function (error) {
    console.log(error);
  };
}

SceneManager_TweetScreenShotMixIn(SceneManager);

PluginManager.registerCommand(pluginName, 'tweetScreenShot', function () {
  SceneManager.tweetScreenShot();
});

function tweetText(imageUrl: string) {
  return encodeURIComponent(`${settings.tweetText}
${imageUrl}`);
}
