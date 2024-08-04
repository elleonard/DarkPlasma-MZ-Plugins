import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/08/04",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "ArcGaugeSample",
  2024,
  "円弧状のゲージサンプル実装"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`円弧状のゲージを扱うサンプル実装です。
    ステータス画面のゲージを円弧状に変えます。`)
  .build();
