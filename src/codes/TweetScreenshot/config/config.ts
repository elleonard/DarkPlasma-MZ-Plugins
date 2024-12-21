import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createStringParam, createCommand, createMultilineStringParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/12/21",
    version: "2.1.0",
    description: "ChangeScreenshotSettingに対応"
  },
  {
    date: "2024/12/21",
    version: "2.0.2",
    description: "ツイートの画像リンクから.jpeg拡張子を除去",
  },
  {
    date: "2024/01/15",
    version: "2.0.1",
    description: "ビルド方式を変更 (configをTypeScript化)",
  },
  {
    date: "2023/03/12",
    version: "2.0.0",
    description: "ツイート用インターフェース変更",
  },
  {
    date: "2023/03/05",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters = [
  createStringParam(
    "clientId",
    {
      text: "imgurクライアントID",
      description: "imgurのアップロードAPIを利用するためのクライアントIDを設定してください。",
    }
  ),
  createMultilineStringParam(
    "tweetText",
    {
      text: "ツイート",
      default: dedent`今日はこのRPGをやってるよ！
      #RPGツクールMZ`,
    }
  ),
];

const commands = [
  createCommand(
    "tweetScreenshot",
    {
      text: "スクリーンショットをツイートする",
    }
  ),
];

export const config = new ConfigDefinitionBuilder(
  "TweetScreenshot",
  2023,
  "ゲーム画面のキャプチャをツイートする"
)
  .withHistories(histories)
  .withParameters(parameters)
  .withCommands(commands)
  .withHelp(dedent`ゲーム画面のキャプチャをimgurに匿名でアップロードし、
  そのURLを付与したツイート画面を開きます。

  利用にはimgurの登録、及びクライアントIDの発行が必要です。

  ブラウザプレイには対応していません。`)
  .build();
