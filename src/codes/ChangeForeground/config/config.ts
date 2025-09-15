import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createFileParam, createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/09/15",
    version: "1.0.1",
    description: "英語翻訳を追加 (Add English translation)",
  },
  {
    date: "2025/08/12",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const commandChangeForeground = createCommand("ChangeForeground", {
  text: {
    ja: "近景画像を切り替える",
    en: "Change foreground",
  },
  description: {
    ja: "近景画像を切り替えます。",
    en: "Change the foreground image.",
  },
  args: [
    createFileParam("file", {
      text: {
        ja: "ファイル",
        en: "file",
      },
      description: {
        ja: "視差ゼロの画像を指定する場合はファイル名を文字列で直接入力してください。",
        en: "If the name starts '!', you must enter the file name as string.",
      },
      dir: "img/paralaxes",
    }),
    createBooleanParam("loopX", {
      text: {
        ja: "X方向ループ",
        en: "loop X",
      },
      default: false,
    }),
    createBooleanParam("loopY", {
      text: {
        ja: "Y方向ループ",
        en: "loop Y",
      },
      default: false,
    }),
    createNumberParam("scrollSpeedX", {
      text: {
        ja: "X方向スクロール速度",
        en: "X scroll speed",
      },
      description: {
        ja: "X軸方向のスクロール速度を設定します。",
        en: "If loop X is false, this value is ignored.",
      },
    }),
    createNumberParam("scrollSpeedY", {
      text: {
        ja: "Y方向スクロール速度",
        en: "Y scroll speed",
      },
      description: {
        ja: "Y軸方向のスクロール速度を設定します。",
        en: "If loop Y is false, this value is ignored.",
      },
    }),
  ],
});

const commandClearForeground = createCommand("ClearForeground", {
  text: {
    ja: "近景画像を消去する",
    en: "Clear foreground",
  },
  description: {
    ja: "設定された近景画像を消去します。",
    en: "Clear foreground.",
  },
});

export const config = new ConfigDefinitionBuilder(
  "ChangeForeground",
  2025,
  {
    ja: "近景画像を切り替える",
    en: "Change the foreground image.",
  },
)
  .withLocate("en")
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
  .withHelp({
    ja: dedent`準公式プラグインForeground.jsで設定された近景画像を
    プラグインコマンドで切り替えます。`,
    en: dedent `This plugin provide the plugin command
    that change the foreground image set by Foreground.js.`,
  })
  .build();
