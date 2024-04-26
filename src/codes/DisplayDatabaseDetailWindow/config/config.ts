import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/04/26",
    version: "1.0.1",
    description: "詳細説明の前後にある空白を無視する",
  },
  {
    date: "2024/04/20",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "DisplayDatabaseDetailWindow",
  2024,
  "データベース項目の詳細説明を表示するウィンドウ基底"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`ウィンドウにデータベース項目の
  詳細説明を表示するための基底を提供します。
  
  本プラグインは単体では動作しません。
  拡張プラグインとともに利用してください。`)
  .build();
