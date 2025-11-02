import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/11/02",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "FillGradientCircle",
  2025,
  "円形グラデーション描画機能"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`円形グラーデション描画機能のインターフェースを提供します。
    
    本プラグインは単体では機能しません。
    拡張プラグインと合わせて利用してください。`)
  .build();
