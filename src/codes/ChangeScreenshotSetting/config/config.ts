import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createStructParam } from '../../../../modules/config/createParameter.js';
import { structRectangle } from '../../../../modules/config/struct/Rectangle.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/12/21",
    version: "1.0.0",
    description: "公開",
  }
];

const commandChangeSetting = createCommand("changeSetting", {
  text: "スクショ設定変更",
  description: "スクリーンショットの設定を変更します。",
  args: [
    createStructParam("rect", {
      struct: structRectangle,
      text: "位置とサイズ",
      default: {
        x: 0,
        y: 0,
        width: 816,
        height: 624,
      },
    }),
  ],
});

export const config = new ConfigDefinitionBuilder(
  "ChangeScreenshotSetting",
  2024,
  "スクリーンショットの設定を変更する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structRectangle)
  .withCommand(commandChangeSetting)
  .withOrderAfterDependency({
    name: "DarkPlasma_ScreenshotGallery",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_TweetScreenshot",
  })
  .withHelp(dedent`下記プラグインにおけるスクリーンショットの設定を変更します。
    
    - DarkPlasma_ScreenshotGallery.js
    - DarkPlasma_TweetScreenshot.js
    
    本プラグインで設定した内容はセーブデータに含まれます。`)
  .build();
