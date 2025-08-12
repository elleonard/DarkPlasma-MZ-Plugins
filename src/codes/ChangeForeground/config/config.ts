import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createFileParam, createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/08/12",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const commandChangeForeground = createCommand("ChangeForeground", {
  text: "近景画像を切り替える",
  description: "近景画像を切り替えます。",
  args: [
    createFileParam("file", {
      text: "ファイル",
      dir: "img/paralaxes",
    }),
    createBooleanParam("loopX", {
      text: "X方向ループ",
      default: false,
    }),
    createBooleanParam("loopY", {
      text: "Y方向ループ",
      default: false,
    }),
    createNumberParam("scrollSpeedX", {
      text: "X方向スクロール速度",
      description: "X軸方向のスクロール速度を設定します。",
    }),
    createNumberParam("scrollSpeedY", {
      text: "Y方向スクロール速度",
      description: "Y軸方向のスクロール速度を設定します。",
    }),
  ],
});

const commandClearForeground = createCommand("ClearForeground", {
  text: "近景画像を消去する",
  description: "設定された近景画像を消去します。",
});

export const config = new ConfigDefinitionBuilder(
  "ChangeForeground",
  2025,
  "近景画像を切り替える"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommands([
    commandChangeForeground,
    commandClearForeground,
  ])
  .withBaseDependency({
    name: "Foreground",
    version: "1.1.0",
  })
  .withHelp(dedent`準公式プラグインForeground.jsで設定された近景画像を
    プラグインコマンドで切り替えます。`)
  .build();
