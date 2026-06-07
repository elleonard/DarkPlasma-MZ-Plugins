import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/06/07",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "DrawLine",
  2026,
  "直線を描画する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`直線を描画するインターフェースを提供します。
    本プラグインは単体では動作しません。
    拡張プラグインといっしょに利用してください。`)
  .build();
