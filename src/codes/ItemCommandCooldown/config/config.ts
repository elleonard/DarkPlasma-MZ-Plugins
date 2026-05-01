import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createColorParam, createNumberParam, createStringParam, createStruct, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/01",
    version: "1.0.2",
    description: "TypeScript移行",
  },
  {
    description: "色設定をカラーパレット対応",
  },
  {
    date: '2021/11/04',
    version: '1.0.1',
    description: '色設定が効かない不具合を修正',
  },
  {
    description: 'クールタイムが表示より1ターン短い不具合を修正',
  },
  {
    date: '2021/11/01',
    version: '1.0.0',
    description: '公開',
  },
];

const structDisplay: PluginStruct = createStruct("DisplaySetting", [
  createBooleanParam("enabled", {
    text: "表示する",
    description: "ONの場合表示します。OFFの場合表示しません。",
    default: true,
  }),
  createStringParam("format", {
    text: "表示形式",
    description: "表示形式を設定します。{turn}がターン数に置き換えられます。",
    default: "CT:{turn}",
  }),
  createColorParam("color", {
    text: "色",
    description: "表示色を設定します。",
    default: 2,
  }),
]);

const parameters: PluginParameterSchema[] = [
  createNumberParam("defaultCooldownTurn", {
    text: "デフォルトターン数",
    description: "デフォルトのクールタイムターン数を設定します。",
    default: 3,
  }),
  createStructParam("display", {
    struct: structDisplay,
    text: "表示設定",
    description: "コマンドの後ろにクールタイムターン数を表示する設定をします。",
    default: {
      enabled: true,
      format: "CT:{turn}",
      color: 2,
    },
  }),
];

export const config = new ConfigDefinitionBuilder(
  "ItemCommandCooldown",
  2026,
  "アイテムコマンドにクールタイムを設定する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structDisplay)
  .withParameters(parameters)
  .withHelp(dedent`アイテムコマンドにクールタイムを設定します。
      アイテムコマンドを使用した後、
      一定ターン数アイテムコマンドを使用不能にできます。

      アクター、装備、ステート、職業のメモ欄に以下のように記述することで
      アイテムコマンドのクールタイムをデフォルトから増減できます。

      <itemCommandCooldownTurnPlus:1>
       クールタイムターン数を1増やす

      <itemCommandCooldownTurnPlus:-1>
       クールタイムターン数を1減らす`)
  .build();
