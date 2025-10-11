import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createLocationArrayParam, createLocationParam, createMultilineStringParam, createNumberParam, createSelectParam, createStruct, createStructArrayParam, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/10/11",
    version: "2.0.0",
    description: "パーティの初期位置設定を変更 (Breaking Change)",
  },
  {
    description: "パーティメンバーの数が足りない場合に分割シーンを開けないように変更",
  },
  {
    date: "2025/07/13",
    version: "1.1.1",
    description: "キャラグラが大きい場合の表示を調整",
  },
  {
    description: "空欄との移動表現を変更",
  },
  {
    date: "2025/07/12",
    version: "1.1.0",
    description: "ヘルプテキスト設定を追加",
  },
  {
    description: "背景をぼかす",
  },
  {
    version: "1.0.0",
    description: "公開",
  }
];

const structParty: PluginStruct = createStruct("Party", [
  createLocationParam("location", {
    text: "初期位置",
      description: "パーティの初期位置を指定します。",
  }),
  createSelectParam("direction", {
    text: "初期向き",
    description: "分割したパーティの初期向きを設定します。",
    options: [
      {
        name: "上",
        value: 8,
      },
      {
        name: "下",
        value: 2,
      },
      {
        name: "左",
        value: 4
      },
      {
        name: "右",
        value: 6,
      },
    ],
    default: 2,
  }),
]);

const commandOpen: PluginCommandSchema = createCommand("open", {
  text: "パーティ分割シーンを開く",
  args: [
    createNumberParam("count", {
      text: "パーティ数",
      description: "分割後のパーティ数",
      min: 2,
      max: 3,
      default: 2,
    }),
    createStructArrayParam("parties", {
      struct: structParty,
      text: "パーティ情報",
    }),
  ],
});

const parameters: PluginParameterSchema[] = [
  createBooleanParam("showHelpWindow", {
    text: "ヘルプウィンドウを表示",
    default: true,
  }),
  createMultilineStringParam("helpText", {
    text: "ヘルプ",
    description: "ヘルプウィンドウに表示するテキストを設定します。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "DevidePartyScene",
  2025,
  "パーティ分割シーン"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structParty)
  .withParameters(parameters)
  .withCommand(commandOpen)
  .withBaseDependency({
    name: "DarkPlasma_ConcurrentParty",
    version: "1.2.0",
  })
  .withBaseDependency({
    name: "DarkPlasma_SelectActorCharacterWindow",
    version: "1.1.0",
    order: 'after',
  })
  .withHelp(dedent`パーティを分割するシーンを提供します。`)
  .build();
