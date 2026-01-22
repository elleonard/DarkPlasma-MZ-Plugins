import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/01/22",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const parameters: PluginParameterSchema[] = [
  createNumberParam("red", {
    text: "赤",
    min: 0,
    max: 255,
    default: 255,
  }),
  createNumberParam("green", {
    text: "緑",
    min: 0,
    max: 255,
    default: 0,
  }),
  createNumberParam("blue", {
    text: "青",
    min: 0,
    max: 255,
    default: 0
  }),
  createNumberParam("opacity", {
    text: "不透明度",
    min: 0,
    max: 255,
    default: 128,
  }),
  createNumberParam("duration", {
    text: "フレーム数",
    default: 8,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "FloorDamageFlash",
  2026,
  "床ダメージ発生時のフラッシュの色・不透明度・フレーム数を設定する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`床ダメージが発生した際のフラッシュの色・不透明度・フレーム数を設定します。`)
  .build();
