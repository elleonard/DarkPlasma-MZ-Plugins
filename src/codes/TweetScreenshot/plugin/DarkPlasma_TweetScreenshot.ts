/// <reference path="./TweetScreenshot.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { settings } from '../config/_build/DarkPlasma_TweetScreenshot_parameters';

const IMAGE_UPLOAD_API_URL = "https://api.imgur.com/3/image";

function SceneManager_TweetScreenshotMixIn(sceneManager: typeof SceneManager) {
  sceneManager.tweetScreenshot = function () {
    this.tweetImage(this.snap());
  };

  sceneManager.tweetImage = function (image) {
    const base64Image = image.canvas.toDataURL("image/jpeg", 1).replace(/^.*,/, '');
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
        this.notifyTweetScreenshotError(e);
      });
    }).catch(e => {
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

function tweetText(imageUrl: string) {
  return encodeURIComponent(`${settings.tweetText}
${imageUrl}`);
}
