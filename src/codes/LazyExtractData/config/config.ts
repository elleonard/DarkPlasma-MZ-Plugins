import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/08/25",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "LazyExtractData",
  2025,
  "データベース遅延読み込みパート"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`データベースの構造に依存するようなmetaタグなどを
    遅延して展開するためのプラグインです。
    
    本プラグインは単体では動作しません。
    拡張プラグインと一緒に利用してください。`)
  .build();
