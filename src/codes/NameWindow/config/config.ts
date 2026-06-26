import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createColorParam, createDatabaseParam, createStringArrayParam, createStruct, createStructArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/06/26",
    version: "2.1.1",
    description: "インスタンス未生成のアクターに対応",
  },
  {
    date: "2026/06/08",
    version: "2.1.0",
    description: "configをTypeScript移行",
  },
  {
    description: "自動名前で無視する制御文字を追加",
  },
  {
    date: "2024/07/08",
    version: "2.0.5",
    description: 'ゲーム中にアクター名を変更した場合、変更後の名前に色設定を適用できない不具合を修正',
  },
  {
    date: "2023/06/02",
    version: "2.0.4",
    description: '自動名前色強制パラメータで、#から始まるカラーコードを無視できない不具合を修正',
  },
  {
    date: "2023/05/15",
    version: "2.0.3",
    description: 'プラグインパラメータの型を変更',
  },
  {
    description: 'typescript移行',
  },
  {
    date: "2021/07/05",
    version: "2.0.2",
    description: 'MZ 1.3.2に対応',
  },
  {
    date: "2021/06/22",
    version: "2.0.1",
    description: 'サブフォルダからの読み込みに対応',
  },
  {
    date: "2020/09/08",
    version: "2.0.0",
    description: 'パラメータ名を変更',
  },
  {
    date: "2020/08/27",
    version: "1.0.0",
    description: 'MZ版公開',
  },
];

const structActorColor: PluginStruct = createStruct("ActorColor", [
  createDatabaseParam("actor", {
    type: 'actor',
    text: "アクター",
  }),
  createColorParam("color", {
    text: "名前の色",
    default: 6,
  }),
]);

const parameters: PluginParameterSchema[] = [
  createColorParam("defaultTextColor", {
    text: "デフォルト文字色",
    description: "名前ウィンドウのデフォルト文字色",
    default: 6,
  }),
  createStructArrayParam("actorColors", {
    struct: structActorColor,
    text: "アクター色設定",
    description: "アクターごとの名前の色を設定する",
  }),
  createBooleanParam("autoNameWindow", {
    text: "自動名前ウィンドウ",
    description: "「及び（を検出して自動で名前ウィンドウを表示する",
    default: false,
  }),
  createBooleanParam("forceAutoNameColor", {
    text: "自動名前色強制",
    description: "自動名前検出した名前の色をこのプラグインの設定に固定する（DarkPlasma_AutoHighlight等による変換を無視する）",
    default: true,
  }),
  createStringArrayParam("ignoreAutoNameControlCharacters", {
    text: "自動名前で無視する制御文字",
    description: "自動名前検出において指定した制御文字を無視します。",
    default: ["UL", "}"],
  }),
];

export const config = new ConfigDefinitionBuilder(
  "NameWindow",
  2026,
  "会話イベント中に名前ウィンドウを表示する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structActorColor)
  .withParameters(parameters)
  .withHelp(dedent`メッセージテキストに以下のように記述すると名前ウィンドウを表示します。

      \n<***>

      また、以下のように入力するとIDに対応するアクター名を名前ウィンドウに表示します。

      \ndp<アクターID>`)
  .build();
