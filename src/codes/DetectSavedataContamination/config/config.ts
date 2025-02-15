import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createStringArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/02/15",
    version: "1.1.0",
    description: "クラス名のホワイトリスト設定を追加",
  },
  {
    date: "2024/10/28",
    version: "1.0.0",
    description: "公開",
  }
];

const commandDetect: PluginCommandSchema = createCommand("detect", {
  text: "汚染を検出する",
  description: "セーブデータ汚染を検出します。結果を開発者コンソールに表示します。",
});

const parameters: PluginParameterSchema[] = [
  createBooleanParam("detectBeforeSave", {
    text: "セーブ前に検出",
    description: "ゲームセーブ直前にセーブデータ汚染の検出を行います。セーブに時間がかかるようになります。",
    default: true,
  }),
  createBooleanParam("showClean", {
    text: "汚染なしを表示",
    description: "検出結果に含まれる汚染レベル 汚染なし を表示します。",
    default: false,
  }),
  createBooleanParam("showGood", {
    text: "汚染なしと推定を表示",
    description: "検出結果に含まれる汚染レベル 汚染なしと推定 を表示します。",
    default: false,
  }),
  createBooleanParam("showWarn", {
    text: "汚染の可能性ありを表示",
    description: "検出結果に含まれる 汚染の可能性あり を表示します。",
    default: true,
  }),
  createStringArrayParam("whitelist", {
    text: "汚染なしクラス名",
    description: "ここに指定したクラス名は汚染なしと判定します。",
    default: [
      "Filter_Controller",  // FilterControllerMZ
    ],
  }),
];

export const config = new ConfigDefinitionBuilder(
  "DetectSavedataContamination",
  2024,
  "セーブデータの汚染を検出する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withCommand(commandDetect)
  .withHelp(dedent`プラグインやスクリプトによるセーブデータの汚染を検出します。
    
    セーブデータに含まれるオブジェクトのクラス名を元に汚染を検知します。
    以下の基準で汚染レベルをオブジェクトごとに判定します。
    
    汚染なし: 元々セーブデータに含まれるクラス名である
    汚染なしと推定: 元々セーブデータに含まれないが、Game_で始まる独自クラスである
    汚染の可能性あり: 上記以外の独自クラスである
    汚染: セーブデータに含まれない想定のクラス名である

    本プラグインはセーブデータに異常なオブジェクトが含まれていないか検出するための
    開発用プラグインです。
    ゲームをデプロイメントする際にはOFFにすることを推奨します。
    `)
  .build();
