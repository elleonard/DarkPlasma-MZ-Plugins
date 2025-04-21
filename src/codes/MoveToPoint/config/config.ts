import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createLocationParam, createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/04/21",
    version: "1.0.1",
    description: "設定値をtypescript化", 
  },
  {
    date: "2022/11/05",
    version: "1.0.0",
    description: "公開",
  }
];

const moveToParameters: PluginParameterSchema[] = [
  createNumberParam("x", {
    text: "X座標",
    description: "移動先X座標を設定します。"
  }),
  createNumberParam("y", {
    text: "Y座標",
    description: "移動先Y座標を設定します。"
  }),
  createBooleanParam("skip", {
    text: "移動できない場合飛ばす",
    default: false,
  }),
  createBooleanParam("wait", {
    text: "完了までウェイトする",
    default: true,
  }),
];

const commandMovePlayerTo: PluginCommandSchema = createCommand("movePlayerTo", {
  text: "プレイヤーを移動する",
  args: moveToParameters,
});

const commandMoveThisTo: PluginCommandSchema = createCommand("moveThisTo", {
  text: "このイベントを移動する",
  args: moveToParameters,
});

const commandMoveEventTo: PluginCommandSchema = createCommand("moveEventTo", {
  text: "イベントを移動する",
  args: [
    createNumberParam("eventId", {
      text: "イベントID",
      min: 1,
    }),
    ...moveToParameters,
  ],
});

export const config = new ConfigDefinitionBuilder(
  "MoveToPoint",
  2024,
  "指定座標にプレイヤーやイベントを移動させる"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommands([
    commandMovePlayerTo,
    commandMoveThisTo,
    commandMoveEventTo,
  ])
  .withHelp(dedent`指定座標にプレイヤー、イベントを移動させるプラグインコマンドを提供します。`)
  .build();
