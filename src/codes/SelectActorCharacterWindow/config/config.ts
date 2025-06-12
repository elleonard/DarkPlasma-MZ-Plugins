import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/07/12",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters: PluginParameterSchema[] = [
  createNumberParam("characterWidth", {
    text: "キャラグラの横サイズ",
    default: 48,
  }),
  createNumberParam("characterHeight", {
    text: "キャラグラの縦サイズ",
    default: 48,
  }),
  createBooleanParam("characterDirectionToLeft", {
    text: "キャラグラ左向き",
    description: "キャラクターグラフィックを左向きで表示するかどうか",
    default: true,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "SelectActorCharacterWindow",
  2025,
  "アクターの歩行グラフィックを表示して選択するウィンドウ"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent``)
  .build();
